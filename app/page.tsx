'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatedProductPreview } from '@/components/animated-product-preview';
import { CreateLinkModal } from '@/components/create-link-modal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-sky-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/90 backdrop-blur-md relative z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-1 group">
              <img src="/logo.svg" alt="WhenAvailable" className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-105 transition-transform" />
              <span className="text-base sm:text-xl lg:text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                WhenAvailable
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              <Link href="/blog" className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors px-2 sm:px-4 py-2 rounded-lg hover:bg-blue-50">
                Blog
              </Link>
              <Link href="/support" className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors px-2 sm:px-4 py-2 rounded-lg hover:bg-blue-50">
                Support
              </Link>
              <a
                href="https://github.com/i4ali/quickslots/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex text-xs sm:text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors px-2 sm:px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                Report an Issue
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 relative z-10">
        {/* Enhanced Header with Value Prop */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
            Share Your Availability<br />Instantly
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
            Create temporary, privacy-first scheduling links in seconds.<br className="hidden sm:block" />
            <span className="font-semibold text-gray-700">No signup required. No data storage.</span>
          </p>

          {/* Get Started CTA */}
          <div className="mt-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl text-base mx-auto"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Animated Product Preview */}
        <div className="mb-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-100/50">
          <AnimatedProductPreview />
        </div>

        {/* Value Propositions */}
        <div className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            Why choose WhenAvailable
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl hover:border-blue-200 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Instant Scheduling</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Create and share links in seconds, no account needed</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl hover:border-indigo-200 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Privacy-First</h3>
              <p className="text-sm text-gray-600 leading-relaxed">No signup, no tracking, no permanent data storage</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl hover:border-purple-200 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-600 to-fuchsia-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Multiple Bookings</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Let multiple people book from the same link</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl hover:border-green-200 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Smart Timezones</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Auto-detect timezones with toggle to switch views</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl hover:border-red-200 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl">✖️</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Easy Cancellations</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Cancel bookings with confirmation emails to both parties</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl hover:border-orange-200 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl">📧</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Auto Confirmations</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Instant email confirmations with calendar invites</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-24">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center mb-16 tracking-tight">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {/* FAQ 0 - What is Temporary Scheduling */}
            <details className="bg-white rounded-xl border-2 border-gray-200 p-7 hover:shadow-lg hover:border-blue-200 transition-all group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between text-lg">
                What is temporary scheduling?
                <span className="text-blue-600 text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="text-gray-600 mt-4 leading-relaxed space-y-3">
                <p>
                  <strong className="text-gray-900">Temporary scheduling</strong> is a privacy-first approach to meeting coordination that uses disposable, time-limited links instead of permanent calendar access. Unlike traditional scheduling tools that require accounts and store your data indefinitely, temporary scheduling software creates links that automatically expire after use.
                </p>
                <p>
                  Perfect for <strong className="text-gray-900">one-time meetings</strong>, job interviews, sales calls, and appointments where you don't want to share your full calendar or create lasting digital footprints. With temporary scheduling, your availability is shared only when needed—no calendar integration required.
                </p>
                <p>
                  <Link href="/temporary-scheduling" className="text-blue-300 underline hover:text-blue-200">
                    Learn more about temporary scheduling →
                  </Link>
                </p>
              </div>
            </details>

            {/* FAQ 1 */}
            <details className="bg-white rounded-xl border-2 border-gray-200 p-7 hover:shadow-lg hover:border-blue-200 transition-all group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between text-lg">
                How long do WhenAvailable scheduling links last?
                <span className="text-blue-600 text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-600 mt-5 leading-relaxed text-base">
                You can choose how long your scheduling links last: 24 hours, 3 days, or 7 days. Scheduling links expire when all bookings are filled or when the time limit is reached, whichever comes first. All data is automatically deleted for maximum privacy.
              </p>
            </details>

            {/* FAQ 2 */}
            <details className="bg-white rounded-xl border-2 border-gray-200 p-7 hover:shadow-lg hover:border-blue-200 transition-all group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between text-lg">
                Do I need to create an account?
                <span className="text-blue-600 text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-600 mt-5 leading-relaxed text-base">
                No! WhenAvailable requires no signup or account creation. Simply enter your email, share your availability, and generate a link instantly.
              </p>
            </details>

            {/* FAQ 3 */}
            <details className="bg-white rounded-xl border-2 border-gray-200 p-7 hover:shadow-lg hover:border-blue-200 transition-all group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between text-lg">
                Is WhenAvailable free?
                <span className="text-blue-600 text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-600 mt-5 leading-relaxed text-base">
                Yes, WhenAvailable is completely free to use. You can create unlimited scheduling links at no cost.
              </p>
            </details>

            {/* FAQ 4 */}
            <details className="bg-white rounded-xl border-2 border-gray-200 p-7 hover:shadow-lg hover:border-blue-200 transition-all group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between text-lg">
                What happens to my data?
                <span className="text-blue-600 text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-600 mt-5 leading-relaxed text-base">
                All data is automatically deleted after your chosen link duration (24 hours to 7 days). We don't store, archive, or retain any information beyond the temporary period needed for booking.
              </p>
            </details>

            {/* FAQ 5 */}
            <details className="bg-white rounded-xl border-2 border-gray-200 p-7 hover:shadow-lg hover:border-blue-200 transition-all group">
              <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between text-lg">
                How do I enter my availability?
                <span className="text-blue-600 text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-600 mt-5 leading-relaxed text-base">
                WhenAvailable uses natural language processing. Simply type times like "tomorrow 2-4pm" or "next Friday at 3pm" and the system automatically understands and converts them.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Create a Scheduling Link",
            "description": "Learn how to share your availability and book meetings using WhenAvailable",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Share Availability",
                "text": "Type when you're free in plain English",
                "position": 1
              },
              {
                "@type": "HowToStep",
                "name": "Share Your Scheduling Link",
                "text": "Send the scheduling link via email, text, or chat",
                "position": 2
              },
              {
                "@type": "HowToStep",
                "name": "Get Confirmed",
                "text": "Both parties receive email confirmation",
                "position": 3
              }
            ]
          })
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How long do WhenAvailable links last?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can choose how long your links last: 24 hours, 3 days, or 7 days. Links expire when all bookings are filled or when the time limit is reached, whichever comes first. All data is automatically deleted for maximum privacy."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need to create an account?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No! WhenAvailable requires no signup or account creation. Simply enter your email, share your availability, and generate a link instantly."
                }
              },
              {
                "@type": "Question",
                "name": "Is WhenAvailable free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, WhenAvailable is completely free to use. You can create unlimited temporary scheduling links at no cost."
                }
              },
              {
                "@type": "Question",
                "name": "What happens to my data?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "All data is automatically deleted after your chosen link duration (24 hours to 7 days). We don't store, archive, or retain any information beyond the temporary period needed for booking."
                }
              },
              {
                "@type": "Question",
                "name": "How do I enter my availability?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "WhenAvailable uses natural language processing. Simply type times like 'tomorrow 2-4pm' or 'next Friday at 3pm' and the system automatically understands and converts them."
                }
              }
            ]
          })
        }}
      />

      {/* Create Link Modal */}
      <CreateLinkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
