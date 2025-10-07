import { NextRequest, NextResponse } from 'next/server';
import { getSlotTTL, getBookingTTL, getSlot, getBooking } from '@/lib/redis';

/**
 * GET /api/debug/ttl/[slotId]
 * Debug endpoint to check TTL values for a slot and booking
 * Helps verify auto-expiration is working correctly
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slotId: string }> }
) {
  try {
    const { slotId } = await context.params;

    // Get TTL values
    const slotTTL = await getSlotTTL(slotId);
    const bookingTTL = await getBookingTTL(slotId);

    // Get data existence
    const slot = await getSlot(slotId);
    const booking = await getBooking(slotId);

    // Format TTL for readability
    const formatTTL = (seconds: number): string => {
      if (seconds === -1) return 'Key does not exist';
      if (seconds === -2) return 'No expiration set';
      if (seconds < 60) return `${seconds}s`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${mins}m`;
    };

    return NextResponse.json({
      slotId,
      slot: {
        exists: slot !== null,
        status: slot?.status || null,
        ttl: slotTTL,
        ttlFormatted: formatTTL(slotTTL),
      },
      booking: {
        exists: booking !== null,
        ttl: bookingTTL,
        ttlFormatted: formatTTL(bookingTTL),
      },
      explanation: {
        slotTTL: slotTTL === -1
          ? 'Slot has been deleted or expired'
          : slotTTL < 3600
          ? 'Slot was recently booked (expires in <1 hour)'
          : 'Slot is active and waiting for booking',
        bookingTTL: bookingTTL === -1
          ? 'No booking exists for this slot'
          : 'Booking exists and will expire after TTL',
      },
    });
  } catch (error) {
    console.error('Error checking TTL:', error);
    return NextResponse.json(
      { error: 'Failed to check TTL' },
      { status: 500 }
    );
  }
}
