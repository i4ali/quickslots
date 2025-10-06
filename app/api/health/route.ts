/**
 * Health Check API Endpoint
 *
 * Tests Redis and email connections and returns system health status
 * Useful for monitoring and troubleshooting
 */

import { NextResponse } from 'next/server';
import { isServiceConfigured } from '@/lib/env';
import redis from '@/lib/redis';
import emailClient from '@/lib/email';

export async function GET() {
  try {
    // Check Redis configuration
    const redisConfigured = isServiceConfigured('redis');

    // Test Redis connection if configured
    let redisPing = false;
    if (redisConfigured) {
      redisPing = await redis.ping();
    }

    // Test basic Redis operations if connected
    let redisTest = false;
    if (redisPing) {
      try {
        const testKey = 'health:test';
        const testValue = Date.now().toString();

        const client = redis.getClient();
        if (client) {
          await client.set(testKey, testValue, { ex: 10 }); // 10 second TTL
          const retrieved = await client.get(testKey);
          redisTest = retrieved === testValue;
          await client.del(testKey); // Cleanup
        }
      } catch (error) {
        console.error('Redis test failed:', error);
      }
    }

    // Check email configuration
    const emailConfigured = emailClient.isConfigured();

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        redis: {
          configured: redisConfigured,
          connected: redisPing,
          operational: redisTest,
        },
        email: {
          configured: emailConfigured,
        },
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
