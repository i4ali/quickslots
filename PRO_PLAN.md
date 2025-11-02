# WhenAvailable Pro Plan Implementation ($5/month)

**Last Updated:** October 30, 2025
**Target Launch:** Q1 2026
**Pricing:** $5/month (50% cheaper than Calendly's $10/month)

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication & User Management System](#authentication--user-management-system-🔐)
3. [Database Architecture (Supabase)](#database-architecture-supabase-🗄️)
4. [Stripe Subscription Integration](#stripe-subscription-integration-💳)
5. [Feature 1: Multiple Bookings Per Link](#feature-1-multiple-bookings-per-link-⭐)
6. [Feature 2: Extended Link Duration](#feature-2-extended-link-duration-⏰)
7. [Feature 3: Custom Branding](#feature-3-custom-branding-🎨)
8. [Feature 4: Calendar Integration](#feature-4-calendar-integration-📅)
9. [Feature 5: Payment Collection](#feature-5-payment-collection-💳)
10. [Implementation Timeline](#implementation-timeline)
11. [Revenue Projections](#revenue-projections)
12. [Testing Checklist](#testing-checklist)
13. [Environment Variables Reference](#environment-variables-reference-⚙️)
14. [Migration & Rollout Strategy](#migration--rollout-strategy-🚀)
15. [Competitive Analysis](#competitive-analysis)
16. [Success Metrics](#success-metrics)
17. [Next Steps](#next-steps)

---

## Overview

Transform WhenAvailable from single-use temporary links to a premium scheduling solution that undercuts Calendly by 50% while maintaining your privacy-first advantage.

**Competitive Positioning:**
- **Our Pricing:** Pro $5/month
- **Calendly Pricing:** Standard $10-12/month
- **Our Advantage:** 50% cheaper + privacy-first approach

**Pro Plan Value Proposition:**
- Multiple people can book from one link
- Links last up to 30 days (vs 24 hours)
- Custom branding for professional appearance
- One-way calendar sync to Google/Outlook
- Payment collection for paid consultations

---

## Authentication & User Management System 🔐

**The Challenge:** How do we collect $5/month recurring payments while maintaining our "no signup required" advantage?

**The Solution:** Hybrid model that preserves both benefits.

### Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  WhenAvailable                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  FREE TIER (Anonymous)          ← Current       │
│  • No signup required                           │
│  • Create temporary links                       │
│  • Single booking per link                      │
│  • 24-hour expiration                           │
│  • No payment needed                            │
│  • Zero data retention                          │
│                                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  PRO TIER (Account Required)    ← New           │
│  • Must create account                          │
│  • Email + password (or OAuth)                  │
│  • Stripe subscription ($5/month)               │
│  • User dashboard                               │
│  • All Pro features unlocked                    │
│  • Data stored in Supabase                      │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Why This Works

**Preserves Privacy-First Advantage:**
- Free users maintain complete anonymity
- No forced registration for casual use
- Pro users opt-in to accounts for advanced features

**Enables Recurring Billing:**
- Pro users have accounts → can charge monthly
- Stripe subscriptions tied to user ID
- Billing dashboard for subscription management

**Best of Both Worlds:**
- Low barrier to entry (free, no signup)
- Premium features for power users (Pro, account required)

### User Journeys

#### Free User Journey (No Changes)
```
1. Visit homepage
2. Enter availability (natural language)
3. Create link (instant, no signup)
4. Share link
5. Done ✅

Privacy: Zero data retention, link expires in 24h
```

#### Pro User Journey (New)
```
1. Visit homepage
2. Click "Upgrade to Pro" or try to use Pro feature
3. Redirected to sign-up page
4. Create account (Clerk - email/password or OAuth)
5. Redirected to Stripe Checkout
6. Subscribe ($5/month)
7. Redirected to dashboard
8. Create Pro links with advanced features ✅

Privacy: User data in Supabase, links in Redis with extended TTL
```

### Authentication Technology Stack

**Clerk (Recommended)** 🎯
```bash
npm install @clerk/nextjs
```

**Why Clerk?**
- ✅ Drop-in authentication UI (sign-up, sign-in, user profile)
- ✅ Free up to 10,000 monthly active users
- ✅ Built-in Stripe integration
- ✅ Email/password + OAuth (Google, GitHub, Microsoft)
- ✅ User management dashboard
- ✅ Webhooks for user events
- ✅ Middleware for protecting routes
- ✅ Excellent Next.js App Router support

**Alternative: NextAuth.js**
- Open source, completely free
- More customizable but more setup
- Good if you need custom auth logic

### Implementation: Clerk Setup

#### 1. Installation

```bash
npm install @clerk/nextjs
```

#### 2. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

#### 3. Root Layout Integration

**File:** `app/layout.tsx`

```typescript
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

#### 4. Protected Routes Middleware

**File:** `middleware.ts`

```typescript
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    '/',              // Homepage (free tier)
    '/:slotId',       // Booking pages (public)
    '/api/slots',     // Slot creation (allow free)
    '/api/bookings',  // Booking creation (public)
    '/pricing',       // Pricing page
    '/sign-in',       // Auth pages
    '/sign-up',
  ],

  // Routes that require authentication
  ignoredRoutes: [
    '/api/webhooks',  // Webhooks don't need auth
  ],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

#### 5. User Authentication in API Routes

**File:** `app/api/slots/create/route.ts` (Updated)

```typescript
import { auth } from '@clerk/nextjs';
import { isProUser } from '@/lib/auth-utils';

export async function POST(request: Request) {
  const body = await request.json();
  const { maxBookings, expirationDays, isPro } = body;

  // If user wants Pro features, verify subscription
  if (isPro || maxBookings > 1 || expirationDays > 1) {
    const { userId } = auth();

    // Not authenticated
    if (!userId) {
      return Response.json(
        {
          error: 'Pro features require an account',
          action: 'signup',
          upgradeUrl: '/sign-up?redirect=/dashboard',
        },
        { status: 401 }
      );
    }

    // Check if user has Pro subscription
    const userIsPro = await isProUser(userId);

    if (!userIsPro) {
      return Response.json(
        {
          error: 'Pro subscription required',
          action: 'upgrade',
          upgradeUrl: '/upgrade',
        },
        { status: 403 }
      );
    }
  }

  // Continue with slot creation...
  const { userId } = auth(); // Get userId (can be null for free users)

  const slot = await createSlot({
    ...body,
    userId: userId || null, // Free users have null userId
    isPro: isPro && userId, // Only Pro if authenticated + subscribed
  });

  return Response.json(slot);
}
```

#### 6. User Profile Component

**File:** `components/user-profile.tsx`

```typescript
import { UserButton, useUser } from '@clerk/nextjs';

export function UserProfile() {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <div className="flex gap-2">
        <a href="/sign-in">Sign In</a>
        <a href="/sign-up">Sign Up</a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span>Welcome, {user.firstName}</span>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
```

### Auth Helper Functions

**File:** `lib/auth-utils.ts`

```typescript
import { auth } from '@clerk/nextjs';
import { getUser } from './database';

/**
 * Check if the current user is authenticated
 */
export async function requireAuth() {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Authentication required');
  }

  return userId;
}

/**
 * Check if the current user has an active Pro subscription
 */
export async function requireProSubscription() {
  const userId = await requireAuth();
  const user = await getUser(userId);

  if (user.subscriptionStatus !== 'pro') {
    throw new Error('Pro subscription required');
  }

  return user;
}

/**
 * Check if a specific user has Pro subscription
 */
export async function isProUser(userId: string): Promise<boolean> {
  try {
    const user = await getUser(userId);
    return user.subscriptionStatus === 'pro';
  } catch {
    return false;
  }
}

/**
 * Get current user with subscription details
 */
export async function getCurrentUser() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  return await getUser(userId);
}
```

### UI Components for Authentication

#### Sign Up Page

**File:** `app/sign-up/[[...sign-up]]/page.tsx`

```typescript
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-gray-600">
            Get started with WhenAvailable Pro
          </p>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg",
            },
          }}
        />

        <div className="text-center text-sm text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
```

#### Dashboard Page (Protected)

**File:** `app/dashboard/page.tsx`

```typescript
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await getCurrentUser();

  return (
    <div>
      <h1>Welcome to your dashboard</h1>
      <p>Subscription: {user?.subscriptionStatus}</p>

      {user?.subscriptionStatus !== 'pro' && (
        <a href="/upgrade">Upgrade to Pro</a>
      )}

      {/* Dashboard content */}
    </div>
  );
}
```

### Key Decisions

**1. Why require accounts for Pro?**
- Impossible to charge recurring payments anonymously
- Need user ID to associate with Stripe customer
- Enables dashboard, settings, subscription management

**2. Why keep free tier anonymous?**
- Maintains competitive advantage
- Lower barrier to entry
- Privacy-first positioning

**3. Why Clerk over NextAuth?**
- Faster implementation (days vs weeks)
- Better UI out of the box
- Free tier is generous (10K users)
- Built-in Stripe integration

---

## Database Architecture (Supabase) 🗄️

**Purpose:** Store Pro user accounts, subscription status, and metadata for Pro links.

**Why Supabase?**
- ✅ PostgreSQL database (reliable, scalable)
- ✅ Real-time subscriptions (optional)
- ✅ Built-in authentication (if not using Clerk)
- ✅ Storage for user-uploaded content (logos)
- ✅ Generous free tier (500MB DB, 2GB storage)
- ✅ Automatic backups
- ✅ Edge functions (if needed)
- ✅ Excellent Next.js integration

### Database Schema

#### Users Table

**Purpose:** Store Pro user accounts and subscription information

```sql
CREATE TABLE users (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL, -- From Clerk authentication
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Stripe Subscription
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'free', -- 'free', 'pro', 'cancelled', 'past_due'
  subscription_id TEXT,
  subscription_plan TEXT DEFAULT 'free', -- 'free', 'pro_monthly'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,

  -- Usage Tracking (for limits)
  links_created_this_month INTEGER DEFAULT 0,
  storage_used_bytes BIGINT DEFAULT 0, -- For logos, attachments

  -- User Preferences
  default_timezone TEXT DEFAULT 'America/New_York',
  notification_email BOOLEAN DEFAULT true,

  -- Branding (Pro only)
  logo_url TEXT,
  primary_color TEXT DEFAULT '#4F46E5',
  accent_color TEXT DEFAULT '#3B82F6',
  custom_message TEXT
);

-- Indexes for performance
CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### User Slots Table

**Purpose:** Track Pro links created by users (for analytics and management)

```sql
CREATE TABLE user_slots (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  slot_id TEXT NOT NULL, -- The Redis key (e.g., "abc123")

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,

  -- Slot Configuration
  is_pro BOOLEAN DEFAULT false,
  max_bookings INTEGER DEFAULT 1,
  current_bookings INTEGER DEFAULT 0,
  expiration_days INTEGER DEFAULT 1,

  -- Purpose & Description
  meeting_purpose TEXT,
  creator_name TEXT,

  -- Analytics
  view_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  booking_conversion_rate DECIMAL(5,2),

  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'fully_booked', 'expired', 'cancelled'

  -- Constraints
  CONSTRAINT valid_max_bookings CHECK (max_bookings > 0 AND max_bookings <= 10),
  CONSTRAINT valid_expiration CHECK (expiration_days > 0 AND expiration_days <= 30)
);

-- Indexes
CREATE INDEX idx_user_slots_user_id ON user_slots(user_id);
CREATE INDEX idx_user_slots_slot_id ON user_slots(slot_id);
CREATE INDEX idx_user_slots_status ON user_slots(status);
CREATE INDEX idx_user_slots_expires_at ON user_slots(expires_at);

-- Composite index for user's active slots
CREATE INDEX idx_user_slots_user_active
  ON user_slots(user_id, status)
  WHERE status = 'active';
```

#### Calendar Integrations Table

**Purpose:** Store encrypted OAuth tokens for calendar sync

```sql
CREATE TABLE calendar_integrations (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,

  -- Provider
  provider TEXT NOT NULL, -- 'google', 'outlook', 'apple'
  connected_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP,

  -- OAuth Tokens (ENCRYPTED)
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT NOT NULL,
  token_expires_at TIMESTAMP,

  -- Settings
  sync_enabled BOOLEAN DEFAULT true,
  auto_create_events BOOLEAN DEFAULT true,
  send_calendar_invites BOOLEAN DEFAULT true,

  -- Calendar Info
  calendar_id TEXT, -- Primary calendar ID
  calendar_email TEXT,

  CONSTRAINT valid_provider CHECK (provider IN ('google', 'outlook', 'apple'))
);

-- Indexes
CREATE INDEX idx_calendar_integrations_user_id ON calendar_integrations(user_id);
CREATE INDEX idx_calendar_integrations_provider ON calendar_integrations(provider);
```

### Supabase Setup

#### 1. Installation

```bash
npm install @supabase/supabase-js
```

#### 2. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### 3. Supabase Client

**File:** `lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

// Client-side (browser) - uses anon key
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side - uses service role key (bypasses RLS)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

#### 4. Database Operations

**File:** `lib/database.ts`

```typescript
import { supabaseAdmin } from './supabase';

export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  subscription_status: 'free' | 'pro' | 'cancelled' | 'past_due';
  stripe_customer_id?: string;
  subscription_id?: string;
  current_period_end?: Date;
  // ... other fields
}

/**
 * Get user by Clerk user ID
 */
export async function getUser(clerkUserId: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data as User;
}

/**
 * Create new user (called from Clerk webhook)
 */
export async function createUser(
  clerkUserId: string,
  email: string
): Promise<User> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      clerk_user_id: clerkUserId,
      email,
      subscription_status: 'free',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data as User;
}

/**
 * Update user subscription status (called from Stripe webhook)
 */
export async function updateUserSubscription(
  clerkUserId: string,
  updates: {
    subscription_status?: User['subscription_status'];
    subscription_id?: string;
    stripe_customer_id?: string;
    current_period_start?: Date;
    current_period_end?: Date;
  }
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('clerk_user_id', clerkUserId);

  if (error) {
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
}

/**
 * Create user slot record (for Pro users)
 */
export async function createUserSlot(data: {
  user_id: string;
  slot_id: string;
  expires_at: Date;
  is_pro: boolean;
  max_bookings: number;
  meeting_purpose?: string;
}) {
  const { data: slot, error } = await supabaseAdmin
    .from('user_slots')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user slot: ${error.message}`);
  }

  return slot;
}

/**
 * Get user's active slots
 */
export async function getUserSlots(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('user_slots')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch user slots: ${error.message}`);
  }

  return data;
}
```

### Row Level Security (RLS)

**Enable RLS on all tables:**

```sql
-- Users table: users can only read/update their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own data"
  ON users FOR SELECT
  USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (clerk_user_id = auth.jwt() ->> 'sub');

-- User slots: users can read/update their own slots
ALTER TABLE user_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own slots"
  ON user_slots FOR SELECT
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Users can insert their own slots"
  ON user_slots FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
  ));
```

### Data Flow

```
┌─────────────────────────────────────────────────┐
│ User signs up (Clerk)                           │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ Clerk webhook fires → /api/webhooks/clerk       │
│ Creates user record in Supabase                 │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ User subscribes to Pro (Stripe)                 │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ Stripe webhook fires → /api/webhooks/stripe     │
│ Updates subscription_status in Supabase         │
└──────────────┬──────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────┐
│ User creates Pro link                           │
│ - Slot stored in Redis (temporary)              │
│ - Metadata stored in Supabase (permanent)       │
└─────────────────────────────────────────────────┘
```

### Hybrid Storage Strategy

**Redis (Temporary):**
- Slot availability data
- Booking data
- Auto-expires with TTL
- Fast read/write

**Supabase (Permanent):**
- User accounts
- Subscription status
- Slot metadata (for analytics)
- User preferences
- Uploaded files (logos)

---

## Stripe Subscription Integration 💳

**Goal:** Collect $5/month recurring payments from Pro users.

### Stripe Products & Prices

**Create in Stripe Dashboard:**

1. **Product:** "WhenAvailable Pro"
   - Description: "Premium scheduling features for professionals"
   -
2. **Price:** $5/month recurring
   - Billing period: Monthly
   - Currency: USD
   - Price ID: `price_xxx` (save this for env vars)

### Subscription Flow

```
┌──────────────────────────────────────────────────┐
│ 1. User clicks "Upgrade to Pro"                  │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ 2. Create Stripe Checkout Session                │
│    POST /api/stripe/create-checkout              │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ 3. Redirect to Stripe Checkout                   │
│    (User enters payment details)                 │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ 4. User completes payment                        │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ 5. Stripe webhook: checkout.session.completed    │
│    POST /api/webhooks/stripe                     │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ 6. Update user subscription_status = 'pro'       │
│    in Supabase                                   │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ 7. Redirect to dashboard → Pro features unlocked │
└──────────────────────────────────────────────────┘
```

### Implementation

#### 1. Create Checkout Session

**File:** `app/api/stripe/create-checkout/route.ts`

```typescript
import { auth } from '@clerk/nextjs';
import Stripe from 'stripe';
import { getUser, updateUserSubscription } from '@/lib/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST() {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    let user = await getUser(userId);

    // Create Stripe customer if doesn't exist
    let stripeCustomerId = user?.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user?.email,
        metadata: {
          clerk_user_id: userId,
        },
      });

      stripeCustomerId = customer.id;

      // Update user with Stripe customer ID
      await updateUserSubscription(userId, {
        stripe_customer_id: stripeCustomerId,
      });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID!, // From Stripe Dashboard
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`,
      metadata: {
        clerk_user_id: userId,
      },
      allow_promotion_codes: true, // Enable promo codes
      billing_address_collection: 'required',
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return Response.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

#### 2. Stripe Webhook Handler

**File:** `app/api/webhooks/stripe/route.ts`

```typescript
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { updateUserSubscription } from '@/lib/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  // Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Webhook signature verification failed', {
      status: 400,
    });
  }

  // Handle events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const clerkUserId = session.metadata?.clerk_user_id;

      if (clerkUserId) {
        await updateUserSubscription(clerkUserId, {
          subscription_status: 'pro',
          subscription_id: session.subscription as string,
          stripe_customer_id: session.customer as string,
        });

        console.log(`✅ User ${clerkUserId} upgraded to Pro`);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(
        subscription.customer as string
      );

      if ('metadata' in customer) {
        const clerkUserId = customer.metadata?.clerk_user_id;

        if (clerkUserId) {
          const status = subscription.status === 'active' ? 'pro' :
                        subscription.status === 'past_due' ? 'past_due' :
                        'cancelled';

          await updateUserSubscription(clerkUserId, {
            subscription_status: status,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
          });

          console.log(`✅ Subscription updated for ${clerkUserId}: ${status}`);
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customer = await stripe.customers.retrieve(
        subscription.customer as string
      );

      if ('metadata' in customer) {
        const clerkUserId = customer.metadata?.clerk_user_id;

        if (clerkUserId) {
          await updateUserSubscription(clerkUserId, {
            subscription_status: 'cancelled',
            subscription_id: null,
          });

          console.log(`✅ Subscription cancelled for ${clerkUserId}`);
        }
      }
      break;
    }
  }

  return new Response('Webhook received', { status: 200 });
}
```

#### 3. Customer Portal (Manage Subscription)

**File:** `app/api/stripe/customer-portal/route.ts`

```typescript
import { auth } from '@clerk/nextjs';
import Stripe from 'stripe';
import { getUser } from '@/lib/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST() {
  const { userId } = auth();

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getUser(userId);

  if (!user?.stripe_customer_id) {
    return Response.json(
      { error: 'No subscription found' },
      { status: 404 }
    );
  }

  // Create portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return Response.json({ url: session.url });
}
```

### UI Components

#### Upgrade Button

**File:** `components/upgrade-button.tsx`

```typescript
'use client';

import { useState } from 'react';

export function UpgradeButton() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg"
    >
      {loading ? 'Loading...' : 'Upgrade to Pro - $5/month'}
    </button>
  );
}
```

#### Manage Subscription Button

```typescript
'use client';

export function ManageSubscriptionButton() {
  const handleClick = async () => {
    const response = await fetch('/api/stripe/customer-portal', {
      method: 'POST',
    });

    const { url } = await response.json();
    window.location.href = url;
  };

  return (
    <button onClick={handleClick}>
      Manage Subscription
    </button>
  );
}
```

---

## Feature 1: Multiple Bookings Per Link ⭐

**Priority:** HIGH
**Implementation Time:** 2-3 weeks
**Complexity:** Medium

### Use Cases

#### Use Case 1.1: Workshop/Webinar Signups
- **Scenario:** Sarah runs a free webinar on "Product Management Basics" and has 5 available time slots over 2 weeks
- **Current Problem:** She needs to create 5 separate links, causing confusion for attendees
- **Pro Solution:** One link with 5 slots, each can be booked by different people. Link expires when all 5 slots are filled or after 7 days
- **Example:** "Product Management Workshop - Book any of my 5 available sessions"

#### Use Case 1.2: Office Hours
- **Scenario:** Professor Mike holds office hours and wants 4 students to book different 30-minute slots in one afternoon
- **Current Problem:** First student books, link expires, other 3 students can't book
- **Pro Solution:** Create one link with 4 consecutive 30-min slots. Each student books their preferred time
- **Example:** "Office Hours - Tuesday 2-4pm (4 slots available)"

#### Use Case 1.3: Client Consultations
- **Scenario:** Consultant offers 3 free discovery calls this week to potential clients
- **Current Problem:** Needs to manually manage multiple links and track which slots are taken
- **Pro Solution:** One link with 3 different time options. Automatically removes booked slots from view
- **Example:** "Free Discovery Call - Pick any available time (3 spots left)"

### Technical Implementation

#### 1. Database Schema Changes

**File:** `types/slot.ts`

```typescript
// Enhanced Slot type
export interface Slot {
  id: string;
  createdAt: number;
  expiresAt: number;
  creatorName?: string;
  creatorEmail: string;
  meetingPurpose?: string;

  // NEW: Change from single array to bookable slots
  timeSlots: BookableTimeSlot[];  // Each slot can be booked individually

  timezone: string;
  status: SlotStatus;
  viewCount?: number;

  // NEW: Pro tier fields
  isPro: boolean;  // Is this a Pro user link?
  maxBookings: number;  // Max number of bookings allowed (Pro: 3-10, Free: 1)
  currentBookings: number;  // How many slots have been booked
}

// NEW: Bookable time slot with booking status
export interface BookableTimeSlot extends TimeSlot {
  slotIndex: number;  // Unique identifier within this link (0, 1, 2...)
  isBooked: boolean;  // Has this specific slot been booked?
  bookedBy?: string;  // Email of booker (optional, for creator reference)
}

// Update booking to track which specific slot was booked
export interface Booking {
  slotId: string;
  slotIndex: number;  // NEW: Which specific slot was booked (0, 1, 2...)
  bookedAt: number;
  bookerName: string;
  bookerEmail: string;
  bookerNote?: string;
  selectedTime: string;
  timezone: string;
}
```

#### 2. Redis Key Structure Changes

```typescript
// OLD: booking:{slotId} → single booking
// NEW: booking:{slotId}:{slotIndex} → multiple bookings per link

// Example for a link with 3 bookable slots:
// slot:abc123 → Slot data with 3 BookableTimeSlots
// booking:abc123:0 → First booking
// booking:abc123:1 → Second booking
// booking:abc123:2 → Third booking
```

#### 3. API Changes

##### Endpoint: `POST /api/slots/create`

**Request Body Enhancement:**
```json
{
  "creatorName": "Sarah Chen",
  "creatorEmail": "sarah@example.com",
  "meetingPurpose": "Office Hours",
  "timeSlots": [
    { "date": "2025-11-01", "startTime": "14:00", "endTime": "15:00" },
    { "date": "2025-11-01", "startTime": "15:00", "endTime": "16:00" },
    { "date": "2025-11-01", "startTime": "16:00", "endTime": "17:00" }
  ],
  "timezone": "America/New_York",

  "maxBookings": 3,
  "isPro": true
}
```

**Validation Logic:**
```typescript
// Free users: maxBookings = 1 (current behavior)
// Pro users: maxBookings = 3-10
// If maxBookings > 1, convert each timeSlot to BookableTimeSlot

if (!isPro && maxBookings > 1) {
  throw new Error('Multiple bookings requires Pro plan');
}

if (isPro && maxBookings > 10) {
  throw new Error('Maximum 10 bookings per link');
}
```

##### Endpoint: `GET /api/slots/[id]`

**Response Changes:**
```json
{
  "success": true,
  "slot": {
    "id": "abc123",
    "creatorName": "Sarah Chen",
    "creatorEmail": "sarah@example.com",
    "meetingPurpose": "Office Hours",
    "timeSlots": [
      {
        "date": "2025-11-01",
        "startTime": "14:00",
        "endTime": "15:00",
        "slotIndex": 0,
        "isBooked": false
      },
      {
        "date": "2025-11-01",
        "startTime": "15:00",
        "endTime": "16:00",
        "slotIndex": 1,
        "isBooked": true,
        "bookedBy": "alice@example.com"
      },
      {
        "date": "2025-11-01",
        "startTime": "16:00",
        "endTime": "17:00",
        "slotIndex": 2,
        "isBooked": false
      }
    ],
    "maxBookings": 3,
    "currentBookings": 1,
    "slotsRemaining": 2,
    "isPro": true
  }
}
```

##### Endpoint: `POST /api/slots/[id]/book`

**Request Body Enhancement:**
```json
{
  "slotIndex": 0,
  "selectedTimeSlot": {
    "date": "2025-11-01",
    "startTime": "14:00",
    "endTime": "15:00"
  },
  "bookerName": "Alice Johnson",
  "bookerEmail": "alice@example.com",
  "bookerNote": "Looking forward to it!",
  "timezone": "America/Los_Angeles"
}
```

**Business Logic:**
1. Check if `slotIndex` exists and is not already booked
2. Create booking with key: `booking:{slotId}:{slotIndex}`
3. Update slot to mark `timeSlots[slotIndex].isBooked = true`
4. Increment `slot.currentBookings`
5. If `currentBookings >= maxBookings`, mark slot as `FULLY_BOOKED`
6. Send emails to both parties (same as current)

##### NEW Endpoint: `GET /api/slots/[id]/bookings`

**Purpose:** Allow creator to view all bookings for their link

**Request:**
```
GET /api/slots/abc123/bookings?token={creatorToken}
```

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "slotIndex": 0,
      "bookerName": "Alice",
      "bookerEmail": "alice@example.com",
      "selectedTime": "2025-11-01T14:00:00Z",
      "bookerNote": "Looking forward to it!"
    },
    {
      "slotIndex": 1,
      "bookerName": "Bob",
      "bookerEmail": "bob@example.com",
      "selectedTime": "2025-11-01T15:00:00Z",
      "bookerNote": null
    }
  ],
  "totalBooked": 2,
  "slotsRemaining": 1
}
```

#### 4. UI Changes

##### Homepage (`app/page.tsx`)
- Add toggle: "Enable multiple bookings" with Pro badge
- When enabled, show slider: "Allow 1-10 bookings per link"
- Show Pro upgrade prompt if user is not subscribed
- Display pricing comparison: "Pro: $5/month (50% less than Calendly)"

**UI Mockup:**
```
┌─────────────────────────────────────────┐
│ □ Enable Multiple Bookings  [PRO 👑]   │
│                                          │
│ Allow up to 10 people to book          │
│ different time slots from one link      │
│                                          │
│ [────────●──────────]  3 bookings       │
│                                          │
│ [Upgrade to Pro - $5/month]             │
└─────────────────────────────────────────┘
```

##### Booking Page (`app/[slotId]/page.tsx`)
- Display available slots (hide or gray out booked ones)
- Show "2 of 5 spots remaining" indicator at the top
- Update slot selection to pass `slotIndex` parameter
- Gray out booked slots with "Already booked by [name]" label (if creator enabled public visibility)

**UI Mockup:**
```
┌─────────────────────────────────────────┐
│ 📅 Office Hours with Sarah Chen         │
│                                          │
│ ⚡ 2 of 5 spots remaining               │
│                                          │
│ Available Times:                         │
│                                          │
│ ✓ Monday 2:00 PM - 3:00 PM  [BOOKED]   │
│ ○ Monday 3:00 PM - 4:00 PM  [BOOK]     │
│ ✓ Tuesday 2:00 PM - 3:00 PM [BOOKED]   │
│ ○ Tuesday 3:00 PM - 4:00 PM [BOOK]     │
│ ✓ Wednesday 2:00 PM - 3:00 PM [BOOKED] │
└─────────────────────────────────────────┘
```

##### Creator Confirmation Page (`app/created/[slotId]/page.tsx`)
- Show "0 of 5 bookings" counter with progress bar
- Add "View all bookings" link (protected by creator token)
- Real-time update as bookings come in (optional: use Vercel KV pub/sub or polling)
- Show list of recent bookings

**UI Mockup:**
```
┌─────────────────────────────────────────┐
│ ✅ Your link is live!                    │
│                                          │
│ [████████░░░░░░░░░] 2 of 5 booked       │
│                                          │
│ Recent Bookings:                         │
│ • Alice Johnson - Mon 3pm               │
│ • Bob Smith - Tue 2pm                   │
│                                          │
│ [View All Bookings Dashboard]           │
│ [Copy Link]  [Send Reminder Email]      │
└─────────────────────────────────────────┘
```

##### NEW: Bookings Dashboard (`app/created/[slotId]/bookings/page.tsx`)
- List all bookings for this link in a table format
- Show which slots are still available
- Allow creator to download as CSV
- Require authentication token (sent via email)
- Show attendee details: name, email, time, note

**Features:**
```typescript
interface BookingsDashboard {
  // Table columns
  columns: ['#', 'Name', 'Email', 'Time Slot', 'Note', 'Status'];

  // Actions
  actions: {
    downloadCSV: () => void;
    sendReminderToAll: () => void;
    cancelBooking: (slotIndex: number) => void;
  };

  // Filters
  filters: {
    showBooked: boolean;
    showAvailable: boolean;
  };
}
```

#### 5. Redis Operations Updates

**File:** `lib/redis.ts`

```typescript
/**
 * Create booking with slot index for multi-booking support
 */
export async function createBookingForSlot(
  slotId: string,
  slotIndex: number,
  booking: Booking
): Promise<boolean> {
  const client = getRedisClient();
  const slot = await getSlot(slotId);

  if (!slot) {
    throw new Error('Slot not found');
  }

  // Check if specific slot is available
  if (slot.timeSlots[slotIndex].isBooked) {
    throw new Error('This time slot has already been booked');
  }

  // Get current TTL of parent slot
  const slotKey = getSlotKey(slotId);
  const ttl = await client.ttl(slotKey);

  // Store booking
  const bookingKey = `booking:${slotId}:${slotIndex}`;
  await client.set(bookingKey, JSON.stringify(booking), { ex: ttl });

  // Update slot
  slot.timeSlots[slotIndex].isBooked = true;
  slot.timeSlots[slotIndex].bookedBy = booking.bookerEmail;
  slot.currentBookings += 1;

  // Check if fully booked
  if (slot.currentBookings >= slot.maxBookings) {
    slot.status = SlotStatus.FULLY_BOOKED;
  }

  await updateSlot(slotId, slot);
  return true;
}

/**
 * Get all bookings for a slot (for bookings dashboard)
 */
export async function getAllBookingsForSlot(slotId: string): Promise<Booking[]> {
  const client = getRedisClient();
  const pattern = `booking:${slotId}:*`;
  const keys = await client.keys(pattern);

  const bookings = await Promise.all(
    keys.map(key => client.get(key))
  );

  return bookings.filter(Boolean).map(b =>
    typeof b === 'string' ? JSON.parse(b) : b
  ) as Booking[];
}
```

#### 6. Email Notification Updates

**Changes:**
- Creator receives email for **EACH** booking (not just the first)
- Email subject updates with progress: "New booking! (2 of 5 slots now filled)"
- Include list of all booked slots so far
- Add link to view all bookings dashboard
- Send summary email when all slots are filled

**Template Example:**
```
Subject: New booking! (2 of 5 slots now filled) 🎉

Hi Sarah,

Great news! Someone just booked your "Office Hours" slot.

Booking Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Who: Alice Johnson (alice@example.com)
• When: Monday, Nov 1, 2025 at 3:00 PM EST
• Note: "Looking forward to discussing project ideas!"

Progress: 2 of 5 slots now booked ⚡

All Bookings:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Bob Smith - Monday 2:00 PM
✓ Alice Johnson - Monday 3:00 PM  [NEW]
○ Available - Tuesday 2:00 PM
○ Available - Tuesday 3:00 PM
○ Available - Wednesday 2:00 PM

[View Full Bookings Dashboard →]

Your link will remain active until all 5 slots are booked or
expires on Nov 8, 2025.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WhenAvailable - Pro Plan
```

#### 7. Expiration Logic Changes

```typescript
// Free tier: Expires after 1 booking or 24 hours
// Pro tier: Expires when ALL slots booked OR 7 days (whichever first)

// Update TTL logic:
if (isPro) {
  ttl = 7 * 24 * 60 * 60; // 7 days
} else {
  ttl = 24 * 60 * 60; // 24 hours
}

// Auto-expire when fully booked:
if (currentBookings >= maxBookings) {
  // Keep available for 1 hour for confirmation emails, then expire
  await client.expire(slotKey, 3600);

  // Send "All slots filled" email to creator
  await sendAllSlotsFilledEmail(slot);
}
```

---

## Feature 2: Extended Link Duration ⏰

**Priority:** MEDIUM
**Implementation Time:** 1 week
**Complexity:** Low

### Use Cases

#### Use Case 2.1: Flexible Interview Scheduling
- **Scenario:** Recruiter wants candidates to book interviews over next 2 weeks
- **Current Problem:** 24-hour expiration too short, needs to create new links daily
- **Pro Solution:** Create one link valid for 14 days
- **Example:** "Interview Slot - Book anytime in next 2 weeks"

#### Use Case 2.2: Monthly Office Hours
- **Scenario:** Manager sets up recurring office hours for entire month
- **Current Problem:** Free tier requires creating link every day
- **Pro Solution:** One link valid for 30 days with multiple slots
- **Example:** "Monthly Office Hours - Book your session"

### Technical Implementation

#### 1. Database Schema

```typescript
export interface Slot {
  // ... existing fields
  expirationDays: number;  // NEW: 1 (free), 7-30 (Pro)
}
```

#### 2. UI Changes

**Homepage:**
- Add dropdown on homepage: "Link expires in:"
  - Free tier: 24 hours (default, locked)
  - Pro tier: 7 days / 14 days / 30 days (selectable)
- Show expiration countdown with days instead of hours on booking page
- Add calendar view for multi-day slots

**UI Mockup:**
```
┌─────────────────────────────────────────┐
│ Link Expiration  [PRO 👑]               │
│                                          │
│ ┌─────────────────────────────────┐    │
│ │ 30 days                       ▼ │    │
│ └─────────────────────────────────┘    │
│                                          │
│ Options: 7 days, 14 days, 30 days       │
│                                          │
│ Your link will expire on Dec 30, 2025   │
└─────────────────────────────────────────┘
```

#### 3. API Logic

**File:** `app/api/slots/create/route.ts`

```typescript
// In POST /api/slots/create:
const expirationDays = isPro ? (body.expirationDays || 7) : 1;

// Validate Pro-only durations
if (!isPro && expirationDays > 1) {
  throw new Error('Extended link duration requires Pro plan');
}

if (isPro && expirationDays > 30) {
  throw new Error('Maximum 30-day expiration');
}

const expiresAt = now + expirationDays * 24 * 60 * 60 * 1000;
const ttl = expirationDays * 24 * 60 * 60; // Redis TTL in seconds
```

---

## Feature 3: Custom Branding 🎨

**Priority:** MEDIUM
**Implementation Time:** 1-2 weeks
**Complexity:** Low-Medium

### Use Cases

#### Use Case 4.1: Business Professional Branding
- **Scenario:** Consultant wants booking page to match their brand
- **Current Problem:** Generic WhenAvailable branding doesn't look professional
- **Pro Solution:** Upload logo, set custom colors, add tagline
- **Example:** Company logo at top, brand colors throughout

#### Use Case 4.2: White-Label Appearance
- **Scenario:** Agency wants to use WhenAvailable for clients without showing WhenAvailable branding
- **Current Problem:** "Powered by WhenAvailable" footer not professional
- **Pro Solution:** Remove branding, use custom domain
- **Example:** scheduling.youragency.com (custom subdomain)

### Technical Implementation

#### 1. Database Schema

```typescript
export interface Slot {
  // ... existing fields
  branding?: {
    logoUrl?: string;  // URL to uploaded logo
    primaryColor?: string;  // Hex color #4F46E5
    accentColor?: string;  // Hex color #3B82F6
    customMessage?: string;  // Display below purpose
    hideWhenAvailableBranding?: boolean;  // Pro only
  };
}
```

#### 2. UI Components

**Homepage Settings:**
```
┌─────────────────────────────────────────┐
│ Custom Branding  [PRO 👑]               │
│                                          │
│ Logo                                     │
│ ┌─────────────────────────────────┐    │
│ │ [Upload Logo] (Max 2MB)         │    │
│ └─────────────────────────────────┘    │
│                                          │
│ Primary Color                            │
│ ┌────────┐  #4F46E5                    │
│ │████████│  [Color Picker]             │
│ └────────┘                              │
│                                          │
│ □ Hide "Powered by WhenAvailable"       │
│                                          │
│ Custom Message (Optional)                │
│ ┌─────────────────────────────────┐    │
│ │ "Schedule time with our team"   │    │
│ └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

#### 3. Implementation

**Logo Upload:**
- Use Vercel Blob Storage for logo hosting
- Max size: 2MB
- Supported formats: PNG, JPG, SVG
- Automatic optimization and CDN delivery

```typescript
import { put } from '@vercel/blob';

export async function uploadLogo(file: File, userId: string) {
  const blob = await put(`logos/${userId}/${file.name}`, file, {
    access: 'public',
  });

  return blob.url;
}
```

**Color Customization:**
- Use CSS custom properties for theming
- Apply colors dynamically based on slot branding

```typescript
// In booking page
const styles = {
  '--primary-color': slot.branding?.primaryColor || '#4F46E5',
  '--accent-color': slot.branding?.accentColor || '#3B82F6',
} as React.CSSProperties;

return (
  <div style={styles} className="themed-page">
    {/* Page content */}
  </div>
);
```

---

## Feature 4: Calendar Integration 📅

**Priority:** HIGH
**Implementation Time:** 3-4 weeks
**Complexity:** High

### Use Cases

#### Use Case 4.1: Automatic Calendar Sync
- **Scenario:** User wants bookings automatically added to Google Calendar
- **Current Problem:** Must manually add .ics file to calendar
- **Pro Solution:** One-time authorization, automatic sync for all future bookings
- **Example:** Booking confirmed → Instantly appears in Google Calendar

#### Use Case 4.2: Prevent Double-Booking
- **Scenario:** User shares link but forgets they have another meeting
- **Current Problem:** Double-booking happens, requires manual cancellation
- **Pro Solution:** Check calendar availability before showing slots
- **Example:** Already-booked times automatically hidden

### Technical Implementation

#### 1. Supported Calendars
- Google Calendar (OAuth 2.0)
- Microsoft Outlook (Microsoft Graph API)
- Apple Calendar (CalDAV - limited)

#### 2. One-Way Sync (MVP)

**Flow:**
1. User connects calendar once (OAuth)
2. Store refresh token encrypted in Redis
3. After each booking, create calendar event via API
4. No continuous sync (reduces complexity)

**Benefits:**
- Simpler implementation
- Lower API quota usage
- Better privacy (read-only not required)

#### 3. Database Schema

```typescript
export interface Slot {
  // ... existing fields
  calendarIntegration?: {
    provider: 'google' | 'outlook';  // Which calendar service
    syncEnabled: boolean;  // Is sync active
    // Don't store tokens here - store in separate encrypted key
  };
}

// Separate encrypted storage for tokens
interface CalendarAuth {
  userId: string;  // Link to user (if we add accounts)
  provider: 'google' | 'outlook';
  accessToken: string;  // Encrypted
  refreshToken: string;  // Encrypted
  expiresAt: number;
}
```

#### 4. Google Calendar Integration

**Dependencies:**
```bash
npm install googleapis
```

**OAuth Flow:**
```typescript
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Step 1: Generate authorization URL
export function getGoogleAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
  });
}

// Step 2: Exchange code for tokens
export async function exchangeCodeForTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

// Step 3: Create calendar event after booking
export async function createGoogleCalendarEvent(
  refreshToken: string,
  eventDetails: {
    summary: string;
    description: string;
    start: string;  // ISO timestamp
    end: string;
    attendees: string[];  // Email addresses
  }
) {
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: eventDetails.summary,
      description: eventDetails.description,
      start: { dateTime: eventDetails.start },
      end: { dateTime: eventDetails.end },
      attendees: eventDetails.attendees.map(email => ({ email })),
    },
  });

  return event.data;
}
```

#### 5. UI Flow

**Settings Page:**
```
┌─────────────────────────────────────────┐
│ Calendar Integration  [PRO 👑]          │
│                                          │
│ Connect your calendar to automatically   │
│ add bookings and prevent double-booking  │
│                                          │
│ ○ Not Connected                          │
│                                          │
│ [Connect Google Calendar]                │
│ [Connect Outlook Calendar]               │
│                                          │
│ Benefits:                                │
│ ✓ Bookings added automatically           │
│ ✓ See all your meetings in one place    │
│ ✓ Get calendar notifications             │
└─────────────────────────────────────────┘
```

**After Connection:**
```
┌─────────────────────────────────────────┐
│ Calendar Integration  [PRO 👑]          │
│                                          │
│ ✓ Connected to Google Calendar           │
│   sarah.chen@gmail.com                   │
│                                          │
│ Settings:                                │
│ ☑ Add bookings to calendar               │
│ ☑ Send calendar invites to attendees     │
│ □ Check calendar for conflicts (Beta)    │
│                                          │
│ Last synced: 5 minutes ago               │
│                                          │
│ [Disconnect]  [Sync Now]                 │
└─────────────────────────────────────────┘
```

---

## Feature 5: Payment Collection 💳

**Priority:** MEDIUM
**Implementation Time:** 2-3 weeks
**Complexity:** Medium

**Note:** You already have Stripe integration for tips! This extends it to booking payments.

### Use Cases

#### Use Case 5.1: Paid Consultations
- **Scenario:** Consultant charges $200 for 1-hour discovery calls
- **Current Problem:** Must manually invoice after booking
- **Pro Solution:** Collect payment during booking process
- **Example:** "Book Discovery Call - $200 (pay now to confirm)"

#### Use Case 5.2: Deposit for Services
- **Scenario:** Salon requires $25 deposit to hold appointment
- **Current Problem:** No-shows without penalty
- **Pro Solution:** Collect refundable deposit, refund if attended
- **Example:** "Hair Appointment - $25 deposit (refunded after visit)"

### Technical Implementation

#### 1. Database Schema

```typescript
export interface Slot {
  // ... existing fields
  payment?: {
    enabled: boolean;
    amount: number;  // Amount in cents (e.g., 20000 = $200.00)
    currency: string;  // USD, EUR, etc.
    type: 'full' | 'deposit';  // Full payment or deposit
    description?: string;  // "1-hour consultation" or "Deposit"
  };
}

export interface Booking {
  // ... existing fields
  payment?: {
    stripePaymentIntentId: string;  // Stripe Payment Intent ID
    amount: number;
    status: 'pending' | 'succeeded' | 'failed' | 'refunded';
    paidAt?: number;  // Unix timestamp
  };
}
```

#### 2. Booking Flow with Payment

**Step 1: User selects slot**
```
┌─────────────────────────────────────────┐
│ Book Discovery Call with Sarah Chen     │
│                                          │
│ Monday, Nov 1, 2025                      │
│ 2:00 PM - 3:00 PM EST                   │
│                                          │
│ 💰 Price: $200.00                        │
│                                          │
│ [Continue to Payment]                    │
└─────────────────────────────────────────┘
```

**Step 2: Collect booking details + payment**
```
┌─────────────────────────────────────────┐
│ Your Information                         │
│ ┌─────────────────────────────────┐    │
│ │ Name: Alice Johnson             │    │
│ │ Email: alice@example.com        │    │
│ │ Phone: +1 (555) 123-4567        │    │
│ └─────────────────────────────────┘    │
│                                          │
│ Payment Details                          │
│ ┌─────────────────────────────────┐    │
│ │ [Stripe Payment Element]        │    │
│ └─────────────────────────────────┘    │
│                                          │
│ Total: $200.00                           │
│                                          │
│ [Complete Booking & Pay]                 │
└─────────────────────────────────────────┘
```

**Step 3: Confirmation**
```
┌─────────────────────────────────────────┐
│ ✅ Booking Confirmed!                    │
│                                          │
│ Payment: $200.00 ✓ Paid                 │
│ Receipt sent to alice@example.com        │
│                                          │
│ Meeting Details:                         │
│ • When: Monday, Nov 1 at 2:00 PM        │
│ • With: Sarah Chen                       │
│ • Location: Zoom (link in email)         │
│                                          │
│ [Add to Calendar]  [Download Receipt]   │
└─────────────────────────────────────────┘
```

#### 3. Stripe Implementation

**API Endpoint:** `POST /api/payment/create-intent`

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  const { slotId, slotIndex, amount, currency } = await request.json();

  // Create Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount, // Amount in cents
    currency: currency,
    metadata: {
      slotId,
      slotIndex,
    },
  });

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret
  });
}
```

**API Endpoint:** `POST /api/payment/confirm-booking`

```typescript
export async function POST(request: NextRequest) {
  const {
    paymentIntentId,
    slotId,
    slotIndex,
    bookerDetails
  } = await request.json();

  // Verify payment succeeded
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    return NextResponse.json(
      { error: 'Payment not completed' },
      { status: 400 }
    );
  }

  // Create booking
  const booking = await createBookingForSlot(slotId, slotIndex, {
    ...bookerDetails,
    payment: {
      stripePaymentIntentId: paymentIntentId,
      amount: paymentIntent.amount,
      status: 'succeeded',
      paidAt: Date.now(),
    },
  });

  // Send emails with receipt
  await sendBookingConfirmationWithReceipt(booking);

  return NextResponse.json({ success: true, booking });
}
```

#### 4. Refund Handling

**For Deposit-Type Payments:**
```typescript
export async function refundDeposit(bookingId: string) {
  const booking = await getBooking(bookingId);

  if (!booking.payment || booking.payment.type !== 'deposit') {
    throw new Error('Not a deposit payment');
  }

  const refund = await stripe.refunds.create({
    payment_intent: booking.payment.stripePaymentIntentId,
  });

  booking.payment.status = 'refunded';
  await updateBooking(bookingId, booking);

  await sendRefundConfirmationEmail(booking);

  return refund;
}
```

#### 5. Webhook Handling

**Endpoint:** `POST /api/webhooks/stripe`

```typescript
export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')!;
  const body = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Webhook signature verification failed', {
      status: 400
    });
  }

  // Handle events
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Payment succeeded - booking already created
      console.log('Payment succeeded:', event.data.object.id);
      break;

    case 'payment_intent.payment_failed':
      // Payment failed - notify user
      const failedPayment = event.data.object;
      await sendPaymentFailedEmail(failedPayment.metadata.slotId);
      break;

    case 'charge.refunded':
      // Refund processed
      const refund = event.data.object;
      await sendRefundConfirmationEmail(refund.metadata.slotId);
      break;
  }

  return new Response('Webhook received', { status: 200 });
}
```

---

## Implementation Timeline

### Phase 1: Foundation (Week 1-2)
**Goal:** Set up user accounts and subscription system

**Week 1: Authentication & Database**
- [ ] Install Clerk (`npm install @clerk/nextjs`)
- [ ] Configure Clerk environment variables
- [ ] Wrap app in `ClerkProvider`
- [ ] Create sign-up/sign-in pages (`app/sign-up`, `app/sign-in`)
- [ ] Set up middleware for route protection
- [ ] Create Supabase project
- [ ] Install Supabase client (`npm install @supabase/supabase-js`)
- [ ] Run database migrations (users, user_slots, calendar_integrations tables)
- [ ] Create `lib/database.ts` with CRUD operations
- [ ] Create `lib/auth-utils.ts` helper functions
- [ ] Set up Clerk webhook endpoint (`/api/webhooks/clerk`)
- [ ] Test user creation flow (Clerk → Supabase)

**Week 2: Stripe Subscription**
- [ ] Create Stripe product "WhenAvailable Pro" ($5/month)
- [ ] Save Stripe Price ID to env vars
- [ ] Install Stripe SDK (already have for tips)
- [ ] Create checkout session endpoint (`/api/stripe/create-checkout`)
- [ ] Create Stripe webhook endpoint (`/api/webhooks/stripe`)
- [ ] Set up webhook signature verification
- [ ] Handle subscription events (created, updated, deleted)
- [ ] Create customer portal endpoint (`/api/stripe/customer-portal`)
- [ ] Build upgrade button component
- [ ] Build manage subscription component
- [ ] Create pricing page (`/app/pricing/page.tsx`)
- [ ] Add "Upgrade to Pro" CTAs on homepage
- [ ] Test complete subscription flow end-to-end

**Deliverables:**
- Users can sign up and subscribe to Pro plan
- Stripe billing dashboard functional
- Payment webhooks handling subscriptions correctly
- User dashboard showing subscription status
- Free tier still works without requiring authentication

### Phase 2: Multiple Bookings (Week 3-4)
**Goal:** Enable core Pro feature - multi-booking links

- [ ] Update database schema (BookableTimeSlot)
- [ ] Modify Redis key structure
- [ ] Update slot creation API
- [ ] Update booking API with slotIndex
- [ ] Build bookings dashboard UI
- [ ] Update email templates
- [ ] Implement expiration logic changes

**Deliverables:**
- Pro users can create multi-booking links
- Booking page shows available vs booked slots
- Creator dashboard shows all bookings

### Phase 3: Extended Features (Week 5-7)
**Goal:** Add remaining Pro features

**Week 5:**
- [ ] Extended link duration (7-30 days)
- [ ] Custom branding (logo, colors)
- [ ] Remove ads for Pro users

**Week 6:**
- [ ] Calendar integration (Google OAuth)
- [ ] One-way sync to Google Calendar
- [ ] Calendar event creation

### Phase 4: Payment Collection (Week 7-8)
**Goal:** Enable paid booking feature

- [ ] Payment Intent creation API
- [ ] Stripe Elements integration in booking flow
- [ ] Payment confirmation flow
- [ ] Receipt generation
- [ ] Refund handling
- [ ] Webhook implementation

**Deliverables:**
- Creators can charge for bookings
- Deposit collection functional
- Automatic receipt emails

### Phase 5: Testing & Polish (Week 9-10)
**Goal:** Ensure production-ready quality

- [ ] End-to-end testing (all Pro features)
- [ ] Load testing (100+ concurrent bookings)
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing
- [ ] Security audit
- [ ] Performance optimization

### Phase 6: Launch (Week 11)
**Goal:** Public Pro plan launch

- [ ] Beta testing with 20-50 users
- [ ] Collect feedback and iterate
- [ ] Prepare launch materials (blog post, social media)
- [ ] Launch Pro plan publicly
- [ ] Monitor metrics and user feedback

**Total Timeline:** 11 weeks (~3 months)

---

## Revenue Projections

### Assumptions
- **Free to Pro Conversion Rate:** 5% (industry average: 2-5%)
- **Churn Rate:** 10% monthly (lower for B2B tools)
- **Average Revenue Per User (ARPU):** $5/month
- **Customer Acquisition Cost (CAC):** $10 (organic growth)

### Growth Projections

| Month | Free Users | Pro Users | MRR | ARR | Notes |
|-------|-----------|-----------|-----|-----|-------|
| **Launch** | 1,000 | 50 | $250 | $3,000 | Beta launch |
| **Month 3** | 3,000 | 150 | $750 | $9,000 | Product Hunt launch |
| **Month 6** | 8,000 | 400 | $2,000 | $24,000 | Organic growth |
| **Month 12** | 20,000 | 1,000 | $5,000 | $60,000 | Content marketing |
| **Month 18** | 40,000 | 2,000 | $10,000 | $120,000 | Partnerships |
| **Month 24** | 75,000 | 3,750 | $18,750 | $225,000 | Scale phase |

### Revenue Breakdown (Month 12)

**Monthly Recurring Revenue (MRR):**
```
Pro Subscriptions:  1,000 users × $5  = $5,000
Tips/Donations:     20,000 × 1% × $3 = $600
Payment Processing: 500 × $2 × 2.9%  = $29
Total MRR:                             $5,629
```

**Annual Recurring Revenue (ARR):**
```
ARR = MRR × 12 = $67,548
```

### Cost Analysis

| Item | Monthly Cost | Annual Cost | Notes |
|------|-------------|------------|-------|
| **Infrastructure** | | | |
| Vercel Pro | $20 | $240 | Hosting + serverless functions |
| Upstash Redis | $50 | $600 | Temporary data storage |
| Vercel Blob Storage | $10 | $120 | Logo uploads |
| **Authentication & Database** | | | |
| Clerk | $0 | $0 | Free up to 10K MAU |
| Supabase | $0 | $0 | Free tier (500MB DB, 2GB storage) |
| **Services** | | | |
| SendGrid | $20 | $240 | Email notifications |
| Stripe fees (2.9% + $0.30) | $175 | $2,100 | Payment processing |
| **Tools** | | | |
| Domain | $1 | $12 | whenavailable.app |
| Monitoring/Analytics | $10 | $120 | Sentry, PostHog, etc. |
| **Total** | **$286** | **$3,432** | |

**Key Points:**
- No additional cost for authentication (Clerk free tier)
- No additional cost for database (Supabase free tier)
- Both services scale with free tier up to 10K users
- Upgrade costs kick in only when necessary (after product-market fit)

### Profitability Analysis (Month 12)

```
Monthly Revenue:     $5,629
Monthly Costs:       $286
Net Profit:          $5,343

