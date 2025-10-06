/**
 * Test Email API Endpoint
 *
 * Sends a test email to verify SendGrid configuration
 * Usage: POST /api/test-email with { "email": "your@email.com" }
 */

import { NextRequest, NextResponse } from 'next/server';
import emailClient from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Check if email is configured
    if (!emailClient.isConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email service not configured. Set SENDGRID_API_KEY in .env.local',
        },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !emailClient.isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid email address required',
        },
        { status: 400 }
      );
    }

    // Send test email
    const sanitizedEmail = emailClient.sanitizeEmail(email);
    const success = await emailClient.sendTestEmail(sanitizedEmail);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent to ${sanitizedEmail}`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send test email. Check server logs for details.',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Test email API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
