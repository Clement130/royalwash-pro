// API endpoint to create a Stripe Checkout session for booking payment
// POST /api/checkout

import { NextRequest, NextResponse } from 'next/server';
import { stripe, getFormulaPrice } from '@/lib/stripe';
import { isSlotAvailable } from '@/lib/availability';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { formula, date, time, customerInfo, carModel, specialInstructions } = body;

    // Validate required fields
    if (!formula || !date || !time || !customerInfo) {
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      );
    }

    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    // Verify the slot is still available
    const slotAvailable = isSlotAvailable(date, time);
    if (!slotAvailable) {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 409 }
      );
    }

    // Get price for the formula
    const price = getFormulaPrice(formula as 'essentielle' | 'premium' | 'vip');

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Lavage ${formula.charAt(0).toUpperCase() + formula.slice(1)}`,
              description: `Lavage automobile professionnel à domicile - ${date} à ${time}`,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reserver`,
      customer_email: customerInfo.email,
      metadata: {
        // Store all booking information in metadata to retrieve after payment
        formula,
        date,
        time,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        customerCity: customerInfo.city || '',
        customerPostalCode: customerInfo.postalCode || '',
        carModel: carModel || '',
        specialInstructions: specialInstructions || '',
      },
    });

    // Return the Checkout Session URL
    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
