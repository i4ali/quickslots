/**
 * Redis Client for WhenAvailable
 *
 * This module provides a typed Redis client using Upstash Redis
 * with automatic TTL (Time-To-Live) for temporary data storage.
 *
 * TTL & Auto-Expiration Behavior:
 * --------------------------------
 * 1. Slots: Created with 24-hour TTL (86400 seconds by default)
 *    - TTL starts when slot is created
 *    - After booking, slot TTL is reduced to 5 minutes (300 seconds)
 *    - Slot auto-deletes 5 minutes after booking
 *
 * 2. Bookings: Inherit full TTL from parent slot
 *    - Created with remaining TTL from parent slot
 *    - Persists for full 24 hours from slot creation
 *    - Booking auto-deletes after 24 hours
 *
 * 3. Privacy & Data Cleanup:
 *    - All data auto-expires via Redis TTL (no manual cleanup needed)
 *    - Slot expires 5 minutes after booking (no longer needed)
 *    - Booking expires 24 hours after slot creation
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
 * Generate Redis key for a booking
 */
function getBookingKey(slotId: string): string {
  return `booking:${slotId}`;
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

// =============================================================================
// Slot Operations
// =============================================================================

/**
 * Create a new slot with automatic 24-hour expiration
 */
export async function createSlot(slot: Slot): Promise<boolean> {
  const client = getRedisClient();

  if (!client) {
    throw new Error('Redis client not available');
  }

  try {
    const config = getEnvConfig();
    const ttl = config.app.linkExpirationSeconds; // Default: 86400 (24 hours)

    const key = getSlotKey(slot.id);

    // Store slot with TTL
    await client.set(key, JSON.stringify(slot), {
      ex: ttl, // Expires in X seconds
    });

    console.log(`✅ Slot created: ${slot.id} (expires in ${ttl}s)`);
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

    // Store booking with same TTL as parent slot (inherits full duration)
    const bookingKey = getBookingKey(booking.slotId);
    await client.set(bookingKey, JSON.stringify(booking), {
      ex: ttl > 0 ? ttl : 3600, // Fallback to 1 hour
    });

    // Update slot status to booked
    await updateSlotStatus(booking.slotId, 'booked' as SlotStatus);

    // Expire slot quickly after booking (keeps data for immediate verification, then auto-deletes)
    // The booking data is what matters long-term, slot is no longer needed
    await client.expire(slotKey, 300); // Expire in 5 minutes (300 seconds)

    console.log(`✅ Booking created for slot: ${booking.slotId}`);
    return true;
  } catch (error) {
    console.error('Failed to create booking:', error);
    throw error;
  }
}

/**
 * Get a booking by slot ID
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
  deleteSlot,
  isSlotActive,

  // Booking operations
  createBooking,
  getBooking,
  isSlotBooked,

  // TTL utilities
  getSlotTTL,
  getBookingTTL,

  // Utilities
  generateSlotId,
};

// Default export
export default redis;
