# QuickSlots Development Roadmap

**Last Updated:** October 5, 2025
**Timeline:** 6 weeks to MVP launch
**Status:** Ready to build

---

## Overview

This roadmap breaks down QuickSlots development into **4 phases** with **24 trackable feature stories**. Each story can be checked off as completed.

**Progress Tracking:**
- ☐ = Not started
- 🚧 = In progress
- ✅ = Completed

---

## Phase 1: Foundation & Setup
**Timeline:** Week 1
**Goal:** Get basic infrastructure running

### ✅ Story 1.1: Project Initialization
**Description:** Set up Next.js project with TypeScript and Tailwind CSS

**Acceptance Criteria:**
- [x] Next.js 15 project created with App Router
- [x] TypeScript configured
- [x] Tailwind CSS installed and configured
- [x] Shadcn/ui dependencies installed and configured
- [x] Git repository initialized
- [x] Basic folder structure created (`/app`, `/components`, `/lib`, `/types`)

**PRD Reference:** Section 16.3 (Tech Stack)
**Dependencies:** None
**Complexity:** Low

---

### ✅ Story 1.2: Environment Configuration
**Description:** Set up environment variables and configuration files

**Acceptance Criteria:**
- [x] `.env.local` file created with placeholders
- [x] Environment variables documented in README with tables
- [x] `.env.example` file created with comprehensive comments
- [x] `.gitignore` properly configured
- [x] Config validation helper created (`/lib/env.ts`)
- [x] TypeScript type definitions for env vars (`/types/env.d.ts`)

**PRD Reference:** Section 7.4 (Infrastructure)
**Dependencies:** Story 1.1
**Complexity:** Low

---

### ✅ Story 1.3: Upstash Redis Setup
**Description:** Configure serverless Redis database for temporary data storage

**Acceptance Criteria:**
- [x] `@upstash/redis` package installed (v1.35.5)
- [x] Redis client configured in `/lib/redis.ts`
- [x] Connection tested with health check API (`/api/health`)
- [x] Helper functions created for slot operations (create, get, update, delete)
- [x] Helper functions created for booking operations
- [x] Type definitions created (`/types/slot.ts`)
- [x] Setup documentation created (`/docs/REDIS_SETUP.md`)

**Note:** Upstash account creation and database provisioning is done by the user following `/docs/REDIS_SETUP.md`

**PRD Reference:** Sections 7.2, 7.3, 7.4 (Backend, Redis Data Structure)
**Dependencies:** Story 1.2
**Complexity:** Medium

---

### ✅ Story 1.4: SendGrid Email Setup
**Description:** Configure email service for booking notifications

**Acceptance Criteria:**
- [x] `@sendgrid/mail` package installed (v8.1.6)
- [x] Email client configured in `/lib/email.ts`
- [x] Email templates created (`/lib/email-templates.ts`)
- [x] Test email API endpoint created (`/api/test-email`)
- [x] Health check updated to include email status
- [x] Setup documentation created (`/docs/SENDGRID_SETUP.md`)
- [x] Email validation functions included

**Note:** SendGrid account creation and API key setup done by user following `/docs/SENDGRID_SETUP.md`

**PRD Reference:** Sections 7.4, 7.5 (Infrastructure, Email Templates)
**Dependencies:** Story 1.2
**Complexity:** Medium

---

### ✅ Story 1.5: Basic Routing & Layout
**Description:** Create basic app structure and routing

**Acceptance Criteria:**
- [x] Homepage route (`/`) created
- [x] Booking page route (`/[slotId]`) created
- [x] Root layout with basic structure
- [x] 404 page created
- [x] Basic navigation (if needed)
- [x] Mobile-responsive layout shell

**PRD Reference:** Section 7.1 (Frontend)
**Dependencies:** Story 1.1
**Complexity:** Low

---

## Phase 2: Core Features
**Timeline:** Weeks 2-3
**Goal:** Build the main scheduling functionality

### ✅ Story 2.1: Homepage UI
**Description:** Create the landing page with hero section and value proposition

