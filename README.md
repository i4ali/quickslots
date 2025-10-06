# QuickSlots

**Temporary scheduling links without the hassle**

Share your availability in seconds. No signup, no calendar sync, no permanent links.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Database:** Upstash Redis (serverless)
- **Email:** SendGrid
- **Hosting:** Vercel

## 📁 Project Structure

```
quickslots/
├── app/                  # Next.js app directory
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Homepage
│   └── globals.css      # Global styles
├── components/          # React components
├── lib/                 # Utility functions
│   └── utils.ts         # Helper utilities
├── types/               # TypeScript type definitions
├── PRD.md              # Product Requirements Document
├── ROADMAP.md          # Development roadmap
└── README.md           # This file
```

## 🔧 Environment Variables

### Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your actual values** in `.env.local`

3. **Never commit `.env.local`** (already in .gitignore)

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `UPSTASH_REDIS_REST_URL` | Redis database URL | [Upstash Console](https://console.upstash.com/redis) |
| `UPSTASH_REDIS_REST_TOKEN` | Redis auth token | [Upstash Console](https://console.upstash.com/redis) |
| `SENDGRID_API_KEY` | Email API key | [SendGrid Settings](https://app.sendgrid.com/settings/api_keys) |
| `SENDGRID_FROM_EMAIL` | Sender email address | Your verified sender |
| `STRIPE_SECRET_KEY` | Stripe secret key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | AdSense publisher ID | [Google AdSense](https://www.google.com/adsense) |

### Optional Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Base URL for the app |
| `LINK_EXPIRATION_SECONDS` | `86400` | Link lifetime (24 hours) |
| `MAX_TIME_SLOTS_PER_LINK` | `5` | Max slots per link |
| `RATE_LIMIT_MAX_LINKS_PER_HOUR` | `10` | Rate limit per IP |

See `.env.example` for complete list and details.

## 📖 Documentation

- **PRD:** See [PRD.md](./PRD.md) for product requirements
- **Roadmap:** See [ROADMAP.md](./ROADMAP.md) for development plan
- **Redis Setup:** See [docs/REDIS_SETUP.md](./docs/REDIS_SETUP.md) for Upstash Redis configuration
- **Email Setup:** See [docs/SENDGRID_SETUP.md](./docs/SENDGRID_SETUP.md) for SendGrid email configuration
- **Stories:** Track progress with checkboxes in ROADMAP.md

## 🎯 Current Progress

**Phase 1: Foundation (4/5 complete - 80%)**

- ✅ **Story 1.1:** Project Initialization
- ✅ **Story 1.2:** Environment Configuration
- ✅ **Story 1.3:** Upstash Redis Setup
- ✅ **Story 1.4:** SendGrid Email Setup
- ⏳ **Next:** Story 1.5 - Basic Routing & Layout

**Overall: 4/25 stories (16%)**

## 🤝 Contributing

This is a side project. Development follows the roadmap in ROADMAP.md.

## 📄 License

ISC

---

Built with ❤️ for quick, temporary scheduling needs.
