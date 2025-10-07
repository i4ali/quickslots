# QuickSlots Scripts

Utility scripts for managing QuickSlots.

## clear-redis.ts

Deletes all data from your Upstash Redis instance.

### When to use:
- Clearing test data before production launch
- Resetting development environment
- Cleaning up after testing

### Usage:

```bash
npm run clear-redis
```

Or directly with tsx:

```bash
npx tsx scripts/clear-redis.ts
```

### What it does:

1. ✅ Connects to your Upstash Redis instance (using env vars)
2. 📊 Scans and categorizes all keys (slots, bookings, other)
3. 📋 Shows you a summary of what will be deleted
4. ⚠️  Asks for confirmation
5. 🗑️  Deletes all keys in batches
6. ✅ Confirms deletion

### Safety features:

- **Requires confirmation** - Won't delete without your explicit "yes"
- **Shows preview** - Displays sample keys before deletion
- **Environment aware** - Uses your .env.local configuration

### Example output:

```
🧹 QuickSlots Redis Data Cleanup Script
========================================

✅ Connected to Upstash Redis

📊 Scanning for keys...

📋 Found:
   - 15 slot(s)
   - 8 booking(s)
   - 0 other key(s)
   - 23 total keys

🔍 Sample keys:
   - slot:abc123
   - slot:def456
   - booking:abc123
   ... and 20 more

⚠️  WARNING: This will DELETE ALL data from your Redis instance!
   This action CANNOT be undone.

Are you sure you want to continue? (yes/no): yes

🗑️  Deleting all keys...

   Deleted 23/23 keys...

✅ Successfully deleted all data!
   Total keys deleted: 23

🎉 Your Redis instance is now clean and ready for production!
```

### ⚠️ WARNING

This script deletes **ALL** data from your Redis instance. This includes:
- All active booking links
- All confirmed bookings
- Any other data stored in Redis

**This action cannot be undone!**

### Prerequisites:

Your `.env.local` must have:
```
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```
