import { NextRequest, NextResponse } from 'next/server';
import { getSlot, getBooking } from '@/lib/redis';

/**
 * GET /api/bookings/[slotId]
 * Retrieve booking details for confirmation page
 * Fallback when sessionStorage is empty (refresh, strict mode, etc.)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slotId: string }> }
) {
  try {
    const { slotId } = await context.params;

    // Validate slot ID
    if (!slotId || typeof slotId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slot ID' },
        { status: 400 }
      );
    }

    // Fetch booking from Redis
    const booking = await getBooking(slotId);

    if (!booking) {
      return NextResponse.json(
        {
          error: 'Booking not found',
          message: 'This booking does not exist or has expired.'
        },
        { status: 404 }
      );
    }

    // Fetch slot data to get creator info and meeting purpose
    const slot = await getSlot(slotId);

    if (!slot) {
      return NextResponse.json(
        {
          error: 'Slot not found',
          message: 'The associated booking link has expired.'
        },
        { status: 404 }
      );
    }

    // Return booking data for confirmation page
    return NextResponse.json({
      success: true,
      booking: {
        slotId,
        selectedTime: booking.selectedTime,
        bookerName: booking.bookerName,
        bookerEmail: booking.bookerEmail,
        bookerNote: booking.bookerNote,
        bookerTimezone: booking.timezone,
        creatorName: slot.creatorName || 'Someone',
        creatorEmail: slot.creatorEmail,
        meetingPurpose: slot.meetingPurpose,
      },
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking data' },
      { status: 500 }
    );
  }
}
