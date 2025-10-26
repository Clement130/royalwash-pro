// Stripe webhook handler to process payment confirmations
// POST /api/webhooks/stripe
// This endpoint receives events from Stripe when payments are completed

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { bookSlot } from '@/lib/availability';
import fs from 'fs/promises';
import path from 'path';

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  // Verify webhook signature for security
  if (!signature) {
    console.error('No Stripe signature found');
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event;

  try {
    // Verify the webhook signature using the webhook secret
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event based on its type
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        // Payment was successful, create the booking
        const session = event.data.object;
        
        // Extract booking data from metadata
        const metadata = session.metadata;
        if (!metadata) {
          throw new Error('No metadata found in session');
        }

        // Create booking object
        const booking = {
          id: `booking-${Date.now()}`,
          formula: metadata.formula,
          date: metadata.date,
          time: metadata.time,
          customerName: metadata.customerName,
          customerEmail: metadata.customerEmail,
          customerPhone: metadata.customerPhone,
          address: metadata.customerAddress,
          city: metadata.customerCity,
          postalCode: metadata.customerPostalCode,
          carModel: metadata.carModel,
          specialInstructions: metadata.specialInstructions,
          price: session.amount_total ? session.amount_total / 100 : 0,
          status: 'confirmed',
          paymentStatus: 'paid',
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          createdAt: new Date().toISOString(),
        };

        // Save booking to bookings.json
        const bookingsPath = path.join(process.cwd(), 'bookings.json');
        let bookings = [];
        
        try {
          const fileContent = await fs.readFile(bookingsPath, 'utf-8');
          bookings = JSON.parse(fileContent);
        } catch (error) {
          // File doesn't exist yet, start with empty array
          bookings = [];
        }

        bookings.push(booking);
        await fs.writeFile(bookingsPath, JSON.stringify(bookings, null, 2));

        // Block the time slot in availability
        await bookSlot(metadata.date, metadata.time, booking.id);

        console.log('Booking created successfully:', booking.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
