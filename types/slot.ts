/**
 * Type definitions for scheduling slots and bookings
 */

// =============================================================================
// Time Slot Types
// =============================================================================

export interface TimeSlot {
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format (24-hour)
  endTime: string; // HH:mm format (24-hour)
}

// =============================================================================
// Slot (Creator's Availability) Types
// =============================================================================

export interface Slot {
  id: string; // Unique slot ID (short, URL-safe)
  createdAt: number; // Unix timestamp
  expiresAt: number; // Unix timestamp
  creatorName?: string; // Optional creator name
  creatorEmail: string; // Required for notifications
  meetingPurpose?: string; // Optional meeting description
  timeSlots: TimeSlot[]; // Array of available time slots (max 5)
  timezone: string; // IANA timezone (e.g., "America/New_York")
  status: SlotStatus;
  viewCount?: number; // Optional: track how many times link was viewed
}

export enum SlotStatus {
  ACTIVE = 'active', // Link is active and available
  BOOKED = 'booked', // Slot has been booked
  EXPIRED = 'expired', // Link has expired (handled by Redis TTL)
  CANCELLED = 'cancelled', // Creator manually cancelled
}

// =============================================================================
// Booking Types
// =============================================================================

export interface Booking {
  slotId: string; // Reference to parent slot
  bookedAt: number; // Unix timestamp
  bookerName: string; // Required booker name
  bookerEmail: string; // Required booker email
  bookerNote?: string; // Optional note from booker
  selectedTime: string; // ISO 8601 format (selected time slot)
  timezone: string; // Booker's timezone
}

// =============================================================================
// Create Slot Request (API Input)
// =============================================================================

export interface CreateSlotRequest {
  creatorName?: string;
  creatorEmail: string;
  meetingPurpose?: string;
  timeSlots: TimeSlot[];
  timezone: string;
}

// =============================================================================
// Book Slot Request (API Input)
// =============================================================================

export interface BookSlotRequest {
  slotId: string;
  selectedTimeSlot: TimeSlot; // Which time slot was selected
  bookerName: string;
  bookerEmail: string;
  bookerNote?: string;
  timezone: string; // Booker's timezone
}

// =============================================================================
// API Response Types
// =============================================================================

export interface CreateSlotResponse {
  success: boolean;
  slotId: string;
  shareableUrl: string;
  expiresAt: number;
}

export interface BookSlotResponse {
  success: boolean;
  bookingId: string;
  message: string;
}

export interface GetSlotResponse {
  success: boolean;
  slot?: Slot;
  error?: string;
}
