/**
 * Email Client for WhenAvailable
 *
 * SendGrid integration for booking notifications
 */

import sgMail from '@sendgrid/mail';
import { getEnvConfig, isServiceConfigured } from './env';
import {
  generateBookingConfirmationEmail,
  generateBookingNotificationEmail,
  generateTestEmail,
  generateBookingRescheduledEmail,
  generateBookingRescheduledNotificationEmail,
  generateBookingCancelledEmail,
  generateBookingCancelledNotificationEmail,
  type BookingConfirmationData,
  type BookingNotificationData,
  type BookingRescheduledData,
  type BookingCancelledData,
} from './email-templates';
import { generateBookingICS } from './ics';

// =============================================================================
// SendGrid Client Initialization
// =============================================================================

let isInitialized = false;

/**
 * Initialize SendGrid client
 */
function initializeSendGrid(): boolean {
  console.log(`📧 [initializeSendGrid] Checking initialization... (isInitialized: ${isInitialized})`);

  if (isInitialized) {
    console.log('✅ [initializeSendGrid] Already initialized');
    return true;
  }

  const serviceConfigured = isServiceConfigured('email');
  console.log(`📧 [initializeSendGrid] Service configured: ${serviceConfigured}`);

  if (!serviceConfigured) {
    console.warn(
      '⚠️  [initializeSendGrid] SendGrid not configured. Email sending will fail.\n' +
      '   Set SENDGRID_API_KEY in .env.local or Vercel environment variables'
    );
    return false;
  }

  try {
    const config = getEnvConfig();
    const apiKeyPreview = config.email.apiKey ? `${config.email.apiKey.substring(0, 6)}...` : 'MISSING';
    console.log(`📧 [initializeSendGrid] API Key: ${apiKeyPreview}`);
    console.log(`📧 [initializeSendGrid] From Email: ${config.email.fromEmail}`);

    sgMail.setApiKey(config.email.apiKey);
    isInitialized = true;
    console.log('✅ [initializeSendGrid] SendGrid client initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ [initializeSendGrid] Failed to initialize SendGrid client:', error);
    if (error instanceof Error) {
      console.error(`❌ [initializeSendGrid] Error message: ${error.message}`);
    }
    return false;
  }
}

// =============================================================================
// Email Sending Functions
// =============================================================================

/**
 * Attachment interface for SendGrid
 */
interface EmailAttachment {
  content: string; // Base64 encoded content
  filename: string;
  type: string;
  disposition: string;
}

/**
 * Send an email via SendGrid
 */
async function sendEmail(
  to: string,
  subject: string,
  text: string,
  attachments?: EmailAttachment[]
): Promise<boolean> {
  console.log(`📧 [sendEmail] Attempting to send email to: ${to}`);
  console.log(`📧 [sendEmail] Subject: ${subject}`);

  if (!initializeSendGrid()) {
    console.error('❌ [sendEmail] SendGrid client not initialized');
    throw new Error('SendGrid client not initialized');
  }

  try {
    const config = getEnvConfig();
    console.log(`📧 [sendEmail] From email: ${config.email.fromEmail}`);
    console.log(`📧 [sendEmail] From name: ${config.email.fromName}`);
    console.log(`📧 [sendEmail] Has attachments: ${!!attachments?.length}`);

    const msg = {
      to,
      from: {
        email: config.email.fromEmail,
        name: config.email.fromName,
      },
      subject,
      text,
      attachments,
    };

    console.log(`📧 [sendEmail] Calling SendGrid API...`);
    await sgMail.send(msg);
    console.log(`✅ [sendEmail] Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ [sendEmail] Failed to send email to ${to}:`, error);
    if (error instanceof Error) {
      console.error(`❌ [sendEmail] Error message: ${error.message}`);
    }
    // Log SendGrid specific error details
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const sgError = error as { response?: { body?: unknown } };
      console.error(`❌ [sendEmail] SendGrid response:`, sgError.response?.body);
    }
    throw error;
  }
}

/**
 * Calculate meeting duration in minutes from time slot
 */
function calculateDuration(startTime: string, endTime: string): number {
  // Parse time strings in HH:mm format
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  // Calculate duration in minutes
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  const durationMinutes = endMinutes - startMinutes;

  return durationMinutes;
}

/**
 * Send booking confirmation email to the booker
 */
