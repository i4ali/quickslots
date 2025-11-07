import { NextRequest, NextResponse } from 'next/server';
import { getBookingById, getSlot, getRedisClient } from '@/lib/redis';
import { Booking } from '@/types/slot';

/**
 * DELETE /api/bookings/[bookingId]/cancel
 * Cancel a booking and free up the time slot
 * - Marks booking as cancelled
 * - Decrements slot booking count
 * - Updates slot status back to 'active' if it was 'booked'
 * - Removes booked time slot index (for individual mode)
 */
export async function DELETE(
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

    // Check if booking is already cancelled
    if (booking.cancelledAt) {
      return NextResponse.json(
        {
          error: 'Booking already cancelled',
          message: 'This booking has already been cancelled.',
          cancelledAt: booking.cancelledAt,
        },
        { status: 410 } // 410 Gone
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

    // Update booking to mark as cancelled
    const client = getRedisClient();
    if (!client) {
      throw new Error('Redis client not available');
    }

    const cancelledBooking: Booking = {
      ...booking,
      cancelledAt: Date.now(),
    };

    // Get booking key and TTL
    const bookingKey = `booking:${bookingId}`;
    const ttl = await client.ttl(bookingKey);

    // Save cancelled booking (keep it for 24 hours for reference)
    await client.set(bookingKey, JSON.stringify(cancelledBooking), {
      ex: ttl > 0 ? ttl : 86400, // Keep for 24 hours
    });

    // Also update legacy slot-based key
    const legacyBookingKey = `booking:${booking.slotId}`;
    await client.set(legacyBookingKey, JSON.stringify(cancelledBooking), {
      ex: ttl > 0 ? ttl : 86400,
    });

    // Update slot: decrement booking count and update status
    slot.bookingsCount = Math.max(0, (slot.bookingsCount || 1) - 1);

    // Remove booking ID from slot's bookings array
    if (slot.bookings && Array.isArray(slot.bookings)) {
      slot.bookings = slot.bookings.filter(id => id !== bookingId);
    }

    // Remove booked time slot index (for individual mode)
    if (slot.bookingMode === 'individual' && slot.bookedTimeSlotIndices) {
      slot.bookedTimeSlotIndices = slot.bookedTimeSlotIndices.filter(
        idx => idx !== booking.selectedTimeSlotIndex
      );
    }

    // Update slot status back to 'active' if it was 'booked'
    if (slot.status === 'booked' && slot.bookingsCount < slot.maxBookings) {
      slot.status = 'active';
    }

    // Save updated slot
    const slotKey = `slot:${slot.id}`;
    const slotTTL = await client.ttl(slotKey);
    await client.set(slotKey, JSON.stringify(slot), {
      ex: slotTTL > 0 ? slotTTL : 3600,
    });

    console.log(`✅ Booking ${bookingId} cancelled. Slot ${slot.id} booking count: ${slot.bookingsCount}/${slot.maxBookings}`);

    // Send cancellation confirmation emails
    try {
      const { sendCancellationEmails } = await import('@/lib/email');
      await sendCancellationEmails({
        slot,
        booking: cancelledBooking,
      });
      console.log('✅ Cancellation emails sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send cancellation emails:', emailError);
      // Don't fail the request if email sending fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: {
        id: cancelledBooking.id,
        cancelledAt: cancelledBooking.cancelledAt,
        originalSelectedTime: cancelledBooking.originalSelectedTime || cancelledBooking.selectedTime,
      },
      slot: {
        id: slot.id,
        status: slot.status,
        bookingsCount: slot.bookingsCount,
        maxBookings: slot.maxBookings,
      },
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking. Please try again.' },
      { status: 500 }
    );
  }
}