Profit Margin:       94.9%
Break-even Users:    58 Pro users
```

### Long-Term Projections (5 Years)

| Year | Pro Users | MRR | ARR | Net Profit (Annual) |
|------|-----------|-----|-----|---------------------|
| 1 | 1,000 | $5,000 | $60,000 | $56,568 |
| 2 | 3,750 | $18,750 | $225,000 | $221,568 |
| 3 | 8,000 | $40,000 | $480,000 | $476,568 |
| 4 | 15,000 | $75,000 | $900,000 | $896,568 |
| 5 | 25,000 | $125,000 | $1,500,000 | $1,496,568 |

**Conservative estimate with 5% conversion rate and steady organic growth**

---

## Testing Checklist

### Pre-Launch Testing

#### Authentication & Subscription
- [ ] Sign up flow works (email/password)
- [ ] Sign up flow works (Google OAuth)
- [ ] Sign in flow works
- [ ] User created in Supabase after Clerk signup
- [ ] Middleware protects dashboard routes
- [ ] Public routes remain accessible
- [ ] Stripe checkout session creation works
- [ ] Payment with test card succeeds
- [ ] Webhook updates user subscription status
- [ ] User redirected to dashboard after payment
- [ ] Pro features unlocked after subscription
- [ ] Customer portal accessible
- [ ] Subscription cancellation works
- [ ] User downgraded after cancellation
- [ ] Free tier works without account

#### Multiple Bookings Feature
- [ ] Create Pro link with 3 slots
- [ ] Verify first booking doesn't expire link
- [ ] Book all 3 slots with different emails
- [ ] Verify link expires after all slots filled
- [ ] Test slotIndex validation (prevent booking same slot twice)
- [ ] Verify creator receives email for each booking
- [ ] Test bookings dashboard displays all bookings correctly
- [ ] Verify CSV export includes all booking details

#### Extended Link Duration
- [ ] Create link with 7-day expiration
- [ ] Verify link remains active after 24 hours
- [ ] Verify countdown shows days correctly
- [ ] Test link expiration after 7 days
- [ ] Verify TTL in Redis matches expiration setting

#### Custom Branding
- [ ] Upload logo (PNG, JPG, SVG)
- [ ] Verify logo appears on booking page
- [ ] Test color customization (primary, accent)
- [ ] Verify "Powered by WhenAvailable" can be hidden
- [ ] Test custom message display

#### Calendar Integration
- [ ] Complete Google OAuth flow
- [ ] Verify tokens stored encrypted
- [ ] Create booking and check Google Calendar
- [ ] Verify event details are correct
- [ ] Test token refresh mechanism
- [ ] Verify disconnect functionality

#### Payment Collection
- [ ] Create paid booking link ($50)
- [ ] Complete payment with test card
- [ ] Verify booking created after payment
- [ ] Check receipt email sent
- [ ] Test payment failure handling
- [ ] Test refund process
- [ ] Verify webhook events processed

### Security Testing
- [ ] SQL injection prevention (N/A - Redis only)
- [ ] XSS attack prevention
- [ ] CSRF protection (Next.js default)
- [ ] Rate limiting on all APIs
- [ ] Input validation (all fields)
- [ ] Encrypted token storage
- [ ] Secure payment processing
- [ ] PCI compliance (Stripe handles)

### Performance Testing
- [ ] Load test: 100 concurrent bookings
- [ ] Load test: 1,000 concurrent page views
- [ ] Verify Redis TTL handling at scale
- [ ] Test email delivery under load
- [ ] Monitor Vercel function execution time
- [ ] Test Stripe API response times

### Cross-Browser Testing
- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Edge (desktop)

### Mobile Testing
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive design (320px - 1920px)
- [ ] Touch targets (44px minimum)
- [ ] Form inputs on mobile keyboards

### Edge Cases
- [ ] Booking during last minute before expiration
- [ ] Double-booking race condition
- [ ] Payment timeout handling
- [ ] Calendar sync failure
- [ ] Expired Stripe token
- [ ] Redis connection failure

---

## Competitive Analysis

### Calendly vs WhenAvailable Pro

| Feature | Calendly Standard ($10/mo) | WhenAvailable Pro ($5/mo) | Advantage |
|---------|---------------------------|---------------------------|-----------|
| **Pricing** | $10/month | $5/month | ✅ 50% cheaper |
| **Signup Required** | Yes | No (optional) | ✅ Lower friction |
| **Data Retention** | Permanent | 30 days max | ✅ Privacy-first |
| **Link Expiration** | Permanent | 7-30 days | ⚠️ Trade-off |
| **Multiple Bookings** | Unlimited | 10 per link | ⚠️ Limited |
| **Calendar Sync** | Two-way | One-way | ⚠️ Simpler |
| **Payment Collection** | Yes (Stripe/PayPal) | Yes (Stripe) | ✅ Equal |
| **Custom Branding** | Limited | Full | ✅ Better |
| **Team Features** | Yes (extra $) | Coming in Teams tier | ⚠️ Future |
| **Video Conf Integration** | Yes | Coming soon | ⚠️ Future |

### Our Unique Advantages

1. **Privacy-First:** No permanent data storage
2. **No Signup Friction:** Use immediately without account
3. **50% Cheaper:** $5 vs $10/month
4. **Temporary by Design:** Perfect for one-off events

### Target Market Differentiation

**Calendly Target:** Businesses wanting permanent scheduling infrastructure
**WhenAvailable Target:** Individuals/freelancers wanting temporary, privacy-focused scheduling

---

## Success Metrics

### Key Performance Indicators (KPIs)

#### Conversion Metrics
- **Free to Pro Conversion Rate:** Target 5% (Industry: 2-5%)
- **Trial to Paid Conversion:** Target 25% (if we add trials)
- **Upgrade Time:** Average days from signup to Pro upgrade

#### Usage Metrics
- **Pro Feature Adoption:**
  - % using multiple bookings: Target 80%
  - % using extended duration (7+ days): Target 70%
  - % using custom branding: Target 50%
  - % using calendar sync: Target 40%
  - % using payment collection: Target 20%

- **Booking Success Rate:** Target 85% (booked / viewed)
- **No-Show Rate:** Target <15%

#### Revenue Metrics
- **Monthly Recurring Revenue (MRR):** Track growth month-over-month
- **Customer Lifetime Value (LTV):** Target $100 (20 months retention)
- **Churn Rate:** Target <10% monthly
- **Average Revenue Per User (ARPU):** $5 base + upsells

#### Satisfaction Metrics
- **Net Promoter Score (NPS):** Target 50+
- **Customer Satisfaction (CSAT):** Target 4.5/5
- **Support Ticket Volume:** Track and minimize

---

## Environment Variables Reference ⚙️

Complete list of environment variables needed for Pro plan implementation.

**File:** `.env.local`

```bash
# ============================================
# AUTHENTICATION (Clerk)
# ============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
CLERK_WEBHOOK_SECRET=whsec_...