export async function sendBookingConfirmation(
  data: BookingConfirmationData
): Promise<boolean> {
  const { subject, text } = generateBookingConfirmationEmail(data);

  try {
    // Get the selected time slot to calculate duration
    const selectedTimeSlot = data.slot.timeSlots[data.booking.selectedTimeSlotIndex];
    const duration = calculateDuration(selectedTimeSlot.startTime, selectedTimeSlot.endTime);

    console.log(`📧 [sendBookingConfirmation] Calculated duration: ${duration} minutes (${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime})`);

    // Generate .ics file attachment for ATTENDEE
    // Use METHOD:REQUEST with ORGANIZER and ATTENDEE fields (proper meeting invitation)
    const icsContent = generateBookingICS({
      creatorName: data.slot.creatorName || 'WhenAvailable User',
      creatorEmail: data.slot.creatorEmail,
      bookerName: data.booking.bookerName,
      bookerEmail: data.booking.bookerEmail,
      meetingPurpose: data.slot.meetingPurpose || 'WhenAvailable Meeting',
      selectedTime: data.booking.selectedTime,
      duration, // Use calculated duration from time slot
      forOrganizer: false, // Creates meeting invitation with ORGANIZER/ATTENDEE fields
      slotId: data.booking.slotId, // Ensures same UID for both participants
      meetingLocation: data.slot.meetingLocation, // Include meeting location details
    });

    // Convert to base64 for SendGrid
    const icsBase64 = Buffer.from(icsContent).toString('base64');

    const attachments: EmailAttachment[] = [
      {
        content: icsBase64,
        filename: 'meeting.ics',
        type: 'text/calendar',
        disposition: 'attachment',
      },
    ];

    await sendEmail(data.booking.bookerEmail, subject, text, attachments);
    return true;
  } catch (error) {
    console.error('Failed to send booking confirmation:', error);
    return false;
  }
}

/**
 * Send booking notification email to the creator
 */
export async function sendBookingNotification(
  data: BookingNotificationData
): Promise<boolean> {
  const { subject, text } = generateBookingNotificationEmail(data);

  try {
    // Get the selected time slot to calculate duration
    const selectedTimeSlot = data.slot.timeSlots[data.booking.selectedTimeSlotIndex];
    const duration = calculateDuration(selectedTimeSlot.startTime, selectedTimeSlot.endTime);

    console.log(`📧 [sendBookingNotification] Calculated duration: ${duration} minutes (${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime})`);

    // Generate .ics file attachment for ORGANIZER
    // Use METHOD:PUBLISH with NO ORGANIZER/ATTENDEE fields (simple calendar event)
    // Gmail refuses to render ICS when TO email = ORGANIZER email
    const icsContent = generateBookingICS({
      creatorName: data.slot.creatorName || 'WhenAvailable User',
      creatorEmail: data.slot.creatorEmail,
      bookerName: data.booking.bookerName,
      bookerEmail: data.booking.bookerEmail,
      meetingPurpose: data.slot.meetingPurpose || 'WhenAvailable Meeting',
      selectedTime: data.booking.selectedTime,
      duration, // Use calculated duration from time slot
      forOrganizer: true, // Creates simple event without ORGANIZER/ATTENDEE fields
      slotId: data.booking.slotId, // Ensures same UID for both participants
      meetingLocation: data.slot.meetingLocation, // Include meeting location details
    });

    // Convert to base64 for SendGrid
    const icsBase64 = Buffer.from(icsContent).toString('base64');

    const attachments: EmailAttachment[] = [
      {
        content: icsBase64,
        filename: 'meeting.ics',
        type: 'text/calendar',
        disposition: 'attachment',
      },
    ];

    await sendEmail(data.slot.creatorEmail, subject, text, attachments);
    return true;
  } catch (error) {
    console.error('Failed to send booking notification:', error);
    return false;
  }
}

/**
 * Send both booking emails (confirmation + notification)
 * This is the main function to use after a booking is created
 */
export async function sendBookingEmails(
  data: BookingConfirmationData
): Promise<{
  confirmationSent: boolean;
  notificationSent: boolean;
}> {
  console.log(`📧 [sendBookingEmails] Starting email send for slot ${data.booking.slotId}`);
  console.log(`📧 [sendBookingEmails] Booker: ${data.booking.bookerEmail}`);
  console.log(`📧 [sendBookingEmails] Creator: ${data.slot.creatorEmail}`);
  console.log(`📧 [sendBookingEmails] SendGrid configured: ${isServiceConfigured('email')}`);

  const results = {
    confirmationSent: false,
    notificationSent: false,
  };

  // Send confirmation to booker
  try {
    console.log(`📧 [sendBookingEmails] Sending confirmation to booker: ${data.booking.bookerEmail}`);
    results.confirmationSent = await sendBookingConfirmation(data);
    console.log(`✅ [sendBookingEmails] Confirmation sent successfully to ${data.booking.bookerEmail}`);
  } catch (error) {
    console.error(`❌ [sendBookingEmails] Booking confirmation failed:`, error);
    if (error instanceof Error) {
      console.error(`❌ [sendBookingEmails] Error message: ${error.message}`);
      console.error(`❌ [sendBookingEmails] Error stack: ${error.stack}`);
    }
  }

  // Send notification to creator
  try {
    console.log(`📧 [sendBookingEmails] Sending notification to creator: ${data.slot.creatorEmail}`);
    results.notificationSent = await sendBookingNotification(data);
    console.log(`✅ [sendBookingEmails] Notification sent successfully to ${data.slot.creatorEmail}`);
  } catch (error) {
    console.error(`❌ [sendBookingEmails] Booking notification failed:`, error);
    if (error instanceof Error) {
      console.error(`❌ [sendBookingEmails] Error message: ${error.message}`);
      console.error(`❌ [sendBookingEmails] Error stack: ${error.stack}`);
    }
  }

  console.log(`📧 [sendBookingEmails] Email send complete. Results:`, results);
  return results;
}

