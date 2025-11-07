# Implementation Plan: Professional Features for WhenAvailable

**Date:** November 7, 2025
**Features:** Video Conferencing (Zoom + Custom Links), Rescheduling & Auto-Timezone Detection

---

## Overview

This document outlines the implementation plan for three critical professional features that will significantly improve user adoption and competitiveness:

1. **Video Conferencing Integration** - Zoom + Custom video links
2. **Invitee Self-Service Rescheduling** - Allow invitees to reschedule/cancel
3. **Automatic Timezone Detection** - Auto-detect and display in local timezone

**Estimated Timeline:** 7-10 days of development

---

## Feature 1: Video Conferencing Integration

### Goal
Enable users to automatically attach video meeting links (Zoom or custom) to their scheduling links.

### Implementation Details

#### Zoom Integration

**Authentication Flow:**
- Use Zoom OAuth 2.0 for user authentication
- Redirect flow: App → Zoom Login → Zoom Authorization → Callback → Token Storage
- Store encrypted access tokens and refresh tokens in Redis
- Automatically refresh tokens when expired

**API Integration:**
- Use Zoom API v2 to create instant meetings
- Endpoint: `POST https://api.zoom.us/v2/users/me/meetings`
- Generate meeting with:
  - Auto-generated password
  - Waiting room enabled
  - Join before host enabled
  - Meeting duration based on slot time

**Storage:**
- Store Zoom credentials per "session" (temporary, no permanent user accounts)
- Associate Zoom userId with slot creation session
- Encrypt tokens using `crypto` module with `TOKEN_ENCRYPTION_KEY`

#### Custom Link Support

