import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - WhenAvailable",
  description: "WhenAvailable privacy policy. Zero data retention - all data auto-deletes after 24 hours.",
};

export default function PrivacyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last Updated: {currentDate}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-lg text-gray-700 leading-relaxed">
              At WhenAvailable, your privacy is our top priority. This Privacy Policy explains how we collect,
              use, and protect your information when you use our temporary scheduling service.
            </p>
          </section>

          {/* Key Highlight */}
          <section className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-3">
              🔒 Zero Data Retention
            </h2>
            <p className="text-blue-800 text-lg">
              <strong>All data automatically deletes after 24 hours.</strong> We do not store, archive,
              or retain any scheduling information beyond the temporary period needed to facilitate your booking.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 mb-4">
              When you create or book a scheduling link, we temporarily collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Names:</strong> Creator and booker names (optional for creator)</li>
              <li><strong>Email Addresses:</strong> To send booking confirmations</li>
              <li><strong>Time Slots:</strong> Meeting availability and selected time</li>
              <li><strong>Meeting Purpose:</strong> Optional description of the meeting</li>
              <li><strong>Timezone Information:</strong> Detected from your browser</li>
              <li><strong>IP Address:</strong> For rate limiting (10 links per hour per IP)</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">We use collected information solely to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Facilitate scheduling between creators and bookers</li>
              <li>Send email notifications with booking confirmations</li>
              <li>Generate calendar (.ics) files for the meeting</li>
              <li>Prevent abuse through rate limiting</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>We do NOT:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Sell your information to third parties</li>
              <li>Share your information with marketers</li>
              <li>Use your information for advertising targeting</li>
              <li>Create user profiles or track your activity</li>
              <li>Store your data beyond 24 hours</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Data Retention & Auto-Deletion
            </h2>
            <p className="text-gray-700 mb-4">
              WhenAvailable is built with privacy-first principles:
            </p>
            <div className="bg-gray-50 border-l-4 border-blue-500 p-4 mb-4">
              <ul className="space-y-2 text-gray-700">
                <li>✓ <strong>Links expire 24 hours</strong> after creation</li>
                <li>✓ <strong>Links expire 5 minutes</strong> after booking</li>
                <li>✓ <strong>Booking data deletes 24 hours</strong> after creation</li>
                <li>✓ <strong>No backups, no archives, no logs</strong></li>
              </ul>
            </div>
            <p className="text-gray-700">
              This is enforced automatically by our Redis database TTL (Time-To-Live) mechanism.
              We have no ability to retrieve data after it expires.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Third-Party Services
            </h2>
            <p className="text-gray-700 mb-4">
              WhenAvailable uses the following third-party services:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-bold text-gray-900">Upstash Redis</h3>
                <p className="text-gray-700">
                  Temporary data storage with automatic 24-hour deletion. Data is encrypted at rest.
                </p>
              </div>

              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-bold text-gray-900">SendGrid</h3>
                <p className="text-gray-700">
                  Email delivery service. Emails contain booking confirmations only. SendGrid processes
                  emails but does not store recipient information for marketing purposes.
                </p>
              </div>

              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-bold text-gray-900">Stripe</h3>
                <p className="text-gray-700">
                  Payment processing for optional tips/donations. Stripe's privacy policy applies to
                  payment transactions.
                </p>
              </div>

              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-bold text-gray-900">Google AdSense (When Implemented)</h3>
                <p className="text-gray-700">
                  Displays advertisements. Google may use cookies for ad personalization. You can opt
                  out of personalized ads through Google Ad Settings.
                </p>
              </div>

              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-bold text-gray-900">Vercel</h3>
                <p className="text-gray-700">
                  Hosting provider. Vercel may collect analytics data about page visits. See Vercel's
                  privacy policy for details.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Cookies & Tracking
            </h2>
            <p className="text-gray-700 mb-4">
              WhenAvailable uses minimal cookies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Essential Cookies:</strong> Required for site functionality (session management)</li>
              <li><strong>Analytics Cookies:</strong> Basic page visit tracking via Vercel Analytics (optional)</li>
              <li><strong>Advertising Cookies:</strong> Google AdSense cookies for ad display (when implemented)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can disable cookies in your browser settings. Note that disabling essential cookies may
              prevent the service from functioning properly.
            </p>
          </section>

          {/* GDPR & CCPA Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Your Privacy Rights (GDPR & CCPA)
            </h2>
            <p className="text-gray-700 mb-4">
              Under GDPR (European Union) and CCPA (California), you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Access:</strong> Request a copy of your data (within 24hr window)</li>
              <li><strong>Deletion:</strong> Request immediate deletion of your data</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>Note:</strong> Since all data auto-deletes after 24 hours, manual deletion requests
              are rarely necessary. To exercise your rights or request deletion before auto-expiration,
              contact us (see Section 9).
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Data Security
            </h2>
            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>HTTPS encryption for all data transmission</li>
              <li>Encrypted storage in Upstash Redis</li>
              <li>Rate limiting to prevent abuse</li>
              <li>Input validation to prevent XSS and injection attacks</li>
              <li>No long-term data storage (reduces breach risk)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              However, no internet transmission is 100% secure. While we strive to protect your information,
              we cannot guarantee absolute security.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-gray-700">
              WhenAvailable is not intended for children under 13. We do not knowingly collect information
              from children under 13. If you believe a child has provided information to us, please contact
              us immediately.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              For privacy-related questions, data deletion requests, or concerns:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@whenavailable.app<br />
                <strong>Response Time:</strong> Within 48 hours
              </p>
            </div>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-700">
              We may update this Privacy Policy periodically. Changes will be posted on this page with
              an updated "Last Updated" date. Continued use of WhenAvailable after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          {/* Footer */}
          <section className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500 text-center">
              By using WhenAvailable, you agree to this Privacy Policy and our{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