**Acceptance Criteria:**
- [x] Hero section with clear headline: "Share your availability in seconds"
- [x] Value proposition clearly communicated
- [x] CTA button to start creating link
- [x] Clean, minimal design matching PRD guidelines
- [x] Mobile-responsive
- [x] SEO meta tags configured

**PRD Reference:** Sections 6.1, 12.2 (User Flows, UI/UX Guidelines)
**Dependencies:** Story 1.5
**Complexity:** Medium

**Note:** Completed as part of Story 1.5

---

### ✅ Story 2.2: Natural Language Availability Input Component
**Description:** Build natural language text input for availability with real-time parsing

**Acceptance Criteria:**
- [x] Text input component for natural language availability
- [x] Integration with chrono-node library for parsing
- [x] Real-time parsing feedback (show interpreted date/time as user types)
- [x] Mobile-friendly interface
- [x] Validation (start time < end time, no past dates, valid parse results)
- [x] Timezone auto-detection (using browser API)
- [x] Optional timezone selector
- [x] Clean visual design with parsing examples/hints
- [x] Graceful error handling for unparseable input

**PRD Reference:** Section 4.2 (Natural Language Availability Input)
**Dependencies:** Story 1.1
**Complexity:** Medium-High

---

### ☐ Story 2.3: Link Creation Form
**Description:** Build the main form for creating availability links

**Acceptance Criteria:**
- [ ] Creator info inputs (name optional, email required, purpose optional)
- [ ] Multiple time slot addition (add/remove slots)
- [ ] Visual preview of added slots
- [ ] Form validation (email format, at least one slot, etc.)
- [ ] Timezone display and selection
- [ ] "Generate Link" button
- [ ] Loading state during generation
- [ ] Error handling and display

**PRD Reference:** Sections 4.1, 4.3, 6.1 (Link Generation, Creator Info, User Flow)
**Dependencies:** Story 2.2
**Complexity:** High

---

### ☐ Story 2.4: Link Generation API
**Description:** Create API endpoint to generate shareable scheduling links

**Acceptance Criteria:**
- [ ] `POST /api/slots/create` endpoint created
- [ ] Generate unique slot ID (short, URL-safe)
- [ ] Store data in Redis with 24hr TTL
- [ ] Validate input data
- [ ] Return slot ID and shareable URL
- [ ] Rate limiting (10 links/hour per IP)
- [ ] Error handling (Redis failures, validation errors)

**PRD Reference:** Sections 7.2 (Backend API)
**Dependencies:** Story 1.3, Story 2.3
**Complexity:** Medium

---

### ☐ Story 2.5: Link Created Confirmation Page
**Description:** Show confirmation after link is created with copy functionality

**Acceptance Criteria:**
- [ ] Display generated shareable link
- [ ] "Copy Link" button with feedback
- [ ] Expiration countdown (24 hours)
- [ ] Instructions on what happens next
- [ ] Tip jar section (optional support message)
- [ ] "Create Another Link" button
- [ ] Mobile-responsive

**PRD Reference:** Section 6.1 (Link Creator Flow)
**Dependencies:** Story 2.4
**Complexity:** Medium

---

### ☐ Story 2.6: Booking Page UI
**Description:** Create the page where recipients view and book available slots

**Acceptance Criteria:**
- [ ] Display creator name and meeting purpose
- [ ] Show all available time slots in recipient's timezone
- [ ] Timezone clearly displayed (e.g., "2:00 PM EST")
- [ ] Slot selection interface (clickable, visual feedback)
- [ ] Expired link state with friendly message
- [ ] Mobile-friendly interface
- [ ] Loading states

**PRD Reference:** Sections 4.4, 6.2 (Booking Interface, Recipient Flow)
**Dependencies:** Story 1.5
**Complexity:** Medium-High

---

### ☐ Story 2.7: Booking Form
**Description:** Form for recipients to enter their details and book a slot

**Acceptance Criteria:**
- [ ] Booker name input (required)
- [ ] Booker email input (required)
- [ ] Optional note field
- [ ] Selected time slot display
- [ ] Form validation
- [ ] "Confirm Booking" button
- [ ] Loading state during booking
- [ ] Error handling

