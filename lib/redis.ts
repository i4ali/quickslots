/**
 * Redis Client for WhenAvailable
 *
 * This module provides a typed Redis client using Upstash Redis
 * with automatic TTL (Time-To-Live) for temporary data storage.
 *
 * TTL & Auto-Expiration Behavior:
 * --------------------------------
 * 1. Slots: Created with user-selected TTL (1, 3, or 7 days)
 *    - TTL starts when slot is created
 *    - TTL is calculated from slot.expirationDays (1 day = 86400s, 3 days = 259200s, 7 days = 604800s)
 *    - Slot persists until expiration OR max bookings reached
 *    - Slot auto-deletes after expiration
 *
 * 2. Bookings: Inherit remaining TTL from parent slot
 *    - Created with remaining TTL from parent slot
 *    - Persists for the duration of the parent slot's expiration
 *    - Booking auto-deletes when parent slot expires
 *
 * 3. Privacy & Data Cleanup:
 *    - All data auto-expires via Redis TTL (no manual cleanup needed)
 *    - Slot expires based on user's selected duration (1-7 days)
 *    - Booking expires when parent slot expires
 *    - Zero persistent storage of user data
 */

import { Redis } from '@upstash/redis';
import { getEnvConfig, isServiceConfigured } from './env';
import type { Slot, Booking, SlotStatus } from '@/types/slot';

// =============================================================================
// Redis Client Initialization
// =============================================================================

let redisClient: Redis | null = null;

/**
 * Get or create Redis client instance
 * Returns null if Redis is not configured (for development)
 */
export function getRedisClient(): Redis | null {
  // Check if Redis is configured
  if (!isServiceConfigured('redis')) {
    console.warn(
      '⚠️  Redis not configured. Slot operations will fail.\n' +
      '   Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local'
    );
    return null;
  }

  // Return existing client if already initialized
  if (redisClient) {
    return redisClient;
  }

  // Initialize new client
  try {
    const config = getEnvConfig();
    redisClient = new Redis({
      url: config.redis.url,
      token: config.redis.token,
    });

    console.log('✅ Redis client initialized successfully');
    return redisClient;
  } catch (error) {
    console.error('❌ Failed to initialize Redis client:', error);
    return null;
  }
}

/**
 * Check if Redis is available and responding
 */
export async function pingRedis(): Promise<boolean> {
  const client = getRedisClient();

  if (!client) {
    return false;
  }

  try {
    const result = await client.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis ping failed:', error);
    return false;
  }
}

// =============================================================================
// Key Generation Helpers
// =============================================================================

/**
 * Generate Redis key for a slot
 */
function getSlotKey(slotId: string): string {
  return `slot:${slotId}`;
}

/**
 * Generate Redis key for a booking by slot ID (legacy - for single booking per slot)
 */
function getBookingKey(slotId: string): string {
  return `booking:${slotId}`;
}

/**
 * Generate Redis key for a booking by unique booking ID
 */
function getBookingKeyById(bookingId: string): string {
  return `booking:${bookingId}`;
}

/**
 * Generate a unique slot ID
 * Format: 8 character alphanumeric (URL-safe)
 */
export function generateSlotId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Generate a unique booking ID
 * Format: 8 character alphanumeric (URL-safe)
 */
export function generateBookingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

// =============================================================================
// Slot Operations
// =============================================================================

/**
 * Create a new slot with automatic expiration based on expirationDays
 */
export async function createSlot(slot: Slot): Promise<boolean> {
  const client = getRedisClient();

  if (!client) {
    throw new Error('Redis client not available');
  }

  try {
    // Calculate TTL from slot's expiresAt (convert milliseconds to seconds)
    const ttl = Math.floor((slot.expiresAt - slot.createdAt) / 1000);

    const key = getSlotKey(slot.id);

    // Store slot with TTL based on user's selected expiration
    await client.set(key, JSON.stringify(slot), {
      ex: ttl, // Expires based on slot.expirationDays (1, 3, or 7 days)
    });

    const expirationDays = slot.expirationDays || 1;
    console.log(`✅ Slot created: ${slot.id} (expires in ${ttl}s / ${expirationDays} day${expirationDays > 1 ? 's' : ''})`);
    return true;
  } catch (error) {
    console.error('Failed to create slot:', error);
    throw error;
  }
}

/**
 * Get a slot by ID
 */
