import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, getSlot } from '@/lib/redis';
import { toDate } from 'date-fns-tz';

/**
 * GET /api/bookings/[bookingId]
 * Fetch booking details by booking ID
 * Used by reschedule/cancel pages to load booking information
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

    // Fetch booking
    const booking = await getBookingById(bookingId);

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

    // Check if booking is cancelled
    if (booking.cancelledAt) {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking cancelled',
          message: 'This link has already been used and is no longer available.',
          cancelledAt: booking.cancelledAt,
        },
        { status: 410 } // 410 Gone
      );
    }

    // Fetch parent slot to include additional information
    const slot = await getSlot(booking.slotId);

    if (!slot) {
      return NextResponse.json(
        {
          success: false,
          error: 'Slot not found',
          message: 'The original booking slot has expired.'
        },
        { status: 404 }
      );
    }

    // Transform timeSlots to ISO format for frontend
    const transformedTimeSlots = slot.timeSlots.map((timeSlot) => {
      const startDateString = `${timeSlot.date}T${timeSlot.startTime}:00`;
      const endDateString = `${timeSlot.date}T${timeSlot.endTime}:00`;

      const startUTC = toDate(startDateString, { timeZone: slot.timezone });
      const endUTC = toDate(endDateString, { timeZone: slot.timezone });

      return {
        start: startUTC.toISOString(),
        end: endUTC.toISOString(),
      };
    });

    // Return booking with full slot information for rescheduling
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
        rescheduleCount: booking.rescheduleCount || 0,
        rescheduledAt: booking.rescheduledAt,
        originalSelectedTime: booking.originalSelectedTime,
        // Include slot creator info
        creatorName: slot.creatorName,
        creatorEmail: slot.creatorEmail,
        meetingPurpose: slot.meetingPurpose,
        meetingLocation: slot.meetingLocation,
      },
      // Include full slot data for reschedule page with transformed timeSlots
      slot: {
        id: slot.id,
        creatorName: slot.creatorName,
        meetingPurpose: slot.meetingPurpose,
        timeSlots: transformedTimeSlots,
        timezone: slot.timezone,
        expiresAt: slot.expiresAt,
        status: slot.status,
        maxBookings: slot.maxBookings,
        bookingsCount: slot.bookingsCount,
        expirationDays: slot.expirationDays,
        bookingMode: slot.bookingMode,
        bookedTimeSlotIndices: slot.bookedTimeSlotIndices || [],
        meetingLocation: slot.meetingLocation,
      },
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking. Please try again.' },
      { status: 500 }
    );
  }
}