**PRD Reference:** Sections 4.4, 6.2 (Booking Interface, Recipient Flow)
**Dependencies:** Story 2.6
**Complexity:** Medium

---

### ☐ Story 2.8: Booking API
**Description:** Create API endpoint to process slot bookings

**Acceptance Criteria:**
- [ ] `POST /api/slots/[id]/book` endpoint created
- [ ] Validate slot exists and not expired
- [ ] Validate slot not already booked
- [ ] Store booking data in Redis with same TTL as slot
- [ ] Mark slot as booked
- [ ] Return confirmation details
- [ ] Error handling (expired link, already booked, validation errors)

**PRD Reference:** Sections 7.2 (Backend API)
**Dependencies:** Story 1.3, Story 2.7
**Complexity:** Medium

---

### ☐ Story 2.9: Booking Confirmation Page
**Description:** Show confirmation after successful booking

**Acceptance Criteria:**
- [ ] Display meeting details (time, creator info)
- [ ] "Add to Calendar" button (.ics download)
- [ ] "What's next" explanation
- [ ] Confirmation that both parties will receive email
- [ ] Link expired message
- [ ] Tip jar section (optional)
- [ ] Mobile-responsive

**PRD Reference:** Section 6.2 (Recipient Flow)
**Dependencies:** Story 2.8
**Complexity:** Low-Medium

---

### ☐ Story 2.10: Email Notifications
**Description:** Send confirmation emails to both creator and booker

