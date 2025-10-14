/**
 * .ics Calendar File Generation Utility
 * RFC 5545 compliant iCalendar format
 * Story 2.10A: Calendar File Generation
 */

interface ICSEventOptions {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  organizerName?: string;
  organizerEmail: string;
  attendeeName?: string;
  attendeeEmail: string;
  timezone?: string;
}

/**
 * Format date for iCalendar (UTC format)
 * Example: 20250315T140000Z
 */
function formatICSDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Generate a unique identifier for the event
 */
function generateUID(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}@quickslots.app`;
}

/**
 * Escape special characters in iCalendar text fields
 * According to RFC 5545, commas, semicolons, and backslashes must be escaped
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Fold long lines to 75 characters (RFC 5545 requirement)
 * Lines should be folded at 75 octets, continuing on next line with a space
 */
function foldLine(line: string): string {
  const maxLength = 75;
  if (line.length <= maxLength) {
    return line;
  }

  const folded: string[] = [];
  let remaining = line;

  // First line
  folded.push(remaining.substring(0, maxLength));
  remaining = remaining.substring(maxLength);

  // Continuation lines (prefixed with space)
  while (remaining.length > 0) {
    folded.push(' ' + remaining.substring(0, maxLength - 1));
    remaining = remaining.substring(maxLength - 1);
  }

  return folded.join('\r\n');
}

/**
 * Generate .ics file content
 * Returns RFC 5545 compliant iCalendar format
 */
export function generateICS(options: ICSEventOptions): string {
  const {
    title,
    description = '',
    startTime,
    endTime,
    location = 'Virtual Meeting',
    organizerName = '',
    organizerEmail,
    attendeeName = '',
    attendeeEmail,
  } = options;

  const now = new Date();
  const uid = generateUID();
  const dtstamp = formatICSDate(now);
  const dtstart = formatICSDate(startTime);
  const dtend = formatICSDate(endTime);

  // Build the iCalendar file
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WhenAvailable//Calendar File//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapeICSText(title)}`,
  ];

  // Add description if provided
  if (description) {
    lines.push(`DESCRIPTION:${escapeICSText(description)}`);
  }

  // Add location
  lines.push(`LOCATION:${escapeICSText(location)}`);

  // Add organizer
  const organizerLabel = organizerName ? escapeICSText(organizerName) : organizerEmail;
  lines.push(`ORGANIZER;CN=${organizerLabel}:mailto:${organizerEmail}`);

  // Add attendee
  const attendeeLabel = attendeeName ? escapeICSText(attendeeName) : attendeeEmail;
  lines.push(`ATTENDEE;CN=${attendeeLabel};RSVP=TRUE;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT:mailto:${attendeeEmail}`);

  // Add status and sequence
  lines.push('STATUS:CONFIRMED');
  lines.push('SEQUENCE:0');
  lines.push('TRANSP:OPAQUE');

  // Close VEVENT and VCALENDAR
  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  // Fold lines and join with CRLF
  const foldedLines = lines.map(foldLine);
  return foldedLines.join('\r\n');
}

/**
 * Create a downloadable .ics file blob
 * For client-side downloads in the browser
 */
export function createICSBlob(icsContent: string): Blob {
  return new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
}

/**
 * Trigger download of .ics file in browser
 */
export function downloadICS(icsContent: string, filename: string = 'meeting.ics'): void {
  const blob = createICSBlob(icsContent);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate .ics content for a WhenAvailable booking
 * Helper function specific to WhenAvailable data structure
 */
export function generateBookingICS(params: {
  creatorName: string;
  creatorEmail: string;
  bookerName: string;
  bookerEmail: string;
  meetingPurpose?: string;
  selectedTime: string | Date;
  duration?: number; // in minutes, defaults to 60
}): string {
  const {
    creatorName,
    creatorEmail,
    bookerName,
    bookerEmail,
    meetingPurpose = 'WhenAvailable Meeting',
    selectedTime,
    duration = 60,
  } = params;

  // Convert selectedTime to Date if it's a string
  const startTime = typeof selectedTime === 'string' ? new Date(selectedTime) : selectedTime;

  // Calculate end time (add duration in minutes)
  const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

  // Build description
  const descriptionParts = [
    `Meeting scheduled via WhenAvailable`,
    ``,
    `Host: ${creatorName} (${creatorEmail})`,
    `Attendee: ${bookerName} (${bookerEmail})`,
  ];

  if (meetingPurpose && meetingPurpose !== 'WhenAvailable Meeting') {
    descriptionParts.push(``, `Purpose: ${meetingPurpose}`);
  }

  const description = descriptionParts.join('\\n');

  return generateICS({
    title: meetingPurpose || 'WhenAvailable Meeting',
    description,
    startTime,
    endTime,
    location: 'Virtual Meeting (details to be shared)',
    organizerName: creatorName,
    organizerEmail: creatorEmail,
    attendeeName: bookerName,
    attendeeEmail: bookerEmail,
  });
}
