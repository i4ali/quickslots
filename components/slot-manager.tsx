'use client';

import { useState } from 'react';
import { AvailabilityInput, TimeSlot } from './availability-input';
import { formatDateWithTimezone, getUserTimezone } from '@/lib/timezone';

interface SlotManagerProps {
  maxSlots?: number;
  onSlotsChange?: (slots: TimeSlot[]) => void;
}

export function SlotManager({ maxSlots = 5, onSlotsChange }: SlotManagerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [userTimezone] = useState(() => getUserTimezone());

  const handleSlotAdded = (slot: TimeSlot) => {
    if (slots.length >= maxSlots) {
      alert(`Maximum ${maxSlots} time slots allowed per link`);
      return;
    }

    const newSlots = [...slots, slot];
    setSlots(newSlots);
    onSlotsChange?.(newSlots);
  };

  const handleRemoveSlot = (index: number) => {
    const newSlots = slots.filter((_, i) => i !== index);
    setSlots(newSlots);
    onSlotsChange?.(newSlots);
  };

  return (
    <div className="space-y-6">
      {/* Availability Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          When are you available?
        </label>
        <AvailabilityInput
          onSlotAdded={handleSlotAdded}
          maxSlots={maxSlots}
        />
      </div>

      {/* Added Slots Display */}
      {slots.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Your Availability ({slots.length}/{maxSlots})
            </h3>
            {slots.length > 0 && (
              <button
                onClick={() => {
                  setSlots([]);
                  onSlotsChange?.([]);
                }}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-2">
            {slots.map((slot, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">📅</span>
                      <span className="text-sm font-semibold text-gray-900">
                        Slot {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {formatDateWithTimezone(slot.start, userTimezone, {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-gray-700">
                      to{' '}
                      {formatDateWithTimezone(slot.end, userTimezone, {
                        hour: 'numeric',
                        minute: '2-digit',
                        timeZoneName: 'short',
                      })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 italic">
                      "{slot.rawInput}"
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveSlot(index)}
                    className="ml-4 text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    aria-label="Remove slot"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {slots.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-4xl mb-2">📅</div>
          <p className="text-sm text-gray-700 font-medium mb-1">
            No time slots added yet
          </p>
          <p className="text-xs text-gray-500">
            Type your availability above to get started
          </p>
        </div>
      )}

      {/* Info */}
      {slots.length > 0 && slots.length < maxSlots && (
        <p className="text-xs text-gray-500 text-center">
          You can add {maxSlots - slots.length} more slot{maxSlots - slots.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