**Acceptance Criteria:**
- [ ] Booking confirmation email sent to booker
- [ ] Booking notification email sent to creator
- [ ] Emails contain meeting details in both timezones
- [ ] Plain text email templates (no complex HTML)
- [ ] Emails sent asynchronously (don't block booking response)
- [ ] Error handling (log failures, don't break booking)
- [ ] Emails match PRD templates (Section 7.5)

**PRD Reference:** Sections 4.4, 6.2, 7.5 (Email Requirements)
**Dependencies:** Story 1.4, Story 2.8
**Complexity:** Medium

---

### ☐ Story 2.10A: .ics Calendar File Generation
**Description:** Generate .ics calendar files for easy "Add to Calendar" functionality

**Acceptance Criteria:**
- [ ] .ics file generation utility created (`/lib/ics.ts`)
- [ ] Generates valid iCalendar format (RFC 5545 compliant)
- [ ] Includes event details: title, time, location (virtual), description
- [ ] Handles timezones correctly (UTC + TZID)
- [ ] .ics file attached to both emails (creator and booker)
- [ ] "Add to Calendar" download button on confirmation page
- [ ] Tested with Google Calendar, Outlook, Apple Calendar
- [ ] File size kept minimal (< 5KB)

**PRD Reference:** Sections 4.4, 6.2, 7.5 (Booking Interface, Email Templates)
**Dependencies:** Story 2.10
**Complexity:** Low-Medium

**Note:** .ics generation is completely free (just text file formatting). No external service needed.

---

### ☐ Story 2.11: Timezone Intelligence
**Description:** Implement proper timezone handling for creator and recipient

**Acceptance Criteria:**
- [ ] Auto-detect creator timezone from browser
- [ ] Auto-detect recipient timezone from browser
- [ ] Display all times in recipient's local timezone on booking page
- [ ] Include timezone names in displays (e.g., "EST", "PST")
- [ ] Store times in UTC in Redis
- [ ] Email shows time in both creator and booker timezone
- [ ] No double-booking due to timezone issues
- [ ] Use Luxon or date-fns for timezone handling

**PRD Reference:** Section 4.6 (Timezone Intelligence)
**Dependencies:** Stories 2.3, 2.6, 2.10
**Complexity:** High

---

### ☐ Story 2.12: Get Slot API
**Description:** Create API endpoint to retrieve slot details for booking page

**Acceptance Criteria:**
- [ ] `GET /api/slots/[id]` endpoint created
- [ ] Return slot data if exists and not expired
- [ ] Return 404 if slot doesn't exist
- [ ] Return expired status if TTL expired
- [ ] Return booked status if already booked
- [ ] Increment view count (optional analytics)
- [ ] Error handling

**PRD Reference:** Section 7.2 (Backend API)
**Dependencies:** Story 1.3
**Complexity:** Low-Medium

---

### ☐ Story 2.13: Auto-Expiration & Data Cleanup
**Description:** Ensure all data auto-deletes after 24 hours

**Acceptance Criteria:**
- [ ] Redis TTL set to 86400 seconds (24 hours) on creation
- [ ] Booking inherits same TTL as parent slot
- [ ] Slot expires immediately after booking (update TTL or delete)
- [ ] Verify data actually deletes (test with short TTL)
- [ ] Expired link page shows friendly message
- [ ] No manual cleanup jobs needed (Redis TTL handles it)

**PRD Reference:** Sections 4.5, 8.3 (Auto-Expiration, Privacy)
**Dependencies:** Story 1.3, Story 2.4, Story 2.8
**Complexity:** Medium

---

## Phase 3: Monetization & Polish
**Timeline:** Week 4
**Goal:** Add revenue streams and polish the UX

### ☐ Story 3.1: Google AdSense Integration
**Description:** Add minimal, non-intrusive ads to key pages

**Acceptance Criteria:**
- [ ] AdSense account created and approved
- [ ] Ad units created (728x90 desktop, 320x50 mobile)
- [ ] Ads placed on homepage (top banner)
- [ ] Ads placed on booking page (top or bottom banner)
- [ ] Ads placed on confirmation pages
- [ ] Maximum 1-2 ad units per page
- [ ] Ads clearly labeled "Advertisement"
- [ ] Ads don't interfere with functionality
- [ ] Page speed not significantly impacted

**PRD Reference:** Section 5.1 (Ad Placement)
**Dependencies:** Stories 2.1, 2.6, 2.9
**Complexity:** Medium

---

### ☐ Story 3.2: Tip/Donation System
**Description:** Add optional voluntary support mechanism

**Acceptance Criteria:**
- [ ] Stripe or PayPal account created
- [ ] Payment provider SDK integrated
- [ ] Tip jar component created (reusable)
- [ ] Suggested amounts: $2, $5, custom
- [ ] Placed on link created page and booking confirmation page
- [ ] Clear messaging: "Help keep QuickSlots free and running"
- [ ] One-click donation flow
- [ ] Thank you message after tip (no special treatment)
- [ ] No removal of ads after tipping

**PRD Reference:** Section 5.2 (Tip/Donation System)
**Dependencies:** Story 2.5, Story 2.9
**Complexity:** Medium-High

---

### ☐ Story 3.3: Tip API Endpoint
**Description:** Create API endpoint for processing tips

**Acceptance Criteria:**
- [ ] `POST /api/tips/create` endpoint created
- [ ] Stripe/PayPal payment session created
- [ ] Return payment URL for redirect
- [ ] Handle webhooks for payment confirmation
- [ ] Log successful tips (optional analytics)
- [ ] Error handling

**PRD Reference:** Section 7.2 (Backend API)
**Dependencies:** Story 3.2
**Complexity:** Medium

---

### ☐ Story 3.4: UI/UX Polish
**Description:** Refine the interface for professional look and feel

**Acceptance Criteria:**
- [ ] Consistent design system (colors, typography, spacing)
- [ ] Smooth transitions and animations (no jank)
- [ ] Clear focus indicators for accessibility
- [ ] Generous white space
- [ ] High contrast CTAs
- [ ] Fast-loading images (WebP format)
- [ ] Clear error messages
- [ ] Loading states for all async operations
- [ ] Design inspiration from Linear, Stripe, Vercel (minimal, clean)

**PRD Reference:** Section 12.2 (UI/UX Guidelines)
**Dependencies:** All UI stories (2.1-2.9)
**Complexity:** Medium

---

### ☐ Story 3.5: Security Hardening
**Description:** Implement security best practices

**Acceptance Criteria:**
- [ ] HTTPS enforced (Vercel handles this)
- [ ] Rate limiting on all API endpoints
- [ ] Input sanitization (prevent XSS)
- [ ] Email validation
- [ ] CSRF protection (Next.js handles this)
- [ ] No sensitive data logged
- [ ] Security headers configured
- [ ] SQL injection not applicable (Redis only)

**PRD Reference:** Section 8.2 (Security)
**Dependencies:** All API stories
**Complexity:** Medium

---

### ☐ Story 3.6: SEO Optimization
**Description:** Optimize for search engines

**Acceptance Criteria:**
- [ ] Server-side rendering working (Next.js default)
- [ ] Semantic HTML used throughout
- [ ] Meta tags on all pages (title, description)
- [ ] Open Graph tags for social sharing
- [ ] Schema.org markup added
- [ ] XML sitemap generated
- [ ] robots.txt created
- [ ] Target keywords: "temporary scheduling link", "disposable calendar", etc.
- [ ] Lighthouse SEO score > 90

**PRD Reference:** Section 8.5 (SEO)
**Dependencies:** Stories 2.1, 2.6
**Complexity:** Medium

---

### ☐ Story 3.7: Accessibility Compliance
**Description:** Ensure WCAG 2.1 AA compliance

**Acceptance Criteria:**
- [ ] Keyboard navigation works on all pages
- [ ] Screen reader friendly (semantic HTML, ARIA labels)
- [ ] High contrast mode support
- [ ] Clear focus indicators
- [ ] Alt text for all images
- [ ] Form labels properly associated
- [ ] Color contrast ratios meet WCAG AA standards
- [ ] Lighthouse accessibility score > 90

**PRD Reference:** Section 8.4 (Accessibility)
**Dependencies:** All UI stories
**Complexity:** Medium

---

## Phase 4: Testing & Launch
**Timeline:** Weeks 5-6
**Goal:** Test thoroughly and launch publicly

### ☐ Story 4.1: Cross-Browser Testing
**Description:** Test on all major browsers

**Acceptance Criteria:**
- [ ] Chrome (last 2 versions) - desktop & mobile
- [ ] Firefox (last 2 versions) - desktop & mobile
- [ ] Safari (last 2 versions) - desktop & mobile
- [ ] Edge (last 2 versions)
- [ ] Mobile Safari (iOS 13+)
- [ ] Chrome Mobile (Android 8+)
- [ ] All core features work on all browsers
- [ ] UI looks correct on all browsers

**PRD Reference:** Section 8.6 (Browser Support)
**Dependencies:** All features complete
**Complexity:** Medium

---

### ☐ Story 4.2: Mobile Testing
**Description:** Test on real mobile devices

**Acceptance Criteria:**
- [ ] Test on iOS device (iPhone)
- [ ] Test on Android device
- [ ] Date/time picker works well on mobile
- [ ] Forms are easy to fill on mobile
- [ ] Buttons are easily tappable
- [ ] No horizontal scrolling
- [ ] Text is readable without zooming
- [ ] Page loads fast on 3G

**PRD Reference:** Section 7.1 (Performance Requirements)
**Dependencies:** All features complete
**Complexity:** Medium

---

### ☐ Story 4.3: Performance Optimization
**Description:** Ensure fast load times and good performance

**Acceptance Criteria:**
- [ ] Page load time < 2 seconds on 3G
- [ ] Time to Interactive (TTI) < 3 seconds
- [ ] Lighthouse performance score > 90
- [ ] Images optimized (WebP, lazy loading)
- [ ] Code splitting implemented
- [ ] Minimal bundle size
- [ ] API response times < 500ms

**PRD Reference:** Section 8.1 (Performance)
**Dependencies:** All features complete
**Complexity:** Medium

---

### ☐ Story 4.4: End-to-End Testing
**Description:** Test complete user journeys

**Acceptance Criteria:**
- [ ] Creator flow: Create link → Receive booking notification
- [ ] Booker flow: Click link → Book slot → Receive confirmation
- [ ] Edge cases: Expired link, already booked, invalid data
- [ ] Timezone scenarios: Different creator/booker timezones
- [ ] Email delivery tested (both emails arrive correctly)
- [ ] Redis TTL expiration verified (data deletes after 24hrs)
- [ ] Rate limiting tested
- [ ] Error handling verified

**PRD Reference:** Sections 6.1, 6.2 (User Flows)
**Dependencies:** All features complete
**Complexity:** High

---

### ☐ Story 4.5: Beta Testing
**Description:** Get real users to test before public launch

**Acceptance Criteria:**
- [ ] 20-50 beta testers recruited
- [ ] Beta testing form/feedback mechanism set up
- [ ] Testers complete full user journeys
- [ ] Feedback collected and prioritized
- [ ] Critical bugs fixed
- [ ] Nice-to-have feedback documented for post-launch

**PRD Reference:** Section 13.1 (MVP Timeline)
**Dependencies:** Story 4.4
**Complexity:** Medium

---

### ☐ Story 4.6: Privacy Policy & Terms of Service
**Description:** Create required legal documents

**Acceptance Criteria:**
- [ ] Privacy policy written (emphasize zero data retention)
- [ ] Terms of service written
- [ ] Cookie consent for ads (GDPR/CCPA)
- [ ] Links to legal docs in footer
- [ ] Legal review (if budget allows)

**PRD Reference:** Section 8.3 (Privacy)
**Dependencies:** None
**Complexity:** Low-Medium

---

### ☐ Story 4.7: Vercel Deployment
**Description:** Deploy to production on Vercel

**Acceptance Criteria:**
- [ ] Vercel account created
- [ ] Project connected to Git repository
- [ ] Environment variables configured in Vercel
- [ ] Custom domain connected (quickslots.com or alternative)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Production deployment successful
- [ ] Preview deployments working for PRs
- [ ] Monitoring/alerts configured (Vercel Analytics)

**PRD Reference:** Section 7.4 (Infrastructure)
**Dependencies:** All features complete
**Complexity:** Medium

---

### ☐ Story 4.8: Launch Preparation
**Description:** Prepare for public launch

**Acceptance Criteria:**
- [ ] Product Hunt submission prepared
- [ ] Hacker News "Show HN" post drafted
- [ ] Reddit posts prepared for r/productivity, r/SideProject
- [ ] Twitter announcement drafted
- [ ] LinkedIn post prepared
- [ ] Screenshots and demo GIF created
- [ ] Launch checklist from PRD completed

**PRD Reference:** Sections 13.2, 13.3 (Launch Channels, Pre-Launch Checklist)
**Dependencies:** Story 4.7
**Complexity:** Low-Medium

---

### ☐ Story 4.9: Public Launch
**Description:** Launch QuickSlots to the world!

**Acceptance Criteria:**
- [ ] Product Hunt submission live
- [ ] Hacker News post published
- [ ] Reddit posts published
- [ ] Social media posts published
- [ ] Website live and accessible
- [ ] Monitoring active for issues
- [ ] Ready to respond to user feedback

**PRD Reference:** Section 13 (Launch Strategy)
**Dependencies:** Story 4.8
**Complexity:** Low

---

## Summary

**Total Stories:** 25
**Estimated Timeline:** 6 weeks
**Phases:** 4

### Phase Breakdown:
- **Phase 1 (Foundation):** 5 stories - Week 1
- **Phase 2 (Core Features):** 14 stories - Weeks 2-3 (includes .ics generation)
- **Phase 3 (Monetization & Polish):** 7 stories - Week 4
- **Phase 4 (Testing & Launch):** 9 stories - Weeks 5-6

### Complexity Distribution:
- **Low:** 8 stories
- **Medium:** 12 stories
- **High:** 5 stories

---

## How to Use This Roadmap

1. **Track Progress:** Mark stories as 🚧 when starting, ✅ when complete
2. **Daily Focus:** Work on 1-2 stories per day
3. **Dependencies:** Complete prerequisite stories first
4. **Flexibility:** Reorder within phases if needed
5. **Updates:** Update this doc as priorities change

---

## Next Steps

1. Start with Phase 1, Story 1.1 (Project Initialization)
2. Use the TodoWrite tool to track active stories
3. Check off items as you complete them
4. Review progress weekly

Good luck! 🚀
