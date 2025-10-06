# QuickSlots - Product Requirements Document

**Version:** 1.0
**Last Updated:** October 5, 2025
**Document Owner:** Product Team

---

## 1. Executive Summary

### 1.1 Product Vision
QuickSlots is a temporary scheduling link service that allows users to instantly create shareable availability links without creating an account or connecting a calendar. Think "one minute email" but for scheduling.

### 1.2 Value Proposition
- **For Users:** Share your availability in seconds without the hassle of calendar apps, account creation, or ongoing commitments
- **For the Business:** High-traffic, ad-supported service with viral growth potential through organic sharing

### 1.3 Business Model
Free service monetized through:
1. **Display advertising:** Minimal, tasteful ads (header/footer banners) that don't interfere with UX
2. **Optional tips/donations:** Users can support the service voluntarily (tips do NOT remove ads or unlock features)

Focus on high traffic volume, good user experience, and SEO optimization.

---

## 2. Problem Statement

### 2.1 Current Pain Points
1. **Overkill solutions:** Calendly, Cal.com require account creation for one-time scheduling needs
2. **Calendar privacy:** Users don't want to expose their real calendar or connect third-party apps
3. **Casual use cases:** "Coffee next week?" doesn't need enterprise scheduling software
4. **Time investment:** Setting up scheduling tools takes longer than just scheduling the meeting
5. **Spam concerns:** Don't want permanent scheduling links floating around the internet

### 2.2 Market Opportunity
- Millions of one-off scheduling needs daily (freelancers, job interviews, casual meetings, coffee chats)
- Success of temporary services (temp email, temp SMS) proves demand for disposable digital tools
- SEO opportunity for "temporary scheduling" and related keywords

---

## 3. Target Users

### 3.1 Primary Personas

**Persona 1: The Casual Scheduler**
- Needs to schedule 1-2 meetings/month with people outside their organization
- Doesn't want to pay for or set up Calendly
- Values privacy and simplicity
- Use cases: Coffee chats, informational interviews, casual meetups

**Persona 2: The Job Seeker**
- Scheduling interviews across multiple companies
- Doesn't want a permanent link in the wild
- Needs quick, professional scheduling
- Use cases: Job interviews, recruiter calls

**Persona 3: The Freelancer/Consultant**
- Occasional client discovery calls
- Doesn't want to invest in paid tools for rare use
- Needs something quick and disposable
- Use cases: Prospect calls, one-off consultations

**Persona 4: The Event Organizer**
- One-time events requiring volunteer coordination
- Needs simple slot booking
- Use cases: Focus groups, user research, community events

---

## 4. Core Features (v1)

### 4.1 Instant Link Generation
**Description:** Users land on homepage and immediately see availability input
**Requirements:**
- No signup required
- No email verification
- Single-page experience
- Link generated in <2 seconds

**User Flow:**
1. User visits quickslots.com
2. Sees input form immediately (no splash screen)
3. Enters availability
4. Clicks "Generate Link"
5. Gets shareable link

### 4.2 Natural Language Availability Input
**Description:** Simple text-based natural language interface for creating availability slots
**Requirements:**
- Clean, intuitive text input field (mobile-friendly)
- Allow multiple time slots to be added (maximum 5 slots per link)
- Natural language input examples: "Tuesday, Oct 8 - 2:00 PM to 4:00 PM", "tomorrow 3-5pm", "next Friday at 2pm"
- Real-time parsing feedback showing interpreted date/time
- Add/remove slot functionality
- Default to user's timezone (auto-detected via browser)
- Optional timezone selector
- Visual preview of all parsed slots

**Technical:**
- Use chrono-node library for natural language date parsing
- Validate parsed results (start must be before end, valid dates)
- Prevent past dates/times
- Maximum 5 time slots to prevent abuse
- Show clear visual feedback for successfully parsed slots
- Handle parsing failures gracefully with helpful error messages
- Display examples to guide users ("Try: 'tomorrow at 2pm' or 'Friday 10am-12pm'")

### 4.3 Creator Information Collection
**Description:** Collect minimal info from link creator for booking notifications
**Requirements:**
- Name (optional) - shown to booker
- Email (required) - for booking notifications only
- Meeting purpose (optional) - shown to booker (e.g., "Coffee chat", "Interview")
- No account creation
- No password required
- No email verification required

**Data Usage:**
- Email used ONLY for sending booking notification
- All creator data deleted after link expires
- No data stored beyond session lifetime
- No mailing lists or marketing emails

### 4.4 Simple Booking Interface
**Description:** Recipients can book without any account
**Requirements:**
- Clean, mobile-friendly booking page
- Show available slots clearly
- Collect minimal info: Name, Email, optional note
- One-click booking confirmation
- Auto-generate calendar invite (.ics file)

