# SendGrid Email Setup Guide

This guide explains how to set up SendGrid for WhenAvailable email notifications.

## Why SendGrid?

- **Reliable**: Industry-leading email deliverability
- **Free Tier**: 100 emails/day forever (perfect for MVP)
- **Simple API**: Easy integration with Node.js
- **Transactional**: Perfect for booking notifications
- **No credit card**: Free tier doesn't require payment info

Perfect for sending booking confirmations!

---

## Step 1: Create SendGrid Account

1. Go to [https://signup.sendgrid.com](https://signup.sendgrid.com)
2. Sign up with email
3. Verify your email address
4. Complete the onboarding (select "Web App" as use case)

---

## Step 2: Create Sender Identity

**Important:** SendGrid requires you to verify a sender email before sending emails.

### Option A: Single Sender Verification (Easiest for MVP)

1. In SendGrid dashboard, go to **Settings → Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Fill in the form:
   - **From Name:** WhenAvailable
   - **From Email Address:** Your email (e.g., noreply@yourdomain.com or your-email@gmail.com)
   - **Reply To:** Same as from email
   - **Company Address:** Your address
   - **Nickname:** WhenAvailable Sender
4. Click **"Create"**
5. **Check your email** and click the verification link
6. Wait for verification (usually instant)

### Option B: Domain Authentication (For Production)

If you have a custom domain:
1. Go to **Settings → Sender Authentication**
2. Click **"Authenticate Your Domain"**
3. Follow the DNS setup instructions
4. Wait for DNS propagation (24-48 hours)

**For MVP, use Option A (Single Sender)!**

---

## Step 3: Create API Key

1. Go to **Settings → API Keys**
2. Click **"Create API Key"**
3. Enter name: `WhenAvailable Development`
4. Select **"Full Access"** (or "Restricted Access" with Mail Send permission)
5. Click **"Create & View"**
6. **Copy the API key immediately** (you won't see it again!)

---

## Step 4: Add to Environment Variables

1. Open `.env.local` in your project root
2. Add SendGrid credentials:

```bash
SENDGRID_API_KEY=SG.your-api-key-here
SENDGRID_FROM_EMAIL=your-verified-email@example.com
SENDGRID_FROM_NAME=WhenAvailable
```

**Important:** Use the exact email you verified in Step 2!

3. Save the file
4. Restart your dev server: `npm run dev`

---

## Step 5: Test Email Configuration

### Method 1: Using the Test API

1. Start your dev server: `npm run dev`
2. Open terminal and run:

```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

3. Check your inbox for the test email!

### Method 2: Using the Health Check

1. Visit: [http://localhost:3000/api/health](http://localhost:3000/api/health)
2. Check the response:

```json
{
  "status": "ok",
  "services": {
    "email": {
      "configured": true
    }
  }
}
```

If `configured` is `false`, double-check your API key!

---

## Email Templates

WhenAvailable sends two types of emails:

### 1. **Booking Confirmation** (to Booker)
Sent when someone books a time slot.

**Includes:**
- Meeting date and time (in booker's timezone)
- Creator's name and email
- Meeting purpose
- Their note (if provided)

### 2. **Booking Notification** (to Creator)
Sent when someone books your slot.

**Includes:**
- Booker's name and email
- Meeting date and time (in your timezone)
- Booker's note (if provided)
- Meeting purpose

**Both emails are plain text** for simplicity and deliverability.

---

## Usage in Code

### Send Booking Emails
```typescript
import { sendBookingEmails } from '@/lib/email';

const result = await sendBookingEmails({
  slot,      // The slot that was booked
  booking,   // The booking details
});

console.log(result.confirmationSent);  // true/false
console.log(result.notificationSent);  // true/false
```

### Send Test Email
```typescript
import { sendTestEmail } from '@/lib/email';

await sendTestEmail('recipient@example.com');
```

### Validate Email
```typescript
import { isValidEmail, sanitizeEmail } from '@/lib/email';

if (isValidEmail(email)) {
  const clean = sanitizeEmail(email);
  // Use clean email
}
```

---

## Monitoring

### SendGrid Dashboard

Monitor emails in [SendGrid Console](https://app.sendgrid.com):
- **Activity:** See all sent emails
- **Suppressions:** Check bounces/spam reports
- **Statistics:** Delivery rates, open rates
- **Alerts:** Get notified of issues

### Application Logs

Check server logs for email sending:
```
✅ Email sent successfully to user@example.com
```

Or errors:
```
❌ Failed to send email: [error details]
```

---

## Free Tier Limits

**SendGrid Free Tier:**
- 100 emails/day
- Forever free
- No credit card required

**Estimated Usage for WhenAvailable:**
- 2 emails per booking (confirmation + notification)
- 50 bookings/day = 100 emails/day
- **Perfect for MVP!** 🎉

If you exceed 50 bookings/day, you'll need to upgrade:
- **Essentials:** $19.95/month for 40,000 emails/month

---

## Troubleshooting

### "Email not configured"
- Check that `SENDGRID_API_KEY` is set in `.env.local`
- Restart dev server after adding the key
- Verify API key in SendGrid dashboard

### "Unauthorized" or "403 Forbidden"
- API key might be invalid or revoked
- Create a new API key in SendGrid dashboard
- Make sure you copied the entire key (starts with `SG.`)

### "From email is not verified"
- You must verify the sender email first (Step 2)
- Go to Settings → Sender Authentication
- Use the exact email you verified

### Emails going to spam
- Use domain authentication (Step 2, Option B)
- Avoid spam trigger words in subject lines
- Add a physical address to email footer
- Ask recipients to whitelist your sender email

### Emails not arriving
- Check SendGrid Activity feed for delivery status
- Check spam/junk folder
- Verify recipient email is correct
- Check SendGrid Suppressions list

---

## Next Steps

- ✅ SendGrid is configured
- ⏳ Continue to Story 1.5: Basic Routing & Layout
- See [ROADMAP.md](../ROADMAP.md) for full development plan

---

## Future Enhancements (Post-MVP)

Once you have more traffic, consider:

1. **HTML Emails:** Add styled HTML versions
2. **Email Templates:** Use SendGrid dynamic templates
3. **Attachments:** Include .ics calendar files
4. **Transactional Service:** Upgrade to higher tier
5. **Email Analytics:** Track opens and clicks
6. **Batch Sending:** Send multiple emails efficiently

For now, plain text emails work great! 📧

---

**Need help?** Check [SendGrid Docs](https://docs.sendgrid.com) or [create an issue](https://github.com/your-repo/issues).