/**
 * Send a test email to verify SendGrid configuration
 */
export async function sendTestEmail(recipientEmail: string): Promise<boolean> {
  const { subject, text } = generateTestEmail(recipientEmail);

  try {
    await sendEmail(recipientEmail, subject, text);
    return true;
  } catch (error) {
    console.error('Failed to send test email:', error);
    return false;
  }
}

// =============================================================================
// Rescheduling Emails
// =============================================================================

/**
 * Send rescheduled booking confirmation email to the booker
 */
export async function sendRescheduledConfirmation(
  data: BookingRescheduledData
): Promise<boolean> {
  const { subject, text } = generateBookingRescheduledEmail(data);

  try {
    // Get the selected time slot to calculate duration
    const selectedTimeSlot = data.slot.timeSlots[data.booking.selectedTimeSlotIndex];
    const duration = calculateDuration(selectedTimeSlot.startTime, selectedTimeSlot.endTime);

    console.log(`📧 [sendRescheduledConfirmation] Calculated duration: ${duration} minutes (${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime})`);

    // Generate .ics file attachment with updated meeting time
    const icsContent = generateBookingICS({
      creatorName: data.slot.creatorName || 'WhenAvailable User',
      creatorEmail: data.slot.creatorEmail,
      bookerName: data.booking.bookerName,
      bookerEmail: data.booking.bookerEmail,
      meetingPurpose: data.slot.meetingPurpose || 'WhenAvailable Meeting',
      selectedTime: data.booking.selectedTime,
      duration,
      forOrganizer: false,
      slotId: data.booking.slotId,
      meetingLocation: data.slot.meetingLocation,
    });

    // Convert to base64 for SendGrid
    const icsBase64 = Buffer.from(icsContent).toString('base64');

    const attachments: EmailAttachment[] = [
      {
        content: icsBase64,
        filename: 'meeting-updated.ics',
        type: 'text/calendar',
        disposition: 'attachment',
      },
    ];

    await sendEmail(data.booking.bookerEmail, subject, text, attachments);
    return true;
  } catch (error) {
    console.error('Failed to send rescheduled confirmation:', error);
    return false;
  }
}

/**
 * Send rescheduled booking notification email to the creator
 */
export async function sendRescheduledNotification(
  data: BookingRescheduledData
): Promise<boolean> {
  const { subject, text } = generateBookingRescheduledNotificationEmail(data);

  try {
    // Get the selected time slot to calculate duration
    const selectedTimeSlot = data.slot.timeSlots[data.booking.selectedTimeSlotIndex];
    const duration = calculateDuration(selectedTimeSlot.startTime, selectedTimeSlot.endTime);

    console.log(`📧 [sendRescheduledNotification] Calculated duration: ${duration} minutes (${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime})`);

    // Generate .ics file attachment with updated meeting time
    const icsContent = generateBookingICS({
      creatorName: data.slot.creatorName || 'WhenAvailable User',
      creatorEmail: data.slot.creatorEmail,
      bookerName: data.booking.bookerName,
      bookerEmail: data.booking.bookerEmail,
      meetingPurpose: data.slot.meetingPurpose || 'WhenAvailable Meeting',
      selectedTime: data.booking.selectedTime,
      duration,
      forOrganizer: true,
      slotId: data.booking.slotId,
      meetingLocation: data.slot.meetingLocation,
    });

    // Convert to base64 for SendGrid
    const icsBase64 = Buffer.from(icsContent).toString('base64');

    const attachments: EmailAttachment[] = [
      {
        content: icsBase64,
        filename: 'meeting-updated.ics',
        type: 'text/calendar',
        disposition: 'attachment',
      },
    ];

    await sendEmail(data.slot.creatorEmail, subject, text, attachments);
    return true;
  } catch (error) {
    console.error('Failed to send rescheduled notification:', error);
    return false;
  }
}