**Booking Flow:**
1. Recipient clicks QuickSlots link
2. Sees available time slots
3. Selects a slot
4. Enters name + email
5. Clicks "Book This Slot"
6. Receives confirmation page + email with .ics calendar file attachment

### 4.5 Auto-Expiration
**Description:** Links automatically expire to maintain "temporary" nature
**Requirements:**
- **Expire after exactly 24 hours** (hardcoded, non-customizable)
- Expire immediately after first booking (one-time use)
- Show countdown timer on booking page
- **All associated data deleted upon expiration** (emails, names, times, etc.)

**Expired Link Experience:**
- Show friendly "This link has expired" message
- Suggest creating a new QuickSlots link
- Display ad unit

**Design Decision:** 24-hour expiration is hardcoded to maintain simplicity and emphasize the truly temporary nature of the service. No user customization needed.

### 4.6 Timezone Intelligence
**Description:** Automatically handle timezone differences
**Requirements:**
- Auto-detect creator's timezone
- Auto-detect recipient's timezone
- Display times in recipient's local timezone
- Show timezone clearly (e.g., "2:00 PM EST" / "11:00 AM PST")
- No timezone confusion or double-booking

---

## 5. Monetization Strategy

### 5.1 Ad Placement (Minimal & Non-Intrusive)
**Approved Ad Locations:**
1. **Homepage:** Single top banner ad (728x90 or 320x50 mobile) + optional bottom banner
2. **Booking Page:** Single top or bottom banner ad
3. **Confirmation Page:** Single banner ad below confirmation message
4. **Expired Link Page:** Single banner ad

**Ad Requirements:**
- Google AdSense or similar reputable network
- **Maximum 1-2 ad units per page** (keep it minimal)
- No popup ads
- No auto-play video ads
- No interstitial ads
- Ads must not interfere with core functionality
- Fast-loading ad units (optimize for page speed)
- Ads clearly labeled as "Advertisement"

**UX Priority:** Ads should feel non-intrusive. User experience > ad revenue.

### 5.2 Tip/Donation System
**Description:** Optional voluntary support from users who love the service
**Requirements:**
- Tip jar displayed on key pages (homepage after link creation, confirmation page)
- Suggested amounts: $2, $5, custom amount
- Clear messaging: "Help keep QuickSlots free and running"
- **Tips do NOT remove ads or unlock features** (purely voluntary support)
- Integration with Stripe, PayPal, or Buy Me a Coffee
- One-click donation flow (no account needed)
- Thank you message after tip (no special treatment)

**Messaging:**
- "☕ Love QuickSlots? Help keep it running!"
- "💝 Support this free tool"

### 5.3 Revenue Projections (Target)
**Assumptions:**
- 10,000 monthly visitors (Month 6)
- 50,000 monthly visitors (Month 12)
- Average 3 pages per session
- $2-5 RPM (revenue per thousand impressions)
- 0.5-2% tip conversion rate

**Conservative Estimate (Ads + Tips):**

**Month 6:**
- Ads: 30,000 impressions × $2 RPM = $60
- Tips: 10,000 visitors × 1% conversion × $3 avg = $300
- **Total: ~$360/month**

**Month 12:**
- Ads: 150,000 impressions × $3 RPM = $450
- Tips: 50,000 visitors × 1% conversion × $3 avg = $1,500
- **Total: ~$1,950/month**

**Month 24:**
- Ads: 900,000 impressions × $4 RPM = $3,600
- Tips: 300,000 visitors × 1.5% conversion × $3 avg = $13,500
- **Total: ~$17,100/month**

*Note: Tips may significantly outperform ads if users love the service.*

### 5.4 Infrastructure Costs (Upstash Redis + Vercel)

**Estimated Monthly Costs:**

**Month 1-6 (MVP Phase):**
- Vercel Hobby (Free): $0
- Upstash Redis (Free tier - 500K commands): $0
- SendGrid (Free tier - 100 emails/day): $0
- Domain + SSL: ~$12/year = $1/month
- **Total: ~$1/month** ✅

**Month 6-12 (Growth Phase - 10K-50K visitors):**
- Vercel Hobby or Pro: $0-20/month
- Upstash Redis: $0-5/month (within free tier or minimal overage)
- SendGrid: $0-15/month (~300 emails/month)
- Domain: $1/month
- **Total: ~$1-41/month**

**Month 12-24 (Scale Phase - 50K-300K visitors):**
- Vercel Pro: $20/month
- Upstash Redis: $10-50/month (~200K-1M commands)
- SendGrid Essentials: $20-50/month
- Domain: $1/month
- **Total: ~$51-121/month**

**Net Profit Projections:**

| Month | Revenue | Infrastructure Costs | **Net Profit** |
|-------|---------|---------------------|---------------|
| 1-6 | $0-360 | $1 | **~$359** |
| 12 | $1,950 | $41 | **~$1,909** |
| 24 | $17,100 | $121 | **~$16,979** |

