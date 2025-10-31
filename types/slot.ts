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

export type BookingMode = 'individual' | 'group';

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

  // Multi-booking support
  maxBookings: number; // Maximum number of bookings allowed (1-20, default 1)
  bookingsCount: number; // Current number of bookings (0 to maxBookings)
  bookings: string[]; // Array of booking IDs

  // Extended duration support
  expirationDays: number; // Link duration in days (1, 3, or 7)

  // Booking mode support
  bookingMode: BookingMode; // 'individual' (1-on-1, each slot can only be booked once) or 'group' (multiple people can book same slot)
  bookedTimeSlotIndices: number[]; // Array of time slot indices that have been booked (for individual mode)
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
  selectedTimeSlotIndex: number; // Index of the booked time slot in the parent slot's timeSlots array
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
  maxBookings?: number; // Optional: max bookings (1-20, default 1)
  expirationDays?: number; // Optional: link duration in days (1, 3, or 7, default 1)
  bookingMode?: BookingMode; // Optional: 'individual' or 'group' (default: 'individual')
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
  maxBookings: number;
  expirationDays: number;
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
