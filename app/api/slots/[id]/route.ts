import { NextRequest, NextResponse } from 'next/server';
import { getSlot } from '@/lib/redis';
import { zonedTimeToUtc } from 'date-fns-tz';

/**
 * GET /api/slots/[id]
 * Retrieve slot details for booking page
 * Story 2.12: Get Slot API
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Validate slot ID
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slot ID' },
        { status: 400 }
      );
    }

    // Fetch slot from Redis
    const slot = await getSlot(id);

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

    // Check if slot is already booked
    if (slot.status === 'booked') {
      return NextResponse.json(
        {
          error: 'Slot already booked',
          message: 'This link has already been used and is no longer available.',
          status: 'booked'
        },
        { status: 410 } // 410 Gone
      );
    }

    // Check if slot has expired (redundant since Redis TTL would delete it, but good for explicitness)
    const now = Date.now();
    const expiresAt = new Date(slot.expiresAt).getTime();

    if (now > expiresAt) {
      return NextResponse.json(
        {
          error: 'Slot expired',
          message: 'This link has expired.',
          status: 'expired'
        },
        { status: 410 } // 410 Gone
      );
    }

    // Transform timeSlots from stored format to UTC ISO strings for the booking page
    // Stored: {date: "YYYY-MM-DD", startTime: "HH:mm", endTime: "HH:mm"} in creator's timezone
    // Return: {start: "UTC ISO string", end: "UTC ISO string"}
    const transformedTimeSlots = slot.timeSlots.map((timeSlot) => {
      // Parse date/time as being in the creator's timezone
      const startDateInCreatorTz = new Date(`${timeSlot.date}T${timeSlot.startTime}:00`);
      const endDateInCreatorTz = new Date(`${timeSlot.date}T${timeSlot.endTime}:00`);

      // Convert to UTC using the creator's timezone
      const startUTC = zonedTimeToUtc(startDateInCreatorTz, slot.timezone);
      const endUTC = zonedTimeToUtc(endDateInCreatorTz, slot.timezone);

      return {
        start: startUTC.toISOString(), // Returns UTC time with 'Z' suffix
        end: endUTC.toISOString(),
      };
    });

    // Return slot data (without sensitive creator email in full)
    return NextResponse.json({
      success: true,
      slot: {
        id: slot.id,
        creatorName: slot.creatorName || 'Someone',
        meetingPurpose: slot.meetingPurpose || 'Meeting',
        timeSlots: transformedTimeSlots,
        timezone: slot.timezone,
        expiresAt: slot.expiresAt,
        status: slot.status,
      },
    });
  } catch (error) {
    console.error('Error fetching slot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slot data' },
      { status: 500 }
    );
  }
}
