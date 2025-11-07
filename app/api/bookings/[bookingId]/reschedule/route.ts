import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, getSlot, getRedisClient } from '@/lib/redis';
import { toDate } from 'date-fns-tz';
import { Booking } from '@/types/slot';

/**
 * PUT /api/bookings/[bookingId]/reschedule
 * Reschedule a booking to a new time slot
 * Business rules:
 * - Maximum 3 reschedules per booking
 * - Cannot reschedule cancelled bookings
 * - Cannot reschedule if slot has expired
 * - New time must be within original slot's available times
 */
export async function PUT(
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

    // Parse request body
    const body = await request.json();
    const { selectedTimeSlotIndex } = body;

    // Validate new time slot index
    if (selectedTimeSlotIndex === undefined || selectedTimeSlotIndex === null) {
      return NextResponse.json(
        { error: 'Selected time slot index is required' },
        { status: 400 }
      );
    }

    // Fetch existing booking
    const booking = await getBookingById(bookingId);

    if (!booking) {
      return NextResponse.json(
        {
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
          error: 'Booking cancelled',
          message: 'Cannot reschedule a cancelled booking.'
        },
        { status: 410 } // 410 Gone
      );
    }

    // Check reschedule limit (max 3 reschedules)
    if (booking.rescheduleCount >= 3) {
      return NextResponse.json(
        {
          error: 'Reschedule limit reached',
          message: 'This booking has already been rescheduled the maximum number of times (3).'
        },
        { status: 403 } // 403 Forbidden
      );
    }

    // Fetch parent slot
    const slot = await getSlot(booking.slotId);

    if (!slot) {
      return NextResponse.json(
        {
          error: 'Slot not found',
          message: 'The original booking slot has expired.'
        },
        { status: 404 }
      );
    }

    // Check if slot has expired
    const now = Date.now();
    if (now > slot.expiresAt) {
      return NextResponse.json(
        {
          error: 'Slot expired',
          message: 'Cannot reschedule - the original booking slot has expired.'
        },
        { status: 410 } // 410 Gone
      );
    }

    // Validate new time slot index
    if (selectedTimeSlotIndex < 0 || selectedTimeSlotIndex >= slot.timeSlots.length) {
      return NextResponse.json(
        { error: 'Invalid time slot selection' },
        { status: 400 }
      );
    }

    // Check if new time slot is already booked (for individual mode)
    if (slot.bookingMode === 'individual') {
      const bookedIndices = slot.bookedTimeSlotIndices || [];
      // Allow rescheduling to the same time slot
      if (bookedIndices.includes(selectedTimeSlotIndex) && selectedTimeSlotIndex !== booking.selectedTimeSlotIndex) {
        return NextResponse.json(
          {
            error: 'Time slot already booked',
            message: 'This time slot has already been booked. Please select a different time.'
          },
          { status: 410 } // 410 Gone
        );
      }
    }

    // Get the new selected time slot
    const newTimeSlot = slot.timeSlots[selectedTimeSlotIndex];

    // Convert new time slot to UTC ISO format
    const startDateString = `${newTimeSlot.date}T${newTimeSlot.startTime}:00`;
    const selectedTimeUTC = toDate(startDateString, { timeZone: slot.timezone });
    const newSelectedTimeISO = selectedTimeUTC.toISOString();

    // Update booking
    const client = getRedisClient();
    if (!client) {
      throw new Error('Redis client not available');
    }

    // Store original selected time on first reschedule
    const originalSelectedTime = booking.originalSelectedTime || booking.selectedTime;

    // Update booking object
    const updatedBooking: Booking = {
      ...booking,
      selectedTime: newSelectedTimeISO,
      selectedTimeSlotIndex: selectedTimeSlotIndex,
      rescheduleCount: booking.rescheduleCount + 1,
      rescheduledAt: Date.now(),
      originalSelectedTime: originalSelectedTime,
    };

    // Get booking key and TTL
    const bookingKey = `booking:${bookingId}`;
    const ttl = await client.ttl(bookingKey);

    // Save updated booking
    await client.set(bookingKey, JSON.stringify(updatedBooking), {
      ex: ttl > 0 ? ttl : 3600, // Preserve TTL
    });

    // Also update legacy slot-based key for backward compatibility
    const legacyBookingKey = `booking:${booking.slotId}`;
    await client.set(legacyBookingKey, JSON.stringify(updatedBooking), {
      ex: ttl > 0 ? ttl : 3600,
    });

    // Update slot's booked time slot indices if booking mode is individual
    if (slot.bookingMode === 'individual') {
      // Remove old index and add new index
      const updatedBookedIndices = (slot.bookedTimeSlotIndices || [])
        .filter(idx => idx !== booking.selectedTimeSlotIndex);

      if (!updatedBookedIndices.includes(selectedTimeSlotIndex)) {
        updatedBookedIndices.push(selectedTimeSlotIndex);
      }

      slot.bookedTimeSlotIndices = updatedBookedIndices;

      const slotKey = `slot:${slot.id}`;
      const slotTTL = await client.ttl(slotKey);
      await client.set(slotKey, JSON.stringify(slot), {
        ex: slotTTL > 0 ? slotTTL : 3600,
      });
    }

    console.log(`✅ Booking ${bookingId} rescheduled (count: ${updatedBooking.rescheduleCount}/3)`);

    // Send rescheduling confirmation emails
    try {
      const { sendRescheduledEmails } = await import('@/lib/email');
      await sendRescheduledEmails({
        slot,
        booking: updatedBooking,
        oldSelectedTime: originalSelectedTime,
      });
      console.log('✅ Reschedule emails sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send reschedule emails:', emailError);
      // Don't fail the request if email sending fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Booking rescheduled successfully',
      booking: {
        id: updatedBooking.id,
        selectedTime: updatedBooking.selectedTime,
        selectedTimeSlotIndex: updatedBooking.selectedTimeSlotIndex,
        rescheduleCount: updatedBooking.rescheduleCount,
        rescheduledAt: updatedBooking.rescheduledAt,
        originalSelectedTime: updatedBooking.originalSelectedTime,
      },
    });
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    return NextResponse.json(
      { error: 'Failed to reschedule booking. Please try again.' },
      { status: 500 }
    );
  }
}
