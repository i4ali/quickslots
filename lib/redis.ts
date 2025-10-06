/**
 * Redis Client for QuickSlots
 *
 * This module provides a typed Redis client using Upstash Redis
 * with automatic TTL (Time-To-Live) for temporary data storage.
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

    // Store booking with same TTL as parent slot
    const key = getBookingKey(booking.slotId);
    const slotKey = getSlotKey(booking.slotId);
    const ttl = await client.ttl(slotKey);

    await client.set(key, JSON.stringify(booking), {
      ex: ttl > 0 ? ttl : 3600, // Fallback to 1 hour
    });

    // Update slot status to booked
    await updateSlotStatus(booking.slotId, 'booked' as SlotStatus);

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

  // Utilities
  generateSlotId,
};

// Default export
export default redis;
