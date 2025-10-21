'use client';

import { getUserTimezone, getCommonTimezones } from '@/lib/timezone';

interface TimezoneSelectorProps {
  value?: string;
  onChange?: (timezone: string) => void;
}

export function TimezoneSelector({ value, onChange }: TimezoneSelectorProps) {
  const currentTimezone = value || getUserTimezone();
  const timezones = getCommonTimezones();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Timezone
      </label>
      <select
        value={currentTimezone}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900"
      >
        {timezones.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        All times will be displayed in this timezone
      </p>
    </div>
  );
}
