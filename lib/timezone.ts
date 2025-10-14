/**
 * Timezone utility functions for WhenAvailable
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
 * Alias for getTimezoneAbbreviation (shorter name)
 */
export function getTimezoneAbbr(timezone?: string): string {
  return getTimezoneAbbreviation(timezone);
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
 * Format a date in a specific timezone with custom format
 * @param date - Date to format
 * @param timezone - Target timezone (defaults to user's timezone)
 * @param formatPattern - Format pattern (simplified subset)
 *   - 'EEEE, MMMM d, yyyy' -> "Monday, January 15, 2025"
 *   - 'h:mm a' -> "3:30 PM"
 *   - 'MMM d, yyyy' -> "Jan 15, 2025"
 */
export function formatInTimezone(
  date: Date,
  timezone?: string,
  formatPattern?: string
): string {
  const tz = timezone || getUserTimezone();

  try {
    // Default format if no pattern specified
    if (!formatPattern) {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    }

    // Handle specific format patterns
    if (formatPattern === 'EEEE, MMMM d, yyyy') {
      // "Monday, January 15, 2025"
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } else if (formatPattern === 'h:mm a') {
      // "3:30 PM"
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } else if (formatPattern === 'MMM d, yyyy') {
      // "Jan 15, 2025"
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    }

    // Fallback to default format
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
    }).format(date);
  } catch (error) {
    console.error('Failed to format date in timezone:', error);
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
