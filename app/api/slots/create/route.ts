import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createSlot } from '@/lib/redis';
import { Slot, SlotStatus, CreateSlotResponse, TimeSlot } from '@/types/slot';
import { isValidEmail } from '@/lib/validation';
import { checkRateLimit, getClientIp, LINK_CREATION_RATE_LIMIT } from '@/lib/rate-limit';

/**
 * POST /api/slots/create
 * Create a new scheduling slot with temporary link
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp, LINK_CREATION_RATE_LIMIT);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. You can create up to 10 links per hour.',
          resetAt: rateLimit.resetAt,
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      creatorName,
      creatorEmail,
      meetingPurpose,
      timeSlots,
      timezone,
    } = body;

    // Validate required fields
    if (!creatorEmail || !timeSlots || !timezone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: creatorEmail, timeSlots, timezone',
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(creatorEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email address',
        },
        { status: 400 }
      );
    }

    // Validate time slots
    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one time slot is required',
        },
        { status: 400 }
      );
    }

    if (timeSlots.length > 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'Maximum 5 time slots allowed per link',
        },
        { status: 400 }
      );
    }

    // Validate each time slot has required fields
    const validatedTimeSlots: TimeSlot[] = timeSlots.map((slot: any) => {
      if (!slot.date || !slot.startTime || !slot.endTime) {
        throw new Error('Each time slot must have date, startTime, and endTime');
      }
      return {
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      };
    });

    // Generate unique slot ID (8 characters, URL-safe)
    const slotId = nanoid(8);

    // Set expiration to 24 hours from now
    const now = Date.now();
    const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours

    // Create slot object
    const slot: Slot = {
      id: slotId,
      createdAt: now,
      expiresAt,
      creatorName: creatorName?.trim() || undefined,
      creatorEmail: creatorEmail.trim(),
      meetingPurpose: meetingPurpose?.trim() || undefined,
      timeSlots: validatedTimeSlots,
      timezone,
      status: SlotStatus.ACTIVE,
      viewCount: 0,
    };

    // Store in Redis with 24-hour TTL
    await createSlot(slot);

    // Generate shareable URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shareableUrl = `${baseUrl}/${slotId}`;

    // Return response
    const response: CreateSlotResponse = {
      success: true,
      slotId,
      shareableUrl,
      expiresAt,
    };

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating slot:', error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('time slot')) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create slot. Please try again.',
      },
      { status: 500 }
    );
  }
}
