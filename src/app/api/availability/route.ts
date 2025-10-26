// API endpoint to retrieve available time slots for a given date
// GET /api/availability?date=YYYY-MM-DD

import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/availability';

export async function GET(request: NextRequest) {
  try {
    // Extract date from query parameters
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    // Validate date parameter
    if (!dateParam) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateParam)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Parse the date
    const requestedDate = new Date(dateParam);
    
    // Check if date is valid
    if (isNaN(requestedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date' },
        { status: 400 }
      );
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    requestedDate.setHours(0, 0, 0, 0);
    
    if (requestedDate < today) {
      return NextResponse.json(
        { error: 'Cannot retrieve slots for past dates' },
        { status: 400 }
      );
    }

    // Get available slots for the requested date
    const slots = await getAvailableSlots(dateParam);

    // Return the slots with additional metadata
    return NextResponse.json({
      date: dateParam,
      slots: slots,
      count: slots.length,
    });

  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
