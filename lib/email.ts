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