export async function getSlot(slotId: string): Promise<Slot | null> {
  const client = getRedisClient();

  if (!client) {
    throw new Error('Redis client not available');
  }

  try {
    const key = getSlotKey(slotId);
    const data = await client.get(key);

    if (!data) {
      return null;
    }

    // Parse JSON data
    const slot = typeof data === 'string' ? JSON.parse(data) : data;
    return slot as Slot;
  } catch (error) {
    console.error('Failed to get slot:', error);
    return null;
  }
}

/**
 * Update a slot's status
 */
export async function updateSlotStatus(
  slotId: string,
  status: SlotStatus
): Promise<boolean> {
  const client = getRedisClient();

  if (!client) {
    throw new Error('Redis client not available');
  }

  try {
    const slot = await getSlot(slotId);

    if (!slot) {
      return false;
    }

    slot.status = status;

    const key = getSlotKey(slotId);
    const ttl = await client.ttl(key); // Get remaining TTL

    // Update slot with same TTL
    await client.set(key, JSON.stringify(slot), {
      ex: ttl > 0 ? ttl : 60, // Fallback to 60 seconds if TTL expired
    });

    return true;
  } catch (error) {
    console.error('Failed to update slot status:', error);
    return false;
  }
}

/**
 * Increment slot view count
 */
export async function incrementSlotViewCount(slotId: string): Promise<void> {
  const client = getRedisClient();

  if (!client) {
    return;
  }

  try {
    const slot = await getSlot(slotId);

    if (slot) {
      slot.viewCount = (slot.viewCount || 0) + 1;

      const key = getSlotKey(slotId);
      const ttl = await client.ttl(key);

      await client.set(key, JSON.stringify(slot), {
        ex: ttl > 0 ? ttl : 60,
      });
    }
  } catch (error) {
    console.error('Failed to increment view count:', error);
  }
}

/**
 * Update slot booking count after a booking is made
 * Increments bookingsCount and marks slot as 'booked' if max reached
 * Also tracks which time slot indices have been booked (for individual mode)
 */
export async function updateSlotBookingCount(
  slotId: string,
  bookingId: string,
  selectedTimeSlotIndex?: number
): Promise<boolean> {
  const client = getRedisClient();

  if (!client) {
    throw new Error('Redis client not available');
  }

  try {
    const slot = await getSlot(slotId);

    if (!slot) {
      return false;
    }

    // Increment booking count
    slot.bookingsCount = (slot.bookingsCount || 0) + 1;

    // Add booking ID to the list
    if (!slot.bookings) {
      slot.bookings = [];
    }
    slot.bookings.push(bookingId);

    // Track booked time slot index (for individual mode)
    if (selectedTimeSlotIndex !== undefined && selectedTimeSlotIndex !== null) {
      if (!slot.bookedTimeSlotIndices) {
        slot.bookedTimeSlotIndices = [];
      }
      // Add to booked indices if not already present
      if (!slot.bookedTimeSlotIndices.includes(selectedTimeSlotIndex)) {
        slot.bookedTimeSlotIndices.push(selectedTimeSlotIndex);
      }
    }

    // Mark as 'booked' if max bookings reached
    if (slot.bookingsCount >= slot.maxBookings) {
      slot.status = 'booked' as SlotStatus;
    }

    const key = getSlotKey(slotId);
    const ttl = await client.ttl(key); // Get remaining TTL

    // Update slot with same TTL
    await client.set(key, JSON.stringify(slot), {
      ex: ttl > 0 ? ttl : 60, // Fallback to 60 seconds if TTL expired
    });

    console.log(`✅ Slot ${slotId} booking count updated: ${slot.bookingsCount}/${slot.maxBookings}`);
    return true;
  } catch (error) {
    console.error('Failed to update slot booking count:', error);
    return false;
  }
}

/**
 * Delete a slot manually (for cancellation)
 */
export async function deleteSlot(slotId: string): Promise<boolean> {
  const client = getRedisClient();

  if (!client) {
    throw new Error('Redis client not available');
  }

  try {
    const key = getSlotKey(slotId);
    const result = await client.del(key);
    return result === 1;
  } catch (error) {
    console.error('Failed to delete slot:', error);
    return false;
  }
}

/**
 * Check if a slot exists and is active
 */
export async function isSlotActive(slotId: string): Promise<boolean> {
  const slot = await getSlot(slotId);

  if (!slot) {
    return false;
  }

  return slot.status === 'active' && Date.now() < slot.expiresAt;
}

