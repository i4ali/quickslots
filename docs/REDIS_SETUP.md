# Upstash Redis Setup Guide

This guide explains how to set up Upstash Redis for QuickSlots.

## Why Upstash Redis?

- **Serverless**: No server management required
- **Free Tier**: 256MB storage, 500K commands/month
- **Auto-TTL**: Built-in time-to-live for automatic data expiration
- **Global**: Edge locations for low latency
- **Pay-as-you-go**: $0.20 per 100K requests after free tier

Perfect for temporary scheduling data!

---

## Step 1: Create Upstash Account

1. Go to [https://console.upstash.com](https://console.upstash.com)
2. Sign up with GitHub or email
3. Verify your email

---

## Step 2: Create Redis Database

1. Click **"Create Database"**
2. Enter database name: `quickslots` (or any name you prefer)
3. Select region: **Choose the closest to your users** (or "global" for multi-region)
4. Select plan: **Free** (perfect for MVP)
5. Click **"Create"**

---

## Step 3: Get Credentials

After creating the database:

1. Click on your database name
2. Scroll to **"REST API"** section
3. Copy these two values:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

---

## Step 4: Add to Environment Variables

1. Open `.env.local` in your project root
2. Add the credentials:

```bash
UPSTASH_REDIS_REST_URL=https://your-database-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

3. Save the file
4. Restart your dev server: `npm run dev`

---

## Step 5: Test Connection

1. Start your dev server: `npm run dev`
2. Open browser to: [http://localhost:3000/api/health](http://localhost:3000/api/health)
3. You should see:

```json
{
  "status": "ok",
  "timestamp": "2025-10-06T...",
  "services": {
    "redis": {
      "configured": true,
      "connected": true,
      "operational": true
    }
  }
}
```

If `connected` is `false`, double-check your credentials!

---

## Redis Operations

QuickSlots uses Redis for:

### 1. **Storing Slots** (Creator's Availability)
- Key pattern: `slot:{id}`
- TTL: 24 hours (86400 seconds)
- Auto-deleted after expiration

### 2. **Storing Bookings**
- Key pattern: `booking:{slotId}`
- TTL: Same as parent slot
- Auto-deleted with slot

### 3. **Data Lifecycle**
```
┌──────────────┐
│ Link Created │
└──────┬───────┘
       │
       v
┌─────────────────┐
│ Stored in Redis │
│  (24hr TTL)     │
└──────┬──────────┘
       │
       ├─> Link Booked ──> Status updated
       │
       ├─> Link Expires ─> Auto-deleted by Redis TTL
       │
       └─> Link Viewed ──> View count incremented
```

---

## Usage in Code

### Get Redis Client
```typescript
import redis from '@/lib/redis';

const client = redis.getClient();
```

### Create a Slot
```typescript
import { redis } from '@/lib/redis';
import type { Slot } from '@/types/slot';

const slot: Slot = {
  id: redis.generateSlotId(),
  createdAt: Date.now(),
  expiresAt: Date.now() + (24 * 60 * 60 * 1000),
  creatorEmail: 'user@example.com',
  timeSlots: [{ date: '2025-10-07', startTime: '14:00', endTime: '16:00' }],
  timezone: 'America/New_York',
  status: 'active',
};

await redis.createSlot(slot);
```

### Get a Slot
```typescript
const slot = await redis.getSlot('abc123');
if (slot) {
  console.log('Slot found:', slot);
}
```

### Create a Booking
```typescript
import type { Booking } from '@/types/slot';

const booking: Booking = {
  slotId: 'abc123',
  bookedAt: Date.now(),
  bookerName: 'John Doe',
  bookerEmail: 'john@example.com',
  selectedTime: '2025-10-07T14:00:00Z',
  timezone: 'America/Los_Angeles',
};

await redis.createBooking(booking);
```

---

## Monitoring

### Check Redis Health
Visit: [http://localhost:3000/api/health](http://localhost:3000/api/health)

### Upstash Console
Monitor usage in [Upstash Console](https://console.upstash.com):
- Commands per day
- Storage usage
- Response times
- Error rates

---

## Free Tier Limits

**Upstash Free Tier:**
- 256 MB storage
- 500,000 commands/month
- Unlimited databases

**Estimated Usage for QuickSlots:**
- Each slot: ~1 KB
- Each booking: ~500 bytes
- 10,000 links/month = ~10 MB storage
- 100,000 operations/month

**You're well within the free tier!** 🎉

---

## Troubleshooting

### "Redis client not available"
- Check that env variables are set in `.env.local`
- Restart dev server after adding credentials
- Verify credentials in Upstash console

### "Connection failed"
- Check internet connection
- Verify URL format is correct (starts with `https://`)
- Check Upstash service status

### "TTL not working"
- TTL is automatic in Upstash - no action needed
- Data will auto-delete after 24 hours
- Use `/api/health` to test operations

---

## Next Steps

- ✅ Redis is configured
- ⏳ Continue to Story 1.4: SendGrid Email Setup
- See [ROADMAP.md](../ROADMAP.md) for full development plan

---

**Need help?** Check [Upstash Docs](https://docs.upstash.com/redis) or [create an issue](https://github.com/your-repo/issues).
