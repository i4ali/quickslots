/**
 * Email Templates for QuickSlots
 *
 * Plain text email templates for booking notifications
 */

import type { Slot, Booking } from '@/types/slot';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Format a date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time with timezone
 */
function formatTimeWithTimezone(isoString: string, timezone: string): string {
  const date = new Date(isoString);
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });

  // Get timezone abbreviation
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZoneName: 'short',
    timeZone: timezone,
  });

  const parts = formatter.formatToParts(date);
  const tzName = parts.find((part) => part.type === 'timeZoneName')?.value || timezone;

  return `${time} ${tzName}`;
}

// =============================================================================
// Booking Confirmation Email (to Booker)
// =============================================================================

export interface BookingConfirmationData {
  slot: Slot;
  booking: Booking;
}

export function generateBookingConfirmationEmail(data: BookingConfirmationData): {
  subject: string;
  text: string;
} {
  const { slot, booking } = data;

  const meetingDate = formatDate(booking.selectedTime);
  const meetingTime = formatTimeWithTimezone(booking.selectedTime, booking.timezone);
  const creatorName = slot.creatorName || 'the organizer';

  const subject = `Your meeting is confirmed! ${meetingDate} with ${creatorName}`;

  const text = `
You've successfully booked a slot!

Meeting Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date & Time: ${meetingDate} at ${meetingTime}
With: ${creatorName}${slot.creatorEmail ? ` (${slot.creatorEmail})` : ''}
${slot.meetingPurpose ? `Purpose: ${slot.meetingPurpose}` : ''}
${booking.bookerNote ? `\nYour Note: ${booking.bookerNote}` : ''}

What's Next:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• You'll receive a calendar invite attachment with this email
• The organizer has been notified
• Please mark your calendar!

Questions? Reply to this email to contact the organizer.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Scheduled with QuickSlots - Temporary scheduling links
${process.env.NEXT_PUBLIC_APP_URL || 'https://quickslots.com'}
  `.trim();

  return { subject, text };
}

// =============================================================================
// Booking Notification Email (to Creator)
// =============================================================================

export interface BookingNotificationData {
  slot: Slot;
  booking: Booking;
}

export function generateBookingNotificationEmail(data: BookingNotificationData): {
  subject: string;
  text: string;
} {
  const { slot, booking } = data;

  const meetingDate = formatDate(booking.selectedTime);
  const meetingTime = formatTimeWithTimezone(booking.selectedTime, slot.timezone);

  const subject = `Someone booked your QuickSlots link!`;

  const text = `
Good news! Your availability has been booked.

Booking Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booked by: ${booking.bookerName}
Email: ${booking.bookerEmail}
Date & Time: ${meetingDate} at ${meetingTime}
${booking.bookerNote ? `\nTheir Note: ${booking.bookerNote}` : ''}

Meeting Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${slot.meetingPurpose ? `Purpose: ${slot.meetingPurpose}` : 'No purpose specified'}

What's Next:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• A calendar invite is attached to this email
• You can reply to this email to contact ${booking.bookerName}
• The scheduling link has expired after this booking

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QuickSlots - Temporary scheduling links
${process.env.NEXT_PUBLIC_APP_URL || 'https://quickslots.com'}
  `.trim();

  return { subject, text };
}

// =============================================================================
// Test Email
// =============================================================================

export function generateTestEmail(recipientEmail: string): {
  subject: string;
  text: string;
} {
  const subject = 'QuickSlots Email Test';

  const text = `
This is a test email from QuickSlots.

If you're seeing this, your email configuration is working correctly!

Test Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sent to: ${recipientEmail}
Timestamp: ${new Date().toISOString()}
Environment: ${process.env.NODE_ENV || 'development'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QuickSlots - Temporary scheduling links
${process.env.NEXT_PUBLIC_APP_URL || 'https://quickslots.com'}
  `.trim();

  return { subject, text };
}
