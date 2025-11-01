import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - WhenAvailable",
  description: "WhenAvailable terms of service. Free temporary scheduling links with no signup required.",
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last Updated: {currentDate}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to WhenAvailable! These Terms of Service ("Terms") govern your access to and use of
              WhenAvailable' temporary scheduling service. By using WhenAvailable, you agree to these Terms.
            </p>
          </section>

          {/* Acceptance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing or using WhenAvailable, you agree to be bound by these Terms and our{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>.
              If you do not agree to these Terms, do not use the service.
            </p>
            <p className="text-gray-700">
              You must be at least 13 years old to use WhenAvailable. By using the service, you represent
              and warrant that you meet this age requirement.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Service Description
            </h2>
            <p className="text-gray-700 mb-4">
              WhenAvailable provides a free, temporary scheduling service that allows users to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Create temporary scheduling links that expire after 24 hours</li>
              <li>Share availability for quick bookings</li>
              <li>Receive email notifications when bookings are made</li>
              <li>Generate calendar (.ics) files for confirmed meetings</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
              <p className="text-blue-900">
                <strong>Important:</strong> WhenAvailable is a temporary scheduling tool, not a calendar
                management system. All data automatically deletes after 24 hours. We are not responsible
                for missed meetings or lost scheduling information.
              </p>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. User Responsibilities
            </h2>
            <p className="text-gray-700 mb-4">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate email addresses for booking notifications</li>
              <li>Use the service only for legitimate scheduling purposes</li>
              <li>Not create scheduling links for meetings you do not intend to honor</li>
              <li>Respond promptly to booking confirmations received via email</li>
              <li>Save calendar (.ics) files or add meetings to your calendar immediately</li>
              <li>Not rely solely on WhenAvailable for critical scheduling (data expires in 24 hours)</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          {/* Prohibited Uses */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Prohibited Uses
            </h2>
            <p className="text-gray-700 mb-4">You may NOT use WhenAvailable to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Send spam or unsolicited scheduling requests</li>
              <li>Harass, abuse, or harm others</li>
              <li>Violate any laws or regulations</li>
              <li>Impersonate others or provide false information</li>
              <li>Attempt to hack, disrupt, or overload the service</li>
              <li>Bypass rate limits (10 links per hour per IP address)</li>
              <li>Use automated scripts or bots without permission</li>
              <li>Engage in fraudulent or deceptive activities</li>
              <li>Collect or harvest user information</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>Violations may result in immediate termination of access and potential legal action.</strong>
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Intellectual Property
            </h2>
            <p className="text-gray-700 mb-4">
              WhenAvailable and its original content, features, and functionality are owned by WhenAvailable
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700">
              You may not copy, modify, distribute, sell, or reverse engineer any part of the service
              without written permission.
            </p>
          </section>

          {/* Service Availability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Service Availability & Modifications
            </h2>
            <p className="text-gray-700 mb-4">
              WhenAvailable is provided "as is" and "as available." We reserve the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Modify, suspend, or discontinue the service at any time</li>
              <li>Change features, pricing, or terms without notice</li>
              <li>Refuse service to anyone for any reason</li>
              <li>Perform maintenance that may temporarily interrupt service</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We are not liable for any downtime, service interruptions, or data loss.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Disclaimer of Warranties
            </h2>
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
              <p className="text-gray-900 font-bold mb-3">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.
              </p>
              <p className="text-gray-700 mb-2">
                WhenAvailable makes no warranties, expressed or implied, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 text-sm">
                <li>Merchantability or fitness for a particular purpose</li>
                <li>Service will be uninterrupted, secure, or error-free</li>
                <li>Results from using the service will be accurate or reliable</li>
                <li>Data will be preserved beyond 24 hours</li>
                <li>Email notifications will always be delivered</li>
                <li>Third-party services (SendGrid, Upstash, Stripe) will function properly</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Limitation of Liability
            </h2>
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
              <p className="text-gray-900 font-bold mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, QUICKSLOTS SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Missed meetings or scheduling conflicts</li>
                <li>Lost business opportunities or revenue</li>
                <li>Data loss (all data expires after 24 hours)</li>
                <li>Email delivery failures</li>
                <li>Service downtime or interruptions</li>
                <li>Errors, bugs, or inaccuracies in the service</li>
                <li>Third-party service failures</li>
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Our total liability to you for any claims shall not exceed $10 USD.</strong>
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Indemnification
            </h2>
            <p className="text-gray-700">
              You agree to indemnify and hold WhenAvailable harmless from any claims, damages, losses,
              liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-4">
              <li>Your use or misuse of the service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of others</li>
              <li>Information you provide through the service</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Third-Party Services
            </h2>
            <p className="text-gray-700 mb-4">
              WhenAvailable integrates with third-party services (Upstash, SendGrid, Stripe, Google AdSense).
              These services have their own terms and privacy policies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Upstash Redis: Data storage with automatic deletion</li>
              <li>SendGrid: Email delivery service</li>
              <li>Stripe: Payment processing for tips/donations</li>
              <li>Google AdSense: Advertisement display (when implemented)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We are not responsible for the performance, availability, or practices of third-party services.
            </p>
          </section>

          {/* Tips & Donations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Tips & Donations
            </h2>
            <p className="text-gray-700 mb-4">
              WhenAvailable offers an optional tip/donation system powered by Stripe:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Tips are voluntary and non-refundable</li>
              <li>Tips do not unlock features or remove advertisements</li>
              <li>Tips do not create any subscription or ongoing obligation</li>
              <li>Stripe's terms and fees apply to all transactions</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Termination
            </h2>
            <p className="text-gray-700">
              We may terminate or suspend your access to WhenAvailable immediately, without prior notice,
              for any reason, including violation of these Terms. Upon termination, your right to use
              the service will cease immediately.
            </p>
            <p className="text-gray-700 mt-4">
              Since WhenAvailable requires no account or login, termination typically involves IP address
              blocking to prevent further access.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Governing Law & Dispute Resolution
            </h2>
            <p className="text-gray-700 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the United States,
              without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-700">
              Any disputes arising from these Terms or your use of WhenAvailable shall be resolved through
              binding arbitration, except where prohibited by law.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. Changes to Terms
            </h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. Changes will be posted on this page
              with an updated "Last Updated" date. Your continued use of WhenAvailable after changes
              constitutes acceptance of the modified Terms.
            </p>
            <p className="text-gray-700 mt-4">
              We recommend reviewing these Terms periodically for updates.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              15. Severability
            </h2>
            <p className="text-gray-700">
              If any provision of these Terms is found to be unenforceable or invalid, that provision
              will be limited or eliminated to the minimum extent necessary, and the remaining provisions
              will remain in full force and effect.
            </p>
          </section>

          {/* Entire Agreement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              16. Entire Agreement
            </h2>
            <p className="text-gray-700">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you
              and WhenAvailable regarding the service, and supersede all prior agreements and understandings.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              17. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              For questions about these Terms:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@quickslots.app<br />
                <strong>Response Time:</strong> Within 48 hours
              </p>
            </div>
          </section>

          {/* Footer */}
          <section className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500 text-center">
              By using WhenAvailable, you acknowledge that you have read, understood, and agree to be bound by
              these Terms of Service and our{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </section>
        </div>
      </div>
      </div>
    </main>
  );
}