**Key Insight:** Infrastructure costs remain minimal (<1% of revenue) thanks to serverless architecture and Upstash's generous free tier.

---

## 6. User Flows

### 6.1 Link Creator Flow
```
1. Land on quickslots.com
2. See hero section: "Share your availability in seconds"
3. Fill in basic info:
   - Your Name (optional)
   - Your Email (required) - for booking notifications
   - Meeting Purpose (optional) - e.g., "Coffee chat"
4. Add availability using natural language input:
   - Type availability in plain text (e.g., "Tuesday 2-4pm", "tomorrow at 3pm")
   - See real-time parsing feedback showing interpreted date/time
   - Click "Add another slot" for multiple times
   - Remove unwanted slots
5. [Optional] Timezone selector (auto-detected)
6. [Optional] See tip jar suggestion
7. Click "Generate Link"
8. See confirmation page:
   - Shareable link (expires in 24 hours)
   - Copy button
   - What happens next (explained)
   - Tip jar (optional support)
9. [Ad unit displayed]
10. Copy link and share
```

### 6.2 Link Recipient Flow
```
1. Click QuickSlots link (from email, text, etc.)
2. Land on booking page showing:
   - Top banner ad (minimal)
   - Creator's name and meeting purpose
   - Available time slots (in recipient's timezone)
   - Clean, simple interface
3. Enter your details:
   - Your Name
   - Your Email
4. Select preferred time slot (click to select)
5. [Optional] Add note for creator
6. Click "Confirm Booking"
7. See confirmation page:
   - Meeting details (time, creator info)
   - "Add to Calendar" button (.ics download)
   - What's next explanation
   - Email confirmation sent to both parties
   - Link has now expired
   - Optional tip jar
8. [Ad unit displayed below]
9. Receive confirmation email with .ics calendar file attached
```

---

## 7. Technical Requirements

### 7.1 Frontend
**Technology:**
- React or Next.js (for SSR and SEO)
- Tailwind CSS for rapid, clean UI development
- Mobile-first responsive design
- Progressive Web App (PWA) capabilities

**Performance Requirements:**
- Page load <2 seconds
- Time to Interactive (TTI) <3 seconds
- Mobile-optimized (50%+ traffic expected on mobile)
- Lighthouse score >90

**Key Libraries:**
- chrono-node for natural language date parsing
- Luxon or date-fns for timezone handling
- Stripe/PayPal SDK for tip/donation processing

### 7.2 Backend
**Technology:**
- Node.js + Express or Next.js API routes
- **Upstash Redis** for temporary data storage (with built-in TTL)
- No traditional database needed (data auto-expires)

**API Endpoints:**
```
POST /api/slots/create
  - Input: creator_name, creator_email, meeting_purpose,
           time_slots[], timezone, expiration
  - Output: slot ID, shareable link, management token

GET /api/slots/:id
  - Input: slot ID
  - Output: creator info, available time slots, timezone, expiration time

POST /api/slots/:id/book
  - Input: slot ID, selected_time_slot, booker_name, booker_email, note
  - Output: confirmation, booking details, .ics file URL/data

POST /api/tips/create
  - Input: amount, payment_method
  - Output: payment URL (Stripe/PayPal)
```

### 7.2A Natural Language Date Processing