# ============================================
# DATABASE (Supabase)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# ============================================
# PAYMENTS (Stripe)
# ============================================
# Existing (already have for tips)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# NEW: Pro subscription price ID
STRIPE_PRO_PRICE_ID=price_...  # From Stripe Dashboard

# ============================================
# REDIS (Upstash) - Already have
# ============================================
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# ============================================
# EMAIL (SendGrid) - Already have
# ============================================
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=hello@whenavailable.app

# ============================================
# GOOGLE CALENDAR (Optional - Phase 3)
# ============================================
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_REDIRECT_URI=https://whenavailable.app/api/auth/google/callback

# ============================================
# APPLICATION
# ============================================
NEXT_PUBLIC_APP_URL=https://whenavailable.app
NODE_ENV=production

# ============================================
# MONITORING & ANALYTICS (Optional)
# ============================================
SENTRY_DSN=https://...
POSTHOG_API_KEY=phc_...
```

### Setup Checklist

#### Clerk Setup
1. Create account at https://clerk.com
2. Create new application
3. Copy publishable key and secret key
4. Configure sign-in/sign-up URLs
5. Set up webhook endpoint
6. Copy webhook signing secret

#### Supabase Setup
1. Create account at https://supabase.com
2. Create new project
3. Run SQL migrations for tables
4. Copy project URL and anon key
5. Copy service role key (Settings → API)
6. Enable Row Level Security (RLS)

#### Stripe Setup
1. Already have account (for tips)
2. Create new product "WhenAvailable Pro"
3. Set price to $5/month recurring
4. Copy Price ID
5. Set up webhook endpoint for subscriptions
6. Test with Stripe CLI

---

## Migration & Rollout Strategy 🚀

**Goal:** Launch Pro features without breaking free tier or disrupting existing users.

### Principles

1. **Backward Compatibility:** Free tier must continue working exactly as before
2. **Zero Downtime:** All changes deployed incrementally
3. **Feature Flags:** Use flags to control Pro feature visibility
4. **Gradual Rollout:** Beta → Limited → General Availability

### Phase 1: Infrastructure Setup (Week 1-2)

**No User Impact**

```
┌─────────────────────────────────────────┐
│ Deploy infrastructure without exposing  │
│ any UI changes to users                 │
└─────────────────────────────────────────┘
```

**Tasks:**
1. Deploy Clerk authentication (middleware set to allow all public routes)
2. Create Supabase database tables
3. Set up webhook endpoints (not yet called)
4. Deploy Stripe subscription endpoints
5. Add environment variables to Vercel

**Verification:**
- Free tier works exactly as before
- New endpoints exist but aren't called
- No UI changes visible

**Rollback Plan:**
- Remove middleware
- Delete new API routes
- Keep database (no harm if unused)

### Phase 2: Soft Launch (Week 3-4)

**Limited User Impact: Invited Beta Testers Only**

```
┌─────────────────────────────────────────┐
│ Enable Pro features for invited users   │
│ via feature flag                        │
└─────────────────────────────────────────┘
```

**Feature Flag Implementation:**

```typescript
// lib/feature-flags.ts
export const BETA_USER_EMAILS = [
  'you@example.com',
  'beta-tester-1@example.com',
  'beta-tester-2@example.com',
];