**Simple Implementation:**
- Text input field for any video conferencing URL
- Support Google Meet, Microsoft Teams, or any other platform
- URL validation (must be valid https:// URL)
- Optional label field: "Google Meet", "Microsoft Teams", etc.

### UI Changes

**CreateLinkModal Updates:**

Add new section after "Scheduling Link Settings":

```tsx
{/* Meeting Location Section */}
<div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
  <div className="flex items-center gap-2 mb-4">
    <span className="text-lg">📍</span>
    <h3 className="text-sm font-semibold text-gray-900">Meeting Location</h3>
  </div>

  <div className="space-y-3">
    {/* Radio options */}
    <label className="flex items-center gap-3 cursor-pointer">
      <input type="radio" name="location" value="phone" />
      <span>📞 Phone call</span>
    </label>

    <label className="flex items-center gap-3 cursor-pointer">
      <input type="radio" name="location" value="in-person" />
      <span>📍 In-person meeting</span>
    </label>

    <label className="flex items-center gap-3 cursor-pointer">
      <input type="radio" name="location" value="zoom" />
      <span>🎥 Zoom (auto-generate)</span>
      {!isZoomConnected && (
        <button className="text-xs text-blue-600">Connect Zoom</button>
      )}
    </label>

    <label className="flex items-center gap-3 cursor-pointer">
      <input type="radio" name="location" value="custom" />
      <span>🔗 Custom video link</span>
    </label>
  </div>

  {/* Conditional inputs based on selection */}
  {locationType === 'phone' && (
    <input type="tel" placeholder="Phone number" />
  )}

  {locationType === 'in-person' && (
    <textarea placeholder="Address or location details" />
  )}

  {locationType === 'custom' && (
    <>
      <input type="url" placeholder="https://meet.google.com/..." />
      <input type="text" placeholder="Label (e.g., Google Meet)" />
    </>
  )}
</div>
```

### Database Schema Changes

**Update `types/slot.ts`:**

```typescript
interface Slot {
  // ... existing fields
  meetingLocation?: {
    type: 'phone' | 'in-person' | 'zoom' | 'custom';
    details: {
      // For phone
      phoneNumber?: string;

      // For in-person
      address?: string;

      // For zoom
      joinUrl?: string;
      meetingId?: string;
      password?: string;
      dialInNumbers?: string[];

      // For custom link
      customLink?: string;
      customLinkLabel?: string;
    };
  };
  zoomUserId?: string; // Reference to Zoom user who created meeting
}

// New interface for Zoom credentials
interface ZoomToken {
  userId: string; // Unique identifier
  accessToken: string; // Encrypted
  refreshToken: string; // Encrypted
  expiresAt: number;
  email: string;
}
```

### API Endpoints

**New endpoints to create:**

1. **`GET /api/integrations/zoom/auth`**
   - Initiates Zoom OAuth flow
   - Redirects to Zoom authorization page
   - Returns: Redirect to Zoom

2. **`GET /api/integrations/zoom/callback`**
   - Handles OAuth callback from Zoom
   - Exchanges code for access token
   - Stores encrypted tokens
   - Returns: Redirect back to app with success/error

3. **`POST /api/integrations/zoom/create-meeting`**
   - Creates a Zoom meeting
   - Body: `{ startTime: string, duration: number, topic: string }`
   - Returns: Meeting details (join URL, meeting ID, password)

4. **`GET /api/integrations/zoom/status`**
   - Checks if current session has Zoom connected
   - Returns: `{ connected: boolean, email?: string }`

### Email Template Updates

**Confirmation email should include:**

For Zoom meetings:
```html
<div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
  <h3>📹 Join Video Meeting</h3>
  <a href="{{zoomJoinUrl}}" style="...">Join Zoom Meeting</a>
  <p><strong>Meeting ID:</strong> {{meetingId}}</p>
  <p><strong>Password:</strong> {{password}}</p>
</div>
```

For custom links:
```html
<div style="background: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
  <h3>📹 Join Video Meeting</h3>
  <a href="{{customLink}}" style="...">Join {{customLinkLabel || 'Meeting'}}</a>
</div>
```

### Environment Variables Needed

```env
# Zoom OAuth
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_REDIRECT_URI=https://whenavailable.app/api/integrations/zoom/callback

# Token Encryption
TOKEN_ENCRYPTION_KEY=random_32_character_secret_key
```

### Security Considerations

- Encrypt OAuth tokens using AES-256 before storing
- Never expose Zoom API credentials to frontend
- Validate all video links to prevent XSS
- Rate limit Zoom API calls
- Handle token refresh gracefully
- Clear tokens when slot expires

---

## Feature 2: Invitee Self-Service Rescheduling

### Goal
Allow invitees to reschedule or cancel their bookings without contacting the organizer.

### Implementation Details

#### Core Functionality

**Reschedule Flow:**
1. User receives confirmation email with "Reschedule" link
2. Link goes to `/reschedule/[bookingId]` page
3. Page shows original booking details + available time slots
4. User selects new time slot
5. System updates booking
6. Both parties receive updated confirmation emails

**Cancel Flow:**
1. User clicks "Cancel Appointment" link in email
2. Link goes to `/reschedule/[bookingId]?action=cancel`
3. Confirmation dialog: "Are you sure?"
4. System marks booking as cancelled
5. Decrements booking count
6. Both parties receive cancellation emails

#### Business Rules

- Maximum 3 reschedules per booking (prevent abuse)
- Cannot reschedule expired bookings
- Cannot reschedule if slot is fully booked (individual mode)
- Keep same video meeting link (don't regenerate)
- Reschedule must be within original slot's expiration window
- Cancellation frees up the slot for others (individual mode)

### UI Components

**New Page: `app/reschedule/[bookingId]/page.tsx`**

```tsx
export default function ReschedulePage({ params }) {
  // Fetch booking details
  // Show original booking info
  // Display available time slots
  // Allow selection of new time
  // Show reschedule/cancel buttons
}
```

**Components to create:**

1. `RescheduleConfirmation.tsx` - Show current booking details
2. `AvailableSlotsPicker.tsx` - Reuse from booking page
3. `CancelDialog.tsx` - Confirmation modal for cancellation

### Database Schema Changes

**Update `types/slot.ts`:**

```typescript
interface Booking {
  id: string; // NEW: Unique booking ID (nanoid)
  slotId: string;
  bookedAt: number;
  bookerName: string;
  bookerEmail: string;
  bookerNote?: string;
  selectedTime: string;
  selectedTimeSlotIndex: number;
  timezone: string;

  // NEW fields for rescheduling
  rescheduleCount: number; // Default: 0, max: 3
  rescheduledAt?: number; // Last reschedule timestamp
  cancelledAt?: number; // If cancelled, timestamp
  originalSelectedTime?: string; // Original time before first reschedule
}
```

### API Endpoints

**New endpoints to create:**

1. **`GET /api/bookings/[bookingId]`**
   - Fetches booking details for reschedule page
   - Validates booking exists and not expired
   - Returns: Booking object + parent slot info

2. **`PUT /api/bookings/[bookingId]/reschedule`**
   - Updates booking to new time slot
   - Body: `{ newTimeSlotIndex: number, newSelectedTime: string }`
   - Validates: booking exists, not expired, under reschedule limit
   - Updates: booking time, reschedule count, timestamp
   - Sends: Updated emails to both parties
   - Returns: `{ success: boolean, booking: Booking }`

3. **`DELETE /api/bookings/[bookingId]/cancel`**
   - Cancels booking
   - Validates: booking exists and not already cancelled
   - Updates: marks cancelled, decrements slot booking count
   - Sends: Cancellation emails to both parties
   - Returns: `{ success: boolean, message: string }`

### Email Template Updates

**Add to confirmation emails:**

```html
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
  <p style="color: #6b7280; font-size: 14px;">
    Need to change your appointment?
  </p>
  <div style="display: flex; gap: 10px; margin-top: 10px;">
    <a href="{{rescheduleUrl}}" style="...">Reschedule</a>
    <a href="{{cancelUrl}}" style="...">Cancel</a>
  </div>
</div>
```

**New email templates:**

1. `booking-rescheduled.html` - Sent when booking is rescheduled
2. `booking-cancelled.html` - Sent when booking is cancelled

### Logic Considerations

**Booking Count Management:**
- When rescheduling: Don't change count (same person, same slot)
- When cancelling: Decrement count, free up slot
- In individual mode: Make old time slot available again

**Video Meeting Links:**
- Keep same Zoom/custom link after reschedule
- Don't regenerate meetings (wastes API calls)
- Update meeting time in Zoom if possible (future enhancement)

---

## Feature 3: Automatic Timezone Detection

### Goal
Automatically detect user's timezone and display all times in their local timezone.

### Implementation Details

#### Timezone Detection

**Browser API:**
```javascript
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// Returns: "America/New_York", "Europe/London", etc.
```

**Implementation Points:**
1. **CreateLinkModal** - Auto-detect and pre-fill timezone selector
2. **Booking Page** - Auto-detect invitee timezone
3. **All Time Displays** - Convert and show in user's timezone
4. **Emails** - Show times in both creator and invitee timezones

#### UI/UX Enhancements

**Timezone Display Banner:**
```tsx
<div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
  <p className="text-sm text-blue-900">
    🌍 Times shown in your timezone: <strong>{userTimezone}</strong>
    <button onClick={toggleTimezone}>View in creator's timezone</button>
  </p>
</div>
```

**Dual Timezone Display:**
```tsx
<p className="text-gray-900 font-semibold">
  2:00 PM <span className="text-gray-500">(your time)</span>
</p>
<p className="text-sm text-gray-500">
  5:00 PM EST <span>(creator's time)</span>
</p>
```

### Database Schema Changes

**Update `types/slot.ts`:**

```typescript
interface Booking {
  // ... existing fields
  timezone: string; // Invitee's timezone (already exists)
  detectedTimezone?: string; // Auto-detected timezone for verification
}
```

### Implementation Steps

1. **Create `lib/timezone-utils.ts`:**
   ```typescript
   export function detectTimezone(): string {
     return Intl.DateTimeFormat().resolvedOptions().timeZone;
   }

   export function formatTimeInTimezone(
     date: Date,
     timezone: string,
     format: string
   ): string {
     // Use date-fns-tz
   }

   export function convertTimeBetweenTimezones(
     time: string,
     fromTz: string,
     toTz: string
   ): string {
     // Conversion logic
   }
   ```

2. **Update CreateLinkModal:**
   - Auto-detect timezone on component mount
   - Pre-fill TimezoneSelector with detected timezone
   - Allow manual override

3. **Update Booking Page:**
   - Auto-detect invitee timezone
   - Show all times in invitee's timezone by default
   - Display toggle to switch between timezones
   - Store detected timezone with booking

4. **Update Email Templates:**
   - Show time in invitee's timezone (primary)
   - Show time in creator's timezone (secondary)
   - Example: "2:00 PM PST (5:00 PM EST)"

### UI Components

**New components to create:**

1. `TimezoneDetector.tsx` - Auto-detects and displays current timezone
2. `DualTimezoneDisplay.tsx` - Shows time in two timezones
3. `TimezoneToggle.tsx` - Toggle between creator/invitee timezone view

### Testing Considerations

- Test across different browsers (Chrome, Firefox, Safari)
- Test with users in different timezones
- Verify daylight saving time handling
- Test timezone display in emails
- Verify calendar invite timezones are correct

---

## Dependencies

### New NPM Packages

```json
{
  "dependencies": {
    // Already installed:
    "date-fns": "^4.1.0",
    "date-fns-tz": "^3.2.0",

    // May need to add:
    "node-fetch": "^3.x" // For Zoom API calls (if not already present)
  }
}
```

---

## Environment Variables Summary

Add to `.env.local`:

```env
# Zoom OAuth
ZOOM_CLIENT_ID=your_zoom_client_id_here
ZOOM_CLIENT_SECRET=your_zoom_client_secret_here
ZOOM_REDIRECT_URI=http://localhost:3000/api/integrations/zoom/callback

# Production
# ZOOM_REDIRECT_URI=https://whenavailable.app/api/integrations/zoom/callback

# Token Encryption
TOKEN_ENCRYPTION_KEY=generate_random_32_character_string
```

**To generate TOKEN_ENCRYPTION_KEY:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Testing Checklist

### Video Conferencing
- [ ] Zoom OAuth flow works end-to-end
- [ ] Zoom access tokens are encrypted in Redis
- [ ] Zoom meetings generate successfully with correct settings
- [ ] Meeting links work and are accessible
- [ ] Custom video links accept valid URLs
- [ ] Custom links reject invalid formats
- [ ] Meeting details appear correctly in emails
- [ ] Calendar invites (.ics) include meeting links
- [ ] Zoom tokens refresh automatically when expired
- [ ] Zoom disconnection works properly

### Rescheduling
- [ ] Reschedule link works from email
- [ ] Booking page shows correct original details
- [ ] Available slots display correctly
- [ ] Booking updates successfully in Redis
- [ ] Both parties receive updated confirmation emails
- [ ] Booking count updates properly (or doesn't change)
- [ ] Cannot reschedule expired bookings
- [ ] Cannot reschedule more than 3 times
- [ ] Video meeting link persists after reschedule
- [ ] Cancel flow works end-to-end
- [ ] Cancelled bookings decrement count
- [ ] Cancelled slots become available (individual mode)

### Timezone
- [ ] Auto-detection works in Chrome
- [ ] Auto-detection works in Firefox
- [ ] Auto-detection works in Safari
- [ ] Times display correctly in different timezones
- [ ] Email times show both creator and invitee timezones
- [ ] Calendar invites have correct timezone data
- [ ] Manual timezone override works
- [ ] Timezone toggle switches views correctly
- [ ] Daylight saving time handled correctly

---

## Implementation Timeline

### Week 1 (Days 1-5)

**Days 1-2: Video Conferencing**
- Set up Zoom OAuth flow
- Create integration API endpoints
- Build Zoom meeting creation logic
- Implement custom link input
- Update UI in CreateLinkModal

**Days 3-4: Rescheduling**
- Create reschedule page and API endpoints
- Implement reschedule logic
- Add cancel functionality
- Update email templates
- Test booking count management

**Day 5: Auto-Timezone**
- Implement timezone detection
- Create timezone utility functions
- Update UI components
- Test across timezones

### Week 2 (Days 6-7)

**Days 6-7: Testing & Refinement**
- End-to-end testing of all features
- Bug fixes
- Email template refinement
- Documentation updates
- Deploy to production

---

## Success Metrics

After implementation, track:

1. **Video Conferencing Adoption**
   - % of scheduling links that include video conferencing
   - Most popular meeting type (Zoom vs custom)

2. **Rescheduling Usage**
   - % of bookings that get rescheduled
   - % of bookings that get cancelled
   - Average reschedule count per booking

3. **User Feedback**
   - Support tickets related to timezone confusion (should decrease)
   - User satisfaction with new features

4. **Overall Impact**
   - Increase in new users
   - Increase in repeat usage
   - Reduction in support requests

---

## Future Enhancements

Features to consider after initial release:

1. **SMS Reminders** - Send SMS reminders before meetings
2. **Google Meet Native Integration** - OAuth for real Google Meet links
3. **Microsoft Teams Integration** - Native Teams meeting generation
4. **Calendar Sync** - Read Google Calendar availability
5. **Buffer Time** - Add buffer between meetings
6. **Meeting Duration Presets** - Quick-select 15/30/60 min options
7. **Update Zoom Meeting Time** - Sync time changes to Zoom API
8. **Recurring Meetings** - Support weekly/monthly schedules

---

## Notes

- Maintain "no signup required" philosophy - Zoom integration is optional
- Keep privacy-first approach - Only store what's necessary
- Ensure mobile responsiveness for all new UI
- Test email templates in major email clients
- Monitor Zoom API rate limits
- Consider adding feature flags for gradual rollout

---

**Document Version:** 1.0
**Last Updated:** November 7, 2025
**Status:** Ready for Implementation
