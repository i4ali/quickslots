import { NextRequest, NextResponse } from 'next/server';
import { getSlot, createBooking, updateSlotBookingCount, generateBookingId } from '@/lib/redis';
import { Booking } from '@/types/slot';
import { sendBookingEmails } from '@/lib/email';
import { toDate } from 'date-fns-tz';

/**
 * POST /api/slots/[id]/book
 * Book a time slot
 * Story 2.8: Booking API
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slotId } = await context.params;

    // Parse request body
    const body = await request.json();
    const { selectedTimeSlotIndex, bookerName, bookerEmail, bookerNote, timezone } = body;

    // Validate input
    if (!slotId || typeof slotId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slot ID' },
        { status: 400 }
      );
    }

    if (selectedTimeSlotIndex === undefined || selectedTimeSlotIndex === null) {
      return NextResponse.json(
        { error: 'Selected time slot index is required' },
        { status: 400 }
      );
    }

    if (!bookerName || typeof bookerName !== 'string' || !bookerName.trim()) {
      return NextResponse.json(
        { error: 'Booker name is required' },
        { status: 400 }
      );
    }

    if (!bookerEmail || typeof bookerEmail !== 'string' || !bookerEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Valid booker email is required' },
        { status: 400 }
      );
    }

    if (!timezone || typeof timezone !== 'string') {
      return NextResponse.json(
        { error: 'Timezone is required' },
        { status: 400 }
      );
    }

    // Fetch slot from Redis
    const slot = await getSlot(slotId);

    // Check if slot exists
    if (!slot) {
      return NextResponse.json(
        {
          error: 'Slot not found',
          message: 'This link does not exist or has expired.'
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
          message: 'This link has expired.'
        },
        { status: 410 } // 410 Gone
      );
    }

    // Check if slot has reached maximum bookings
    if (slot.bookingsCount >= slot.maxBookings) {
      return NextResponse.json(
        {
          error: 'Slot fully booked',
          message: `All ${slot.maxBookings} booking${slot.maxBookings > 1 ? 's' : ''} have been filled. This link is no longer available.`
        },
        { status: 410 } // 410 Gone
      );
    }

    // Validate selected time slot index
    if (selectedTimeSlotIndex < 0 || selectedTimeSlotIndex >= slot.timeSlots.length) {
      return NextResponse.json(
        { error: 'Invalid time slot selection' },
        { status: 400 }
      );
    }

    // Check if time slot is already booked (for individual mode)
    if (slot.bookingMode === 'individual') {
      const bookedIndices = slot.bookedTimeSlotIndices || [];
      if (bookedIndices.includes(selectedTimeSlotIndex)) {
        return NextResponse.json(
          {
            error: 'Time slot already booked',
            message: 'This time slot has already been booked. Please select a different time.'
          },
          { status: 410 } // 410 Gone
        );
      }
    }

    // Get the selected time slot
    const selectedTimeSlot = slot.timeSlots[selectedTimeSlotIndex];

    // Convert selected time slot to UTC ISO format
    // TimeSlot is stored in creator's timezone: { date: "YYYY-MM-DD", startTime: "HH:mm", endTime: "HH:mm" }
    // toDate() interprets the date string in the given timezone and returns a Date object
    const startDateString = `${selectedTimeSlot.date}T${selectedTimeSlot.startTime}:00`;
    const selectedTimeUTC = toDate(startDateString, { timeZone: slot.timezone });
    const selectedTimeISO = selectedTimeUTC.toISOString(); // UTC time with 'Z' suffix

    // Generate unique booking ID for rescheduling support
    const bookingId = generateBookingId();

    // Create booking object with all required fields
    const booking: Booking = {
      id: bookingId,
      slotId,
      bookedAt: Date.now(),
      bookerName: bookerName.trim(),
      bookerEmail: bookerEmail.trim(),
      bookerNote: bookerNote?.trim() || undefined,
      selectedTime: selectedTimeISO,
      selectedTimeSlotIndex,
      timezone: timezone.trim(),

      // Creator info (needed for emails and rescheduling)
      creatorName: slot.creatorName || 'Someone',
      creatorEmail: slot.creatorEmail,
      meetingPurpose: slot.meetingPurpose,
      meetingLocation: slot.meetingLocation,

      // Initialize rescheduling fields
      rescheduleCount: 0,
    };

    // Save booking to Redis
    await createBooking(booking);

    // Update slot booking count (increments count, updates status if max reached, tracks booked indices)
    await updateSlotBookingCount(slotId, bookingId, selectedTimeSlotIndex); // Pass booking ID for tracking

    console.log(`✅ Booking confirmed for slot ${slotId} by ${bookerEmail}`);

    // Send confirmation emails
    // Story 2.10: Email Notifications
    // Note: We await this to ensure emails are sent before the serverless function terminates
    // This adds ~1-2s latency but ensures reliable email delivery
    try {
      const emailResults = await sendBookingEmails({ slot, booking });
      if (emailResults.confirmationSent && emailResults.notificationSent) {
        console.log(`✅ All booking emails sent successfully for ${slotId}`);
      } else {
        console.warn(`⚠️  Some emails failed for ${slotId}:`, emailResults);
      }
    } catch (error) {
      // Log error but don't fail the booking
      // The booking is already saved, so we don't want to return an error to the user
      console.error(`❌ Email sending failed for ${slotId}:`, error);
    }

    // Return success response with unique booking ID
    return NextResponse.json({
      success: true,
      bookingId: bookingId, // Return unique booking ID for rescheduling
      message: 'Booking confirmed successfully',
      booking: {
        slotId,
        selectedTime: selectedTimeISO,
        bookerName: booking.bookerName,
        bookerEmail: booking.bookerEmail,
        creatorName: booking.creatorName,
        creatorEmail: booking.creatorEmail,
        meetingPurpose: booking.meetingPurpose,
        meetingLocation: booking.meetingLocation,
      },
    });
  } catch (error) {
    console.error('Error processing booking:', error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('not available for booking')) {
        return NextResponse.json(
          { error: 'Slot is not available for booking' },
          { status: 410 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to process booking. Please try again.' },
      { status: 500 }
    );
  }
}