export function isProFeatureEnabled(email?: string): boolean {
  if (process.env.NODE_ENV === 'development') {
    return true; // Always enabled in dev
  }

  if (!email) {
    return false;
  }

  return BETA_USER_EMAILS.includes(email);
}
```

**UI Changes:**
- Add "Pro" badge next to premium features
- Show "Coming Soon" instead of error for non-beta users
- Beta testers see full Pro features

**Monitoring:**
- Track beta user signups
- Monitor subscription conversions
- Collect feedback via Typeform/Tally
- Watch error rates on new endpoints

**Success Criteria:**
- 10+ beta testers sign up
- At least 5 subscribe to Pro
- No critical bugs reported
- Free tier unaffected

### Phase 3: Limited Availability (Week 5-6)

**Moderate User Impact: Show Pro Features to All**

```
┌─────────────────────────────────────────┐
│ Make Pro features visible to everyone   │
│ Allow anyone to upgrade                 │
└─────────────────────────────────────────┘
```

**Changes:**
- Remove feature flag (or expand to all users)
- Add "Upgrade to Pro" CTAs throughout app
- Show Pro badges on all premium features
- Create pricing page
- Add Pro plan to homepage

**Monitoring:**
- Conversion rate (free → Pro)
- Churn rate
- Support ticket volume
- Revenue (MRR)

**Success Criteria:**
- 50+ Pro subscribers
- <5% churn rate
- <10 support tickets/week
- $250+ MRR

### Phase 4: General Availability (Week 7+)

**Full Launch**

```
┌─────────────────────────────────────────┐
│ Announce Pro plan publicly              │
│ Marketing push                          │
└─────────────────────────────────────────┘
```

**Marketing Activities:**
- Blog post announcement
- Product Hunt launch
- Social media campaign
- Email to existing free users
- Update landing page with Pro features

**Post-Launch:**
- Monitor metrics daily
- Respond to feedback quickly
- Iterate on pricing if needed
- Add more Pro features based on requests

### Database Migration Strategy

**Approach:** Additive Only (No Breaking Changes)

```sql
-- ✅ GOOD: Add new tables
CREATE TABLE users (...);
CREATE TABLE user_slots (...);

