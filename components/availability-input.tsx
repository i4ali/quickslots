'use client';

import { useState } from 'react';
import * as chrono from 'chrono-node';
import { formatDateWithTimezone, isPastDate, isValidTimeRange, getUserTimezone } from '@/lib/timezone';

export interface TimeSlot {
  start: Date;
  end: Date;
  rawInput: string;
}

interface AvailabilityInputProps {
  onSlotAdded?: (slot: TimeSlot) => void;
  maxSlots?: number;
}

export function AvailabilityInput({ onSlotAdded, maxSlots = 5 }: AvailabilityInputProps) {
  const [input, setInput] = useState('');
  const [parsedResult, setParsedResult] = useState<{ start: Date; end?: Date } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [userTimezone] = useState(() => getUserTimezone());

  const handleInputChange = (value: string) => {
    setInput(value);
    setError(null);
    setParsedResult(null);
    setIsValid(false);

    if (!value.trim()) {
      return;
    }

    // Parse the input with chrono-node
    try {
      const results = chrono.parse(value);

      if (results.length === 0) {
        setError('Could not understand that date/time. Try: "tomorrow 2-4pm" or "Friday at 3pm"');
        return;
      }

      const result = results[0];
      const start = result.start.date();
      const end = result.end?.date();

      // Validation: Check if date is in the past
      if (isPastDate(start)) {
        setError('Please enter a future date/time');
        return;
      }

      // If no end time, default to 1 hour after start
      const endTime = end || new Date(start.getTime() + 60 * 60 * 1000);

      // Validation: Check if start is before end
      if (end && !isValidTimeRange(start, end)) {
        setError('Start time must be before end time');
        return;
      }

      setParsedResult({ start, end: endTime });
      setIsValid(true);
    } catch (err) {
      console.error('Parsing error:', err);
      setError('Error parsing date/time. Please try again.');
    }
  };

  const handleAddSlot = () => {
    if (!parsedResult || !isValid) return;

    const slot: TimeSlot = {
      start: parsedResult.start,
      end: parsedResult.end!,
      rawInput: input,
    };

    onSlotAdded?.(slot);

    // Reset form
    setInput('');
    setParsedResult(null);
    setError(null);
    setIsValid(false);
  };

  return (
    <div className="space-y-3">
      {/* Input Field */}
      <div>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder='Try: "tomorrow 2-4pm" or "Friday at 3pm"'
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
              error
                ? 'border-red-300 focus:border-red-500'
                : isValid
                ? 'border-green-300 focus:border-green-500'
                : 'border-gray-300 focus:border-blue-500'
            }`}
          />
          {isValid && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-500 mt-1">
          Natural language input powered by chrono-node • Timezone: {userTimezone}
        </p>
      </div>

      {/* Parsed Result Display */}
      {parsedResult && isValid && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 mb-1">✓ Parsed successfully:</p>
              <p className="text-sm text-green-800">
                {formatDateWithTimezone(parsedResult.start, userTimezone)}
              </p>
              {parsedResult.end && parsedResult.end.getTime() !== parsedResult.start.getTime() && (
                <p className="text-sm text-green-800">
                  to {formatDateWithTimezone(parsedResult.end, userTimezone, {
                    hour: 'numeric',
                    minute: '2-digit',
                    timeZoneName: 'short'
                  })}
                </p>
              )}
            </div>
            <button
              onClick={handleAddSlot}
              className="ml-4 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Slot
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">
            <span className="font-semibold">⚠️ Error:</span> {error}
          </p>
        </div>
      )}

      {/* Examples */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs font-semibold text-blue-900 mb-2">Example inputs:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'tomorrow 2-4pm',
            'Friday at 3pm',
            'next Tuesday 10am-12pm',
            'Oct 15 at 2:30pm',
          ].map((example) => (
            <button
              key={example}
              onClick={() => handleInputChange(example)}
              className="px-2 py-1 bg-white border border-blue-300 text-xs text-blue-700 rounded hover:bg-blue-100 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
