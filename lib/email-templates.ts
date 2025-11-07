/**
 * Email Templates for WhenAvailable
 *
 * Plain text email templates for booking notifications
 */

import type { Slot, Booking, MeetingLocation } from '@/types/slot';

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

/**
 * Format meeting location for email
 */
function formatMeetingLocation(location: MeetingLocation): string {
  switch (location.type) {
    case 'phone':
      return `📞 Phone Call${location.details.phoneNumber ? `\n   Number: ${location.details.phoneNumber}` : ''}`;
    case 'in-person':
      return `📍 In-Person Meeting${location.details.address ? `\n   Location: ${location.details.address}` : ''}`;
    case 'custom':
      return `🔗 ${location.details.customLinkLabel || 'Video Call'}${location.details.customLink ? `\n   Link: ${location.details.customLink}` : ''}`;
    default:
      return '';
  }
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

  const locationText = slot.meetingLocation
    ? `\n${formatMeetingLocation(slot.meetingLocation)}`
    : '';

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://whenavailable.app';
  const rescheduleUrl = `${appUrl}/reschedule/${booking.id}`;
  const cancelUrl = `${appUrl}/reschedule/${booking.id}?action=cancel`;

  const text = `
You've successfully booked a slot!

Meeting Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date & Time: ${meetingDate} at ${meetingTime}
With: ${creatorName}${slot.creatorEmail ? ` (${slot.creatorEmail})` : ''}
${slot.meetingPurpose ? `Purpose: ${slot.meetingPurpose}` : ''}${locationText}
${booking.bookerNote ? `\nYour Note: ${booking.bookerNote}` : ''}

What's Next:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• You'll receive a calendar invite attachment with this email
• The organizer has been notified
• Please mark your calendar!

Need to Change Your Appointment?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reschedule: ${rescheduleUrl}
Cancel: ${cancelUrl}

Questions? Reply to this email to contact the organizer.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Scheduled with WhenAvailable - Temporary scheduling links
${appUrl}
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

  const subject = `Someone booked your WhenAvailable link!`;

  const locationText = slot.meetingLocation
    ? `\n${formatMeetingLocation(slot.meetingLocation)}`
    : '';

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
${slot.meetingPurpose ? `Purpose: ${slot.meetingPurpose}` : 'No purpose specified'}${locationText}

What's Next:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• A calendar invite is attached to this email
• You can reply to this email to contact ${booking.bookerName}
• The scheduling link has expired after this booking

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WhenAvailable - Temporary scheduling links
${process.env.NEXT_PUBLIC_APP_URL || 'https://whenavailable.app'}
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
  const subject = 'WhenAvailable Email Test';

  const text = `
This is a test email from WhenAvailable.

If you're seeing this, your email configuration is working correctly!

Test Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sent to: ${recipientEmail}
Timestamp: ${new Date().toISOString()}
Environment: ${process.env.NODE_ENV || 'development'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WhenAvailable - Temporary scheduling links
${process.env.NEXT_PUBLIC_APP_URL || 'https://whenavailable.app'}
  `.trim();

  return { subject, text };
}

// =============================================================================
// Booking Rescheduled Email (to Booker)
// =============================================================================

export interface BookingRescheduledData {
  slot: Slot;
  booking: Booking;
  oldSelectedTime: string;
}

export function generateBookingRescheduledEmail(data: BookingRescheduledData): {
  subject: string;
  text: string;
} {
  const { slot, booking, oldSelectedTime } = data;

  const oldMeetingDate = formatDate(oldSelectedTime);
  const oldMeetingTime = formatTimeWithTimezone(oldSelectedTime, booking.timezone);

  const newMeetingDate = formatDate(booking.selectedTime);
  const newMeetingTime = formatTimeWithTimezone(booking.selectedTime, booking.timezone);

  const creatorName = slot.creatorName || 'the organizer';

  const subject = `Meeting Rescheduled: ${newMeetingDate} with ${creatorName}`;

  const locationText = slot.meetingLocation
    ? `\n${formatMeetingLocation(slot.meetingLocation)}`
    : '';

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://whenavailable.app';
  const rescheduleUrl = `${appUrl}/reschedule/${booking.id}`;
  const cancelUrl = `${appUrl}/reschedule/${booking.id}?action=cancel`;

  const text = `
Your meeting has been rescheduled!

Previous Time:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${oldMeetingDate} at ${oldMeetingTime}

New Meeting Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date & Time: ${newMeetingDate} at ${newMeetingTime}
With: ${creatorName}${slot.creatorEmail ? ` (${slot.creatorEmail})` : ''}
${slot.meetingPurpose ? `Purpose: ${slot.meetingPurpose}` : ''}${locationText}
${booking.bookerNote ? `\nYour Note: ${booking.bookerNote}` : ''}

What's Next:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• You'll receive an updated calendar invite with this email
• The old calendar event will be cancelled
• Please update your calendar!

Reschedule Count: ${booking.rescheduleCount} / 3 used

Need to Change Again?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reschedule: ${rescheduleUrl}
Cancel: ${cancelUrl}

Questions? Reply to this email to contact the organizer.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Scheduled with WhenAvailable - Temporary scheduling links
${appUrl}
  `.trim();

  return { subject, text };
}

// =============================================================================
// Booking Rescheduled Notification Email (to Creator)
// =============================================================================

export function generateBookingRescheduledNotificationEmail(data: BookingRescheduledData): {
  subject: string;
  text: string;
} {
  const { slot, booking, oldSelectedTime } = data;

  const oldMeetingDate = formatDate(oldSelectedTime);
  const oldMeetingTime = formatTimeWithTimezone(oldSelectedTime, slot.timezone);

  const newMeetingDate = formatDate(booking.selectedTime);
  const newMeetingTime = formatTimeWithTimezone(booking.selectedTime, slot.timezone);

  const subject = `${booking.bookerName} rescheduled your meeting`;

  const locationText = slot.meetingLocation
    ? `\n${formatMeetingLocation(slot.meetingLocation)}`
    : '';

  const text = `
${booking.bookerName} has rescheduled their meeting with you.

Previous Time:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${oldMeetingDate} at ${oldMeetingTime}

New Meeting Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Attendee: ${booking.bookerName}
Email: ${booking.bookerEmail}
Date & Time: ${newMeetingDate} at ${newMeetingTime}
${booking.bookerNote ? `\nTheir Note: ${booking.bookerNote}` : ''}

Meeting Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${slot.meetingPurpose ? `Purpose: ${slot.meetingPurpose}` : 'No purpose specified'}${locationText}

What's Next:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• An updated calendar invite is attached to this email
• The old calendar event will be cancelled
• You can reply to this email to contact ${booking.bookerName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WhenAvailable - Temporary scheduling links
${process.env.NEXT_PUBLIC_APP_URL || 'https://whenavailable.app'}
  `.trim();

  return { subject, text };
}

// =============================================================================
// Booking Cancelled Email (to Booker)
// =============================================================================

export interface BookingCancelledData {
  slot: Slot;
  booking: Booking;
}

export function generateBookingCancelledEmail(data: BookingCancelledData): {
  subject: string;
  text: string;
} {
  const { slot, booking } = data;

  const meetingDate = formatDate(booking.selectedTime);
  const meetingTime = formatTimeWithTimezone(booking.selectedTime, booking.timezone);
  const creatorName = slot.creatorName || 'the organizer';

  const subject = `Booking Cancelled: ${meetingDate} with ${creatorName}`;

  const locationText = slot.meetingLocation
    ? `\n${formatMeetingLocation(slot.meetingLocation)}`
    : '';

  const text = `
Your booking has been cancelled.

Cancelled Meeting Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date & Time: ${meetingDate} at ${meetingTime}
With: ${creatorName}${slot.creatorEmail ? ` (${slot.creatorEmail})` : ''}
${slot.meetingPurpose ? `Purpose: ${slot.meetingPurpose}` : ''}${locationText}

What's Next:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• You'll receive a calendar cancellation notice
• The organizer has been notified of the cancellation
• If you need to reschedule, please contact ${creatorName} directly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WhenAvailable - Temporary scheduling links
${process.env.NEXT_PUBLIC_APP_URL || 'https://whenavailable.app'}
  `.trim();

  return { subject, text };
}

// =============================================================================
// Booking Cancelled Notification Email (to Creator)
// =============================================================================

export function generateBookingCancelledNotificationEmail(data: BookingCancelledData): {
  subject: string;
  text: string;
} {
  const { slot, booking } = data;

  const meetingDate = formatDate(booking.selectedTime);
  const meetingTime = formatTimeWithTimezone(booking.selectedTime, slot.timezone);

  const subject = `${booking.bookerName} cancelled their booking`;

  const locationText = slot.meetingLocation
    ? `\n${formatMeetingLocation(slot.meetingLocation)}`
    : '';

  const text = `
${booking.bookerName} has cancelled their booking with you.

Cancelled Meeting Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Attendee: ${booking.bookerName}
Email: ${booking.bookerEmail}
Date & Time: ${meetingDate} at ${meetingTime}

Meeting Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${slot.meetingPurpose ? `Purpose: ${slot.meetingPurpose}` : 'No purpose specified'}${locationText}

What's Next:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• You'll receive a calendar cancellation notice
• The time slot is now available for others to book
• You can reply to this email to contact ${booking.bookerName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WhenAvailable - Temporary scheduling links
${process.env.NEXT_PUBLIC_APP_URL || 'https://whenavailable.app'}
  `.trim();

  return { subject, text };
}