/**
 * Send both rescheduled emails (confirmation + notification)
 */
export async function sendRescheduledEmails(
  data: BookingRescheduledData
): Promise<{
  confirmationSent: boolean;
  notificationSent: boolean;
}> {
  console.log(`📧 [sendRescheduledEmails] Starting email send for booking ${data.booking.id}`);
  console.log(`📧 [sendRescheduledEmails] Booker: ${data.booking.bookerEmail}`);
  console.log(`📧 [sendRescheduledEmails] Creator: ${data.slot.creatorEmail}`);

  const results = {
    confirmationSent: false,
    notificationSent: false,
  };

  // Send confirmation to booker
  try {
    console.log(`📧 [sendRescheduledEmails] Sending confirmation to booker: ${data.booking.bookerEmail}`);
    results.confirmationSent = await sendRescheduledConfirmation(data);
    console.log(`✅ [sendRescheduledEmails] Confirmation sent successfully`);
  } catch (error) {
    console.error(`❌ [sendRescheduledEmails] Confirmation failed:`, error);
  }

  // Send notification to creator
  try {
    console.log(`📧 [sendRescheduledEmails] Sending notification to creator: ${data.slot.creatorEmail}`);
    results.notificationSent = await sendRescheduledNotification(data);
    console.log(`✅ [sendRescheduledEmails] Notification sent successfully`);
  } catch (error) {
    console.error(`❌ [sendRescheduledEmails] Notification failed:`, error);
  }

  console.log(`📧 [sendRescheduledEmails] Email send complete. Results:`, results);
  return results;
}

// =============================================================================
// Cancellation Emails
// =============================================================================

/**
 * Send cancelled booking confirmation email to the booker
 */
export async function sendCancelledConfirmation(
  data: BookingCancelledData
): Promise<boolean> {
  const { subject, text } = generateBookingCancelledEmail(data);

  try {
    await sendEmail(data.booking.bookerEmail, subject, text);
    return true;
  } catch (error) {
    console.error('Failed to send cancelled confirmation:', error);
    return false;
  }
}

/**
 * Send cancelled booking notification email to the creator
 */
export async function sendCancelledNotification(
  data: BookingCancelledData
): Promise<boolean> {
  const { subject, text } = generateBookingCancelledNotificationEmail(data);

  try {
    await sendEmail(data.slot.creatorEmail, subject, text);
    return true;
  } catch (error) {
    console.error('Failed to send cancelled notification:', error);
    return false;
  }
}

/**
 * Send both cancellation emails (confirmation + notification)
 */
export async function sendCancellationEmails(
  data: BookingCancelledData
): Promise<{
  confirmationSent: boolean;
  notificationSent: boolean;
}> {
  console.log(`📧 [sendCancellationEmails] Starting email send for booking ${data.booking.id}`);
  console.log(`📧 [sendCancellationEmails] Booker: ${data.booking.bookerEmail}`);
  console.log(`📧 [sendCancellationEmails] Creator: ${data.slot.creatorEmail}`);

  const results = {
    confirmationSent: false,
    notificationSent: false,
  };

  // Send confirmation to booker
  try {
    console.log(`📧 [sendCancellationEmails] Sending confirmation to booker: ${data.booking.bookerEmail}`);
    results.confirmationSent = await sendCancelledConfirmation(data);
    console.log(`✅ [sendCancellationEmails] Confirmation sent successfully`);
  } catch (error) {
    console.error(`❌ [sendCancellationEmails] Confirmation failed:`, error);
  }

  // Send notification to creator
  try {
    console.log(`📧 [sendCancellationEmails] Sending notification to creator: ${data.slot.creatorEmail}`);
    results.notificationSent = await sendCancelledNotification(data);
    console.log(`✅ [sendCancellationEmails] Notification sent successfully`);
  } catch (error) {
    console.error(`❌ [sendCancellationEmails] Notification failed:`, error);
  }

  console.log(`📧 [sendCancellationEmails] Email send complete. Results:`, results);
  return results;
}

// =============================================================================
// Email Validation
// =============================================================================

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// =============================================================================
// Export all functions
// =============================================================================

export const emailClient = {
  // Send functions
  sendBookingConfirmation,
  sendBookingNotification,
  sendBookingEmails,
  sendRescheduledEmails,
  sendCancellationEmails,
  sendTestEmail,

  // Validation
  isValidEmail,
  sanitizeEmail,

  // Utilities
  isConfigured: () => isServiceConfigured('email'),
};

// Default export
export default emailClient;
