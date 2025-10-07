import { NextRequest, NextResponse } from 'next/server';
import { getSlot, createBooking, isSlotBooked } from '@/lib/redis';
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

    // Check if slot is already booked
    if (slot.status === 'booked') {
      return NextResponse.json(
        {
          error: 'Slot already booked',
          message: 'This link has already been used and is no longer available.'
        },
        { status: 410 } // 410 Gone
      );
    }

    // Double-check with booking table
    const existingBooking = await isSlotBooked(slotId);
    if (existingBooking) {
      return NextResponse.json(
        {
          error: 'Slot already booked',
          message: 'This link has already been used and is no longer available.'
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

    // Get the selected time slot
    const selectedTimeSlot = slot.timeSlots[selectedTimeSlotIndex];

    // Convert selected time slot to UTC ISO format
    // TimeSlot is stored in creator's timezone: { date: "YYYY-MM-DD", startTime: "HH:mm", endTime: "HH:mm" }
    // toDate() interprets the date string in the given timezone and returns a Date object
    const startDateString = `${selectedTimeSlot.date}T${selectedTimeSlot.startTime}:00`;
    const selectedTimeUTC = toDate(startDateString, { timeZone: slot.timezone });
    const selectedTimeISO = selectedTimeUTC.toISOString(); // UTC time with 'Z' suffix

    // Create booking object
    const booking: Booking = {
      slotId,
      bookedAt: Date.now(),
      bookerName: bookerName.trim(),
      bookerEmail: bookerEmail.trim(),
      bookerNote: bookerNote?.trim() || undefined,
      selectedTime: selectedTimeISO,
      timezone: timezone.trim(),
    };

    // Save booking to Redis
    await createBooking(booking);

    console.log(`✅ Booking confirmed for slot ${slotId} by ${bookerEmail}`);

    // Send confirmation emails (async, don't block response)
    // Story 2.10: Email Notifications
    sendBookingEmails({ slot, booking })
      .then((results) => {
        if (results.confirmationSent && results.notificationSent) {
          console.log(`✅ All booking emails sent successfully for ${slotId}`);
        } else {
          console.warn(`⚠️  Some emails failed for ${slotId}:`, results);
        }
      })
      .catch((error) => {
        // Log error but don't fail the booking
        console.error(`❌ Email sending failed for ${slotId}:`, error);
      });

    // Return success response
    return NextResponse.json({
      success: true,
      bookingId: slotId,
      message: 'Booking confirmed successfully',
      booking: {
        slotId,
        selectedTime: selectedTimeISO,
        bookerName: booking.bookerName,
        bookerEmail: booking.bookerEmail,
        creatorName: slot.creatorName || 'Someone',
        creatorEmail: slot.creatorEmail,
        meetingPurpose: slot.meetingPurpose,
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
