/**
 * Timezone utility functions for QuickSlots
 */

/**
 * Get the user's current timezone
 * Uses Intl.DateTimeFormat API
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    // Fallback to UTC if detection fails
    console.error('Failed to detect timezone:', error);
    return 'UTC';
  }
}

/**
 * Get timezone abbreviation (e.g., "EST", "PST", "UTC")
 */
export function getTimezoneAbbreviation(timezone?: string): string {
  const tz = timezone || getUserTimezone();
  const date = new Date();

  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short',
    }).formatToParts(date);

    const timeZonePart = parts.find(part => part.type === 'timeZoneName');
    return timeZonePart?.value || tz;
  } catch (error) {
    console.error('Failed to get timezone abbreviation:', error);
    return tz;
  }
}

/**
 * Format a date with timezone information
 */
export function formatDateWithTimezone(
  date: Date,
  timezone?: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const tz = timezone || getUserTimezone();

  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    ...options,
  };

  try {
    return new Intl.DateTimeFormat('en-US', {
      ...defaultOptions,
      timeZone: tz,
    }).format(date);
  } catch (error) {
    console.error('Failed to format date with timezone:', error);
    return date.toLocaleString();
  }
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date): boolean {
  return date < new Date();
}

/**
 * Check if start time is before end time
 */
export function isValidTimeRange(start: Date, end: Date): boolean {
  return start < end;
}

/**
 * Convert date to UTC ISO string
 */
export function toUTCString(date: Date): string {
  return date.toISOString();
}

/**
 * Get a list of common timezones for timezone selector
 */
export function getCommonTimezones(): Array<{ label: string; value: string }> {
  return [
    { label: 'Eastern Time (ET)', value: 'America/New_York' },
    { label: 'Central Time (CT)', value: 'America/Chicago' },
    { label: 'Mountain Time (MT)', value: 'America/Denver' },
    { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
    { label: 'Alaska Time (AKT)', value: 'America/Anchorage' },
    { label: 'Hawaii Time (HT)', value: 'Pacific/Honolulu' },
    { label: 'Greenwich Mean Time (GMT)', value: 'Europe/London' },
    { label: 'Central European Time (CET)', value: 'Europe/Paris' },
    { label: 'India Standard Time (IST)', value: 'Asia/Kolkata' },
    { label: 'Japan Standard Time (JST)', value: 'Asia/Tokyo' },
    { label: 'Australian Eastern Time (AET)', value: 'Australia/Sydney' },
  ];
}