// =============================================================================
// Booking Operations
// =============================================================================

/**
 * Create a booking for a slot
 * Now stores bookings with unique booking ID for rescheduling support
 */
export async function createBooking(booking: Booking): Promise<boolean> {
  const client = getRedisClient();

  if (!client) {
    throw new Error('Redis client not available');
  }

  try {
    // Check if slot is still active
    const slot = await getSlot(booking.slotId);

    if (!slot || slot.status !== 'active') {
      throw new Error('Slot is not available for booking');
    }

    // Get current TTL of parent slot
    const slotKey = getSlotKey(booking.slotId);
    const ttl = await client.ttl(slotKey);

    // Store booking with unique booking ID (for rescheduling/cancellation)
    const bookingKey = getBookingKeyById(booking.id);
    await client.set(bookingKey, JSON.stringify(booking), {
      ex: ttl > 0 ? ttl : 3600, // Fallback to 1 hour
    });

    // Also store under slot ID for backward compatibility (legacy single booking lookup)
    const legacyBookingKey = getBookingKey(booking.slotId);
    await client.set(legacyBookingKey, JSON.stringify(booking), {
      ex: ttl > 0 ? ttl : 3600,
    });

    // Note: Slot status and expiration will be handled by updateSlotBookingCount
    // This allows multi-booking support - slot status only changes when maxBookings is reached

    console.log(`✅ Booking created: ${booking.id} for slot: ${booking.slotId}`);
    return true;
  } catch (error) {
    console.error('Failed to create booking:', error);
    throw error;
  }
}

/**
 * Get a booking by slot ID (legacy - for single booking per slot)
 */
export async function getBooking(slotId: string): Promise<Booking | null> {
  const client = getRedisClient();

  if (!client) {
    throw new Error('Redis client not available');
  }

  try {
    const key = getBookingKey(slotId);
    const data = await client.get(key);

    if (!data) {
      return null;
    }

    const booking = typeof data === 'string' ? JSON.parse(data) : data;
    return booking as Booking;
  } catch (error) {
    console.error('Failed to get booking:', error);
    return null;
  }
}

/**
 * Get a booking by unique booking ID
 * Used for rescheduling and cancellation
 */
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const client = getRedisClient();

  if (!client) {
    throw new Error('Redis client not available');
  }

  try {
    const key = getBookingKeyById(bookingId);
    const data = await client.get(key);

    if (!data) {
      return null;
    }

    const booking = typeof data === 'string' ? JSON.parse(data) : data;
    return booking as Booking;
  } catch (error) {
    console.error('Failed to get booking by ID:', error);
    return null;
  }
}

/**
 * Check if a slot has been booked
 */
export async function isSlotBooked(slotId: string): Promise<boolean> {
  const booking = await getBooking(slotId);
  return booking !== null;
}

// =============================================================================
// TTL Utilities (for testing and debugging)
// =============================================================================

/**
 * Get remaining TTL for a slot (in seconds)
 * Returns -1 if key doesn't exist, -2 if no expiration set
 */
export async function getSlotTTL(slotId: string): Promise<number> {
  const client = getRedisClient();

  if (!client) {
    return -1;
  }

  try {
    const key = getSlotKey(slotId);
    return await client.ttl(key);
  } catch (error) {
    console.error('Failed to get slot TTL:', error);
    return -1;
  }
}

/**
 * Get remaining TTL for a booking (in seconds)
 * Returns -1 if key doesn't exist, -2 if no expiration set
 */
export async function getBookingTTL(slotId: string): Promise<number> {
  const client = getRedisClient();

  if (!client) {
    return -1;
  }

  try {
    const key = getBookingKey(slotId);
    return await client.ttl(key);
  } catch (error) {
    console.error('Failed to get booking TTL:', error);
    return -1;
  }
}

// =============================================================================
// Export all functions
// =============================================================================

export const redis = {
  // Client management
  getClient: getRedisClient,
  ping: pingRedis,

  // Slot operations
  createSlot,
  getSlot,
  updateSlotStatus,
  incrementSlotViewCount,
  updateSlotBookingCount,
  deleteSlot,
  isSlotActive,

  // Booking operations
  createBooking,
  getBooking,
  getBookingById,
  isSlotBooked,

  // TTL utilities
  getSlotTTL,
  getBookingTTL,

  // Utilities
  generateSlotId,
  generateBookingId,
};

// Default export
export default redis;
