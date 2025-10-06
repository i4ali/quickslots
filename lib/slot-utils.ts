/**
 * Utility functions for slot data transformations
 */

import { TimeSlot as FrontendTimeSlot } from '@/components/availability-input';
import { TimeSlot as ApiTimeSlot } from '@/types/slot';

/**
 * Convert frontend TimeSlot (with Date objects) to API TimeSlot format
 */
export function convertToApiTimeSlot(slot: FrontendTimeSlot): ApiTimeSlot {
  // Extract date in YYYY-MM-DD format
  const date = slot.start.toISOString().split('T')[0];

  // Extract time in HH:mm format (24-hour)
  const startTime = slot.start.toTimeString().slice(0, 5);
  const endTime = slot.end.toTimeString().slice(0, 5);

  return {
    date,
    startTime,
    endTime,
  };
}

/**
 * Convert multiple frontend TimeSlots to API format
 */
export function convertToApiTimeSlots(slots: FrontendTimeSlot[]): ApiTimeSlot[] {
  return slots.map(convertToApiTimeSlot);
}
