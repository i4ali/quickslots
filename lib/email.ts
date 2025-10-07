/**
 * Email Client for QuickSlots
 *
 * SendGrid integration for booking notifications
 */

import sgMail from '@sendgrid/mail';
import { getEnvConfig, isServiceConfigured } from './env';
import {
  generateBookingConfirmationEmail,
  generateBookingNotificationEmail,
  generateTestEmail,
  type BookingConfirmationData,
  type BookingNotificationData,
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
  if (isInitialized) {
    return true;
  }

  if (!isServiceConfigured('email')) {
    console.warn(
      '⚠️  SendGrid not configured. Email sending will fail.\n' +
      '   Set SENDGRID_API_KEY in .env.local'
    );
    return false;
  }

  try {
    const config = getEnvConfig();
    sgMail.setApiKey(config.email.apiKey);
    isInitialized = true;
    console.log('✅ SendGrid client initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize SendGrid client:', error);
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
  if (!initializeSendGrid()) {
    throw new Error('SendGrid client not initialized');
  }

  try {
    const config = getEnvConfig();

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

    await sgMail.send(msg);
    console.log(`✅ Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

/**
 * Send booking confirmation email to the booker
 */
export async function sendBookingConfirmation(
  data: BookingConfirmationData
): Promise<boolean> {
  const { subject, text } = generateBookingConfirmationEmail(data);

  try {
    // Generate .ics file attachment
    const icsContent = generateBookingICS({
      creatorName: data.slot.creatorName || 'QuickSlots User',
      creatorEmail: data.slot.creatorEmail,
      bookerName: data.booking.bookerName,
      bookerEmail: data.booking.bookerEmail,
      meetingPurpose: data.slot.meetingPurpose || 'QuickSlots Meeting',
      selectedTime: data.booking.selectedTime,
      duration: 60, // Default 60 minutes
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
    // Generate .ics file attachment
    const icsContent = generateBookingICS({
      creatorName: data.slot.creatorName || 'QuickSlots User',
      creatorEmail: data.slot.creatorEmail,
      bookerName: data.booking.bookerName,
      bookerEmail: data.booking.bookerEmail,
      meetingPurpose: data.slot.meetingPurpose || 'QuickSlots Meeting',
      selectedTime: data.booking.selectedTime,
      duration: 60, // Default 60 minutes
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
  const results = {
    confirmationSent: false,
    notificationSent: false,
  };

  // Send confirmation to booker
  try {
    results.confirmationSent = await sendBookingConfirmation(data);
  } catch (error) {
    console.error('Booking confirmation failed:', error);
  }

  // Send notification to creator
  try {
    results.notificationSent = await sendBookingNotification(data);
  } catch (error) {
    console.error('Booking notification failed:', error);
  }

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
  sendTestEmail,

  // Validation
  isValidEmail,
  sanitizeEmail,

  // Utilities
  isConfigured: () => isServiceConfigured('email'),
};

// Default export
export default emailClient;
