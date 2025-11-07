import { NextRequest, NextResponse } from 'next/server';
import { getBookingById } from '@/lib/redis';

/**
 * GET /api/bookings/[bookingId]
 * Retrieve booking details by unique booking ID
 * Used for rescheduling and cancellation flows
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await context.params;

    // Validate booking ID
    if (!bookingId || typeof bookingId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    // Fetch booking from Redis by unique booking ID
    const booking = await getBookingById(bookingId);

    // Check if booking exists
    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking not found',
          message: 'This booking does not exist or has expired.'
        },
        { status: 404 }
      );
    }

    // Check if booking has been cancelled
    if (booking.cancelledAt) {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking cancelled',
          message: 'This booking has been cancelled.',
          booking: {
            id: booking.id,
            cancelledAt: booking.cancelledAt,
            originalSelectedTime: booking.originalSelectedTime || booking.selectedTime,
          }
        },
        { status: 410 } // 410 Gone
      );
    }

    // Return booking data
    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        slotId: booking.slotId,
        bookedAt: booking.bookedAt,
        bookerName: booking.bookerName,
        bookerEmail: booking.bookerEmail,
        bookerNote: booking.bookerNote,
        selectedTime: booking.selectedTime,
        selectedTimeSlotIndex: booking.selectedTimeSlotIndex,
        timezone: booking.timezone,
        creatorName: booking.creatorName,
        creatorEmail: booking.creatorEmail,
        meetingPurpose: booking.meetingPurpose,
        meetingLocation: booking.meetingLocation,
        rescheduleCount: booking.rescheduleCount,
        rescheduledAt: booking.rescheduledAt,
        originalSelectedTime: booking.originalSelectedTime,
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
