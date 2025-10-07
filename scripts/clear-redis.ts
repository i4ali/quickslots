/**
 * Script to clear all data from Upstash Redis
 *
 * Usage:
 *   npx tsx scripts/clear-redis.ts
 *
 * WARNING: This will delete ALL data in your Redis instance!
 */

import { Redis } from '@upstash/redis';
import * as readline from 'readline';

// Initialize Redis client
function getRedisClient(): Redis | null {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    console.error('❌ Error: Redis not configured');
    console.error('   Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
    console.error('   in your .env.local file');
    return null;
  }

  return new Redis({
    url: redisUrl,
    token: redisToken,
  });
}

// Ask for confirmation
function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function main() {
  console.log('🧹 QuickSlots Redis Data Cleanup Script');
  console.log('========================================\n');

  // Get Redis client
  const redis = getRedisClient();
  if (!redis) {
    process.exit(1);
  }

  console.log('✅ Connected to Upstash Redis\n');

  // Scan all keys
  console.log('📊 Scanning for keys...\n');

  // Get all keys (works with Upstash REST API)
  const slotKeys: string[] = [];
  const bookingKeys: string[] = [];
  const otherKeys: string[] = [];

  // Scan keys with pattern matching
  let cursor = 0;
  let allKeys: string[] = [];

  do {
    // Upstash scan returns [nextCursor, keys]
    const result = await redis.scan(cursor, { count: 100 });
    cursor = result[0];
    const keys = result[1];
    allKeys = allKeys.concat(keys);
  } while (cursor !== 0);

  // Categorize keys
  for (const key of allKeys) {
    if (key.startsWith('slot:')) {
      slotKeys.push(key);
    } else if (key.startsWith('booking:')) {
      bookingKeys.push(key);
    } else {
      otherKeys.push(key);
    }
  }

  // Display summary
  console.log('📋 Found:');
  console.log(`   - ${slotKeys.length} slot(s)`);
  console.log(`   - ${bookingKeys.length} booking(s)`);
  console.log(`   - ${otherKeys.length} other key(s)`);
  console.log(`   - ${allKeys.length} total keys\n`);

  if (allKeys.length === 0) {
    console.log('✨ Redis is already empty. Nothing to delete!');
    process.exit(0);
  }

  // Show sample keys
  if (allKeys.length > 0) {
    console.log('🔍 Sample keys:');
    allKeys.slice(0, 10).forEach((key) => {
      console.log(`   - ${key}`);
    });
    if (allKeys.length > 10) {
      console.log(`   ... and ${allKeys.length - 10} more\n`);
    } else {
      console.log('');
    }
  }

  // Ask for confirmation
  console.log('⚠️  WARNING: This will DELETE ALL data from your Redis instance!');
  console.log('   This action CANNOT be undone.\n');

  const confirmed = await askConfirmation('Are you sure you want to continue? (yes/no): ');

  if (!confirmed) {
    console.log('\n❌ Aborted. No data was deleted.');
    process.exit(0);
  }

  // Delete all keys
  console.log('\n🗑️  Deleting all keys...\n');

  let deletedCount = 0;

  // Delete in batches of 100
  for (let i = 0; i < allKeys.length; i += 100) {
    const batch = allKeys.slice(i, i + 100);

    // Delete each key individually (Upstash doesn't support DEL with multiple keys in REST API)
    const deletePromises = batch.map(key => redis.del(key));
    await Promise.all(deletePromises);

    deletedCount += batch.length;
    console.log(`   Deleted ${deletedCount}/${allKeys.length} keys...`);
  }

  console.log('\n✅ Successfully deleted all data!');
  console.log(`   Total keys deleted: ${deletedCount}\n`);

  console.log('🎉 Your Redis instance is now clean and ready for production!');
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