-- ✅ GOOD: Add new columns to existing tables (if needed)
ALTER TABLE bookings ADD COLUMN user_id UUID;

-- ❌ BAD: Don't modify existing columns
-- ALTER TABLE bookings ALTER COLUMN ... (avoid)

-- ❌ BAD: Don't delete existing tables
-- DROP TABLE ... (never)
```

**Rollback Plan:**
```sql
-- If needed, just drop new tables
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_slots CASCADE;
DROP TABLE IF EXISTS calendar_integrations CASCADE;
```

### Redis Key Migration

**No migration needed!**
- New Pro links use same Redis structure with additional fields
- Old free links continue to work
- Both coexist peacefully

```typescript
// Old (free) slot
{
  id: 'abc123',
  timeSlots: [...],
  maxBookings: 1,  // Always 1 for free
}

// New (Pro) slot
{
  id: 'def456',
  userId: 'user_xyz',  // NEW: Links to Supabase user
  timeSlots: [...],
  maxBookings: 5,  // NEW: >1 for Pro
  isPro: true,  // NEW: Flag
}
```

### Monitoring & Alerting

**Critical Metrics:**
```typescript
// Set up alerts for:
{
  'stripe_webhook_failures': { threshold: 5, window: '5m' },
  'auth_failures': { threshold: 10, window: '1m' },
  'database_errors': { threshold: 3, window: '5m' },
  'subscription_churn_spike': { threshold: '20%', window: '1d' },
}
```

**Dashboard Metrics:**
- Active Pro subscribers (gauge)
- MRR (gauge)
- Subscription conversions (counter)
- Churn rate (gauge)
- Free vs Pro link creation ratio
- Average booking success rate

### Rollback Plan

**If something goes wrong:**

1. **Disable Pro Features Immediately**
   ```typescript
   // Add environment variable
   DISABLE_PRO_FEATURES=true

   // In code
   if (process.env.DISABLE_PRO_FEATURES === 'true') {
     return false; // Hide Pro features
   }
   ```

2. **Database Rollback** (if needed)
   ```sql
   -- Just drop new tables
   DROP TABLE users CASCADE;
   DROP TABLE user_slots CASCADE;
   ```

3. **Refund Pro Subscribers** (if necessary)
   ```typescript
   // Use Stripe API to refund
   await stripe.refunds.create({
     subscription: subscriptionId,
   });
   ```

4. **Communication Plan**
   - Email all Pro subscribers
   - Post status update on homepage
   - Refund proactively (don't wait for requests)
   - Offer extended free trial when relaunching

---

## Next Steps

1. **Review this document** with team/stakeholders
2. **Prioritize features** based on effort vs impact
3. **Set up development environment** for Pro features
4. **Create Stripe subscription plans** in dashboard
5. **Start with Phase 1** (User accounts + subscriptions)
6. **Build iteratively** - ship one feature at a time
7. **Collect user feedback** throughout development
8. **Launch beta** with 20-50 early adopters
9. **Iterate based on feedback** before public launch
10. **Market Pro plan** via content, social, partnerships

---

**Document Status:** ✅ Ready for Implementation
**Last Updated:** October 30, 2025
**Version:** 2.0 - Added Authentication (Clerk), Database (Supabase), and Stripe Integration

**Major Changes in v2.0:**
- ✅ Comprehensive authentication architecture with Clerk
- ✅ Complete Supabase database schema and setup
- ✅ Stripe subscription integration with webhooks
- ✅ Hybrid model (Free = no signup, Pro = signup required)
- ✅ Environment variables reference
- ✅ Migration & rollout strategy
- ✅ Updated cost analysis (Clerk & Supabase = $0)
- ✅ Enhanced Phase 1 implementation timeline