**Library:** chrono-node (https://github.com/wanasit/chrono)

**How It Works:**
Chrono-node parses natural language text and extracts date/time information, returning structured date objects.

**Example Usage:**
```javascript
import * as chrono from 'chrono-node';

// Parse single date/time
const result = chrono.parse('tomorrow at 3pm');
// Returns: [{ start: { date: Date }, text: 'tomorrow at 3pm' }]

// Parse date range (start and end)
const rangeResult = chrono.parse('Tuesday, Oct 8 - 2:00 PM to 4:00 PM');
// Returns: [{ start: { date: Date }, end: { date: Date }, text: '...' }]

// Parse simple range
const simpleRange = chrono.parse('Friday 10am-12pm');
// Returns: [{ start: { date: Date }, end: { date: Date } }]
```

**Supported Input Formats:**
- **Explicit dates with times:** "Tuesday, Oct 8 - 2:00 PM to 4:00 PM"
- **Relative dates:** "tomorrow at 3pm", "next Friday 2-4pm"
- **Informal ranges:** "Friday 10am-12pm", "this Tuesday from 2 to 4"
- **Date + time:** "October 10 at 2pm", "10/10 3:00 PM"
- **Multi-language support:** English, Japanese, French, Dutch, Russian, Ukrainian (partial: German, Spanish, Portuguese, Chinese)

**Implementation Details:**

1. **Client-side Parsing:**
   - User types natural language input in text field
   - On blur or button press, parse with chrono-node
   - Display interpreted date/time for user confirmation
   - Show error if parsing fails or returns ambiguous results

2. **Validation Rules:**
   - Must parse to valid date object
   - Start time must be before end time
   - Date/time must be in the future (no past dates)
   - If only start time provided, default end to 1 hour later
   - Maximum 5 slots per link

3. **UX Flow:**
   ```
   User types: "tomorrow 3-5pm"
   → Parse with chrono-node
   → Display: "✓ Wednesday, Oct 9, 2025 - 3:00 PM to 5:00 PM (EDT)"
   → User confirms or edits
   → Add to slot list
   ```

4. **Error Handling:**
   - **Unparseable input:** Show helpful message: "Try: 'tomorrow at 2pm' or 'Friday 10am-12pm'"
   - **Ambiguous dates:** Prompt for clarification
   - **Past dates:** "Please enter a future date/time"
   - **Invalid range:** "Start time must be before end time"

5. **Fallback Options:**
   - Provide example inputs below text field
   - "Try: 'tomorrow at 2pm', 'next Friday 10am-12pm', 'Oct 15 at 3pm'"
   - Allow manual editing of parsed result if needed

6. **Storage Format:**
   Store parsed dates as UTC timestamps in Redis:
   ```javascript
   {
     "time_slots": [
       {
         "start": "2025-10-09T19:00:00.000Z",  // UTC timestamp
         "end": "2025-10-09T21:00:00.000Z",    // UTC timestamp
         "raw_input": "tomorrow 3-5pm"         // Original user input
       }
     ]
   }
   ```

**Advantages Over Traditional Date Pickers:**
- ✅ Faster input (typing vs. clicking through calendars)
- ✅ More natural/intuitive ("tomorrow at 3" vs. selecting date + time)
- ✅ Better mobile experience (no complex picker UI)
- ✅ Flexible input formats
- ✅ Handles ranges naturally ("2-4pm" in one input)

**Package Information:**
- **NPM:** `chrono-node`
- **Size:** ~150KB (minified)
- **License:** MIT
- **Maintenance:** Actively maintained (2025)

### 7.3 Redis Data Structure

Using **Upstash Redis** with built-in TTL (Time-To-Live) for automatic data expiration.

**Key Pattern: `slot:{id}`**
```json
{
  "id": "abc123",
  "created_at": 1696800000,
  "expires_at": 1696972800,
  "creator_name": "Sarah Chen",
  "creator_email": "sarah@email.com",
  "meeting_purpose": "Coffee chat",
  "time_slots": [
    {"date": "2025-10-08", "start_time": "14:00", "end_time": "16:00"},
    {"date": "2025-10-09", "start_time": "10:00", "end_time": "12:00"}
  ],
  "timezone": "America/New_York",
  "status": "active"
}

TTL: 86400 seconds (24 hours) - AUTO-EXPIRES
```

**Key Pattern: `booking:{slot_id}`**
```json
{
  "slot_id": "abc123",
  "booked_at": 1696850000,
  "booker_name": "Alex Rodriguez",
  "booker_email": "alex@email.com",
  "booker_note": "Looking forward to meeting!",
  "selected_time": "2025-10-09T10:00:00",
  "timezone": "America/Los_Angeles"
}

TTL: Same as parent slot - AUTO-EXPIRES
```

**Implementation Example:**
```javascript
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

// Create slot with 24hr auto-expiration
await redis.set(`slot:${id}`, slotData, { ex: 86400 })

// Get slot
const slot = await redis.get(`slot:${id}`)

// Data automatically deleted after 24 hours - no cleanup job needed!
```

**Benefits:**
- ✅ Built-in auto-expiration (no manual cleanup jobs)
- ✅ Simple key-value operations (fast)
- ✅ Perfect for temporary data
- ✅ Serverless-friendly
- ✅ No PII persists beyond TTL

### 7.4 Infrastructure
**Hosting:**
- **Vercel** for full-stack Next.js deployment (includes global CDN)

**Data Storage:**
- **Upstash Redis** (serverless Redis with built-in TTL)
  - Free tier: 256MB storage, 500K commands/month
  - Pay-as-you-go: $0.20 per 100K requests after free tier
  - Global edge locations for low latency
  - No server management required

**Services:**
- Email: SendGrid for confirmation emails
- Payments: Stripe/PayPal for tip processing

**Scalability:**
- Serverless functions auto-scale (Vercel)
- Upstash Redis auto-scales globally
- Rate limiting to prevent abuse (10 links/hour per IP)
- No database replicas needed (Redis is fast and serverless)

### 7.5 Email Templates
**Booking Confirmation (to booker):**
```
Subject: Your meeting is confirmed! [Time] with [Creator]

You've successfully booked a slot!

Meeting Details:
- Date & Time: [Parsed Time in Recipient Timezone]
- With: [Creator Name/Email if provided]
- Note: [Any note from creator]

[Add to Calendar Button - .ics attachment]

---
Scheduled with QuickSlots - Temporary scheduling links
```

**Booking Notification (to creator):**
```
Subject: Someone booked your QuickSlots link!

Good news! Your availability has been booked.

Booking Details:
- Booked by: [Booker Name]
- Email: [Booker Email]
- Selected Time: [Time in Creator Timezone]
- Note: [Booker's note if any]

[Add to Calendar Button - .ics attachment]

---
QuickSlots
```

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Page load time <2 seconds on 3G
- API response time <500ms
- Support 1,000 concurrent users initially
- 99.5% uptime SLA

### 8.2 Security
- HTTPS everywhere
- Rate limiting (10 links/hour per IP)
- Input sanitization (prevent XSS)
- Email validation
- No sensitive data storage (GDPR-friendly)
- **Auto-delete ALL data when link expires** (emails, names, times, notes)
- No data retention beyond session lifetime

### 8.3 Privacy (Zero Data Retention Policy)
- **No user accounts** = no persistent user data
- **No data storage beyond link expiration:**
  - Creator email: Deleted when link expires
  - Booker email: Deleted when link expires
  - Meeting details: Deleted when link expires
  - All PII deleted within 24 hours max
- Only temporary storage for active bookings
- **Data lifecycle:**
  1. Link created → Data stored temporarily
  2. Link expires/booked → Data immediately deleted
  3. No backups or archives of user data
- Clear privacy policy
- Auto-delete old data
- No selling of email addresses
- Cookie consent for ads (GDPR/CCPA)

### 8.4 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader friendly
- High contrast mode support
- Clear focus indicators

### 8.5 SEO
- Server-side rendering (Next.js)
- Semantic HTML
- Meta tags optimized
- Open Graph tags for social sharing
- Schema.org markup
- XML sitemap
- robots.txt
- Target keywords: "temporary scheduling link", "disposable calendar link", "no signup scheduling", etc.

### 8.6 Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 13+)
- Chrome Mobile (Android 8+)

---

## 9. Success Metrics

### 9.1 Primary KPIs
1. **Monthly Active Links:** Links created per month
   - Target: 1,000 (Month 3), 5,000 (Month 6), 20,000 (Month 12)

2. **Booking Conversion Rate:** % of links that result in bookings
   - Target: 40% minimum

3. **Page Views:** Total monthly page views
   - Target: 10,000 (Month 3), 50,000 (Month 6), 200,000 (Month 12)

4. **Ad Revenue:** Monthly revenue from ads
   - Target: $50 (Month 3), $200 (Month 6), $1,000 (Month 12)

### 9.2 Secondary KPIs
- Average time on site (>2 minutes)
- Bounce rate (<60%)
- Return visitor rate (>15%)
- Social shares per link created
- Organic search traffic growth

### 9.3 User Satisfaction
- Link creation success rate (>95%)
- Page load satisfaction (via surveys)
- Net Promoter Score (target: >50)

---

## 10. Out of Scope (v1)

The following features are explicitly **NOT** included in v1 to maintain simplicity and speed to market:

### 10.1 Excluded Features
- ❌ User accounts/authentication
- ❌ Calendar integration (Google Calendar, Outlook)
- ❌ Recurring availability
- ❌ Group scheduling (multiple attendees)
- ❌ Payment collection
- ❌ Video conferencing integration (Zoom, Meet)
- ❌ Customizable booking pages
- ❌ Reminder emails/SMS
- ❌ Team scheduling
- ❌ Analytics dashboard for creators
- ❌ API for third-party developers
- ❌ White-label solution
- ❌ Mobile native apps
- ❌ Buffer times between meetings
- ❌ Meeting types/durations

### 10.2 Rationale
Focus on core value proposition: **instant, temporary scheduling with zero friction**. Additional features can be added based on user feedback and revenue growth.

---

## 11. Future Considerations (Post-v1)

### 11.1 Phase 2 Features (Months 6-12)
1. **Optional accounts:** For users who want to track all their links
2. **Recurring availability:** "Every Tuesday 2-4pm for the next month"
3. **Multiple bookings:** Allow 3+ people to book different slots from one link
4. **Premium tier ($3-5/month):**
   - Extended expiration times (7-30 days)
   - Link analytics (view counts, booking rates)
   - Custom branding
   - Priority support
   - *Note: May or may not include ad-free experience - TBD based on revenue*
5. **Email reminders:** 24hr before meeting reminder
6. **Custom branding:** Add your name/logo to booking page

### 11.2 Phase 3 Features (Year 2+)
1. **Calendar sync:** One-way sync to Google Cal/Outlook (no OAuth during creation)
2. **Video conferencing:** Auto-generate Zoom/Meet links
3. **Team scheduling:** "Book with any of these 3 people"
4. **Payment integration:** Charge for consultations
5. **API access:** Developers can embed QuickSlots
6. **Mobile apps:** Native iOS/Android apps
7. **Slack/Discord bots:** Generate links from chat

### 11.3 Growth Initiatives
1. **Content marketing:** SEO-optimized blog posts about scheduling
2. **Product Hunt launch:** Target front page
3. **Reddit/HN organic sharing:** Focus on niche communities
4. **Partnerships:** Integrate with freelancer platforms
5. **Chrome extension:** Generate links from selected text
6. **Email signature integration:** "Schedule with me: [QuickSlots]"

---

## 12. Design Principles

### 12.1 Core Principles
1. **Speed First:** Every feature should be accessible in <3 clicks
2. **Zero Friction:** No signup, no forms, no delays
3. **Trust Through Simplicity:** Clean design = trustworthy service
4. **Mobile-First:** Most users will access on mobile
5. **Ads Don't Dominate:** Revenue is important but UX comes first

### 12.2 UI/UX Guidelines
- Clean, minimal design (inspired by: Linear, Stripe, Vercel)
- Clear CTAs with high contrast
- Generous white space
- Fast-loading images (WebP format)
- Smooth animations (no janky transitions)
- Clear error messages
- Instant feedback on all actions

---

## 13. Launch Strategy

### 13.1 MVP Timeline
- **Week 1-2:** Core functionality (link creation, booking)
- **Week 3:** Email notifications, .ics generation
- **Week 4:** Polish, testing, ad integration
- **Week 5:** Beta testing with 20-50 users
- **Week 6:** Public launch

### 13.2 Launch Channels
1. **Product Hunt:** Prepare for front page launch
2. **Hacker News:** Show HN post
3. **Reddit:** r/productivity, r/SideProject, relevant subs
4. **Twitter:** Personal network + scheduling hashtags
5. **LinkedIn:** Professional network
6. **Indie Hackers:** Build in public, share journey

### 13.3 Pre-Launch Checklist
- [ ] Domain registered (quickslots.com or alternative)
- [ ] SSL certificate
- [ ] Privacy policy + Terms of Service (emphasize zero data retention)
- [ ] Upstash Redis account setup and tested
- [ ] AdSense account approved
- [ ] Stripe/PayPal tip integration working
- [ ] Email sending working (test all templates with .ics attachments)
- [ ] .ics calendar files work with Google Calendar, Outlook, Apple Calendar
- [ ] **Redis TTL expiration tested** (verify data auto-deletes after 24hrs)
- [ ] Cross-browser testing complete
- [ ] Mobile testing on real devices (especially date picker UX)
- [ ] Timezone testing (different user locations)
- [ ] Load testing (can handle 100 concurrent users)
- [ ] Social media accounts created
- [ ] Press kit / screenshots ready

---

## 14. Risk Assessment

### 14.1 Technical Risks
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Date/time picker UX issues on mobile | Medium | Medium | Extensive mobile testing, use proven libraries |
| Timezone bugs causing double-booking | High | Medium | Thorough timezone testing, clear displays |
| Email delivery failures | Medium | Medium | Use reliable service (SendGrid), monitor delivery rates |
| Spam/abuse of link creation | Medium | High | Rate limiting, CAPTCHA if needed |
| Scaling issues with high traffic | Medium | Low | Cloud infrastructure, monitor performance |

### 14.2 Business Risks
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Low tip conversion rate | Medium | Medium | Optimize tip messaging, show value, perfect timing |
| Low ad revenue | Medium | Medium | Optimize ad placement, maintain high traffic |
| No organic growth | High | Medium | Strong SEO, viral sharing features |
| Competitor copies product | Medium | High | Move fast, build brand, add features quickly |
| AdSense account suspended | High | Low | Follow ad policies strictly, have backup ad networks |
| Privacy regulation changes | Medium | Low | Minimal data collection, auto-delete all data |
| Tip fraud/chargebacks | Low | Low | Use reputable payment processors (Stripe/PayPal) |

---

## 15. Open Questions

1. **Domain name:** Is quickslots.com available? Alternatives: tempslots.com, oneshot.link, disposeslot.com, quickbook.link
2. **Booking confirmation:** Require email verification before confirming booking? (Adds friction)
3. **Creator notification:** Send email immediately on booking or allow opt-out?
4. **Link format:** quickslots.com/abc123 or quickslots.com/s/abc123 or quickslots.com/book/abc123?
5. **Tip payment provider:** Stripe, PayPal, Buy Me a Coffee, or multiple options?

---

## 16. Appendix

### 16.1 Competitive Analysis

| Product | Pros | Cons | Differentiation |
|---------|------|------|-----------------|
| Calendly | Full-featured, reliable | Requires account, monthly fee | QuickSlots: No account, free, temporary |
| Cal.com | Open source, self-host | Still requires setup | QuickSlots: Zero setup, instant |
| Doodle | Good for group polls | Requires multiple steps | QuickSlots: Direct booking, no polls |
| When2Meet | Simple, free | Ugly UI, no automation | QuickSlots: Modern UI, auto-expiry |
| x.ai (Amy) | AI-powered | Expensive, requires email integration | QuickSlots: Simple, predictable, free |

### 16.2 Inspiration Sites
- **10 Minute Mail:** Simplicity, countdown timer
- **TempMail:** Clean UI, instant availability
- **Excalidraw:** Fast, no signup, shareable links
- **Remove.bg:** Single-purpose tool, clear value prop
- **LinkTree:** Simple link creation and sharing

### 16.3 Tech Stack Summary
```
Frontend:
- Next.js 14 (React framework)
- Tailwind CSS (styling)
- Shadcn/ui (component library)
- chrono-node (natural language date parsing)
- Luxon (timezone handling)

Backend:
- Next.js API routes
- @upstash/redis (Redis client)
- Upstash Redis (serverless data storage with TTL)

Infrastructure & Services:
- Vercel (hosting with global CDN)
- Upstash Redis (data storage - free tier: 500K requests/month)
- SendGrid (email)
- Google AdSense (ad monetization)
- Stripe/PayPal (tip/donation processing)

Data Management:
- Redis TTL handles auto-expiration (no cron jobs needed!)
- All data auto-deleted after 24 hours
```

---

## 17. Conclusion

QuickSlots aims to become the go-to solution for temporary, no-hassle scheduling needs. By focusing on extreme simplicity, zero friction, minimal ads, and optional community support through tips, we can build a sustainable, high-traffic service that solves a real problem while respecting user privacy.

The key to success will be:
1. **Lightning-fast execution** - Ship v1 in 4-6 weeks
2. **Zero data retention** - Build trust through privacy (like temp email services)
3. **Viral growth mechanics** - Make sharing effortless
4. **SEO domination** - Own "temporary scheduling" keywords
5. **User trust** - No dark patterns, no spam, no data hoarding
6. **Minimal monetization** - Tasteful ads + voluntary tips (UX first)

**Core Philosophy:** Like "10 Minute Mail" for scheduling - simple, temporary, privacy-focused, and ad-supported without being annoying.

Let's build something simple, useful, and profitable.

---

## 18. Infrastructure Teardown & Shutdown

### 18.1 Overview
In case you need to shut down QuickSlots completely, this section provides a safe, complete teardown process to destroy all infrastructure and stop all costs.

### 18.2 Automated Teardown Script

**File:** `scripts/teardown.sh`

```bash
#!/bin/bash

# QuickSlots Infrastructure Teardown Script
# WARNING: This will DELETE ALL infrastructure and data permanently!

set -e

echo "⚠️  QuickSlots Infrastructure Teardown"
echo "======================================"
echo ""
echo "This script will PERMANENTLY DELETE:"
echo "  - Vercel project and deployments"
echo "  - Upstash Redis database"
echo "  - Domain configuration"
echo "  - All environment variables"
echo "  - All user data (already auto-deleted after 24hrs)"
echo ""
read -p "Are you ABSOLUTELY SURE? Type 'DELETE' to confirm: " confirm

if [ "$confirm" != "DELETE" ]; then
    echo "❌ Teardown cancelled."
    exit 1
fi

echo ""
read -p "Type 'QUICKSLOTS' to proceed: " confirm2

if [ "$confirm2" != "QUICKSLOTS" ]; then
    echo "❌ Teardown cancelled."
    exit 1
fi

echo ""
echo "🚀 Starting teardown process..."
echo ""

# Step 1: Delete Vercel project
echo "1️⃣  Deleting Vercel project..."
vercel remove --yes || echo "⚠️  Vercel project not found or already deleted"
echo "✅ Vercel project deleted"
echo ""

# Step 2: Delete Upstash Redis database
echo "2️⃣  Deleting Upstash Redis database..."
echo "   ⚠️  Manual step required:"
echo "   → Go to: https://console.upstash.com/redis"
echo "   → Delete your QuickSlots database"
read -p "   Press ENTER after completing this step..."
echo "✅ Upstash Redis database marked for deletion"
echo ""

# Step 3: Clean up environment variables
echo "3️⃣  Cleaning up local environment..."
rm -f .env .env.local .env.production || true
echo "✅ Local environment files deleted"
echo ""

# Step 4: Domain cleanup reminder
echo "4️⃣  Domain & DNS cleanup required:"
echo "   → Cancel domain auto-renewal (if applicable)"
echo "   → Remove DNS records pointing to Vercel"
echo "   → Update nameservers if needed"
read -p "   Press ENTER after noting these tasks..."
echo ""

# Step 5: Third-party service cleanup
echo "5️⃣  Third-party service cleanup checklist:"
echo ""
echo "   📧 SendGrid:"
echo "      → Revoke API keys"
echo "      → Delete sender identity"
echo ""
echo "   💳 Stripe/PayPal:"
echo "      → Disable webhook endpoints"
echo "      → Archive/delete API keys"
echo ""
echo "   📊 Google AdSense:"
echo "      → Remove ad units"
echo "      → Remove site from account"
echo ""
read -p "   Press ENTER after completing third-party cleanups..."
echo ""

# Step 6: Verify no lingering costs
echo "6️⃣  Cost verification checklist:"
echo "   ✓ Vercel: Deleted (no charges)"
echo "   ✓ Upstash: Deleted (no charges)"
echo "   ✓ SendGrid: API keys revoked"
echo "   ✓ Stripe/PayPal: Webhooks disabled"
echo "   ✓ Domain: Auto-renewal cancelled (manual)"
echo ""

# Step 7: Data deletion verification
echo "7️⃣  Data deletion verification:"
echo "   ✓ All user data auto-deleted (24hr TTL)"
echo "   ✓ No backups exist (zero retention policy)"
echo "   ✓ Redis data wiped with database deletion"
echo ""

echo "✅ Teardown complete!"
echo ""
echo "📝 Summary:"
echo "   - All infrastructure has been destroyed"
echo "   - All user data has been deleted"
echo "   - No ongoing costs should occur"
echo "   - QuickSlots is now fully shut down"
echo ""
echo "🔒 Recommended: Delete this repository if no longer needed:"
echo "   rm -rf $(pwd)"
echo ""
```

### 18.3 Manual Teardown Checklist

If you prefer manual teardown, follow these steps:

**☑️ Step 1: Vercel Project Deletion**
- Login to [Vercel Dashboard](https://vercel.com/dashboard)
- Navigate to QuickSlots project
- Settings → Delete Project
- Confirm deletion
- **Verify:** No deployments remain

**☑️ Step 2: Upstash Redis Deletion**
- Login to [Upstash Console](https://console.upstash.com/redis)
- Select QuickSlots database
- Delete database
- Confirm deletion
- **Verify:** No databases remain (or back to free tier)

**☑️ Step 3: Domain Cleanup**
- Cancel domain auto-renewal (if applicable)
- Remove DNS A/CNAME records pointing to Vercel
- Update nameservers if migrated to Vercel
- **Verify:** Domain no longer resolves to QuickSlots

**☑️ Step 4: SendGrid Cleanup**
- Revoke API keys in SendGrid dashboard
- Delete sender authentication
- Remove webhook endpoints (if configured)
- **Verify:** No active API keys

**☑️ Step 5: Payment Provider Cleanup**
- **Stripe:** Disable webhook endpoints, archive API keys
- **PayPal:** Revoke app credentials, disable webhooks
- **Verify:** No active integrations

**☑️ Step 6: Google AdSense Cleanup**
- Remove ad units from AdSense dashboard
- Remove quickslots.com from "Sites" list
- **Verify:** No active ad units

**☑️ Step 7: Environment Variables**
- Delete `.env`, `.env.local`, `.env.production` files
- Revoke all API keys stored locally
- **Verify:** No secrets remain in repository

**☑️ Step 8: Final Verification**
- Confirm no user data exists (auto-deleted after 24hrs)
- Check for any lingering charges on all services
- Verify domain no longer accessible
- Confirm all third-party integrations disabled

### 18.4 Cost Verification After Teardown

**Expected Monthly Costs After Teardown:** $0

| Service | Before Teardown | After Teardown |
|---------|----------------|----------------|
| Vercel | $0-20/month | **$0** ✅ |
| Upstash Redis | $0-50/month | **$0** ✅ |
| SendGrid | $0-50/month | **$0** ✅ |
| Domain | $1/month | **Cancel renewal** |
| Stripe/PayPal | $0 | **$0** ✅ |
| Other services | $0 | **$0** ✅ |

**Total:** $0/month (domain renewal cancelled)

### 18.5 Data Deletion Guarantee

After teardown, **ZERO user data persists:**

- ✅ All Redis data deleted with database (TTL ensures it was already gone)
- ✅ No database backups (zero retention policy)
- ✅ No email archives (SendGrid transactional emails)
- ✅ No analytics data stored locally
- ✅ No logs with PII

**Privacy compliance:** All user data automatically deleted within 24 hours of link creation, even before teardown.

### 18.6 Reversal/Restart Process

If you want to restart QuickSlots after teardown:

1. **Recreate Upstash Redis database** (free tier)
2. **Redeploy to Vercel** (from git repository)
3. **Reconnect domain** (if kept)
4. **Re-enable third-party services** (new API keys)
5. **Update environment variables**

**Time to restart:** ~30 minutes (thanks to infrastructure-as-code)

---

**Document Status:** ✅ Ready for Development
**Next Steps:** Review PRD → Approve → Begin technical design → Start development