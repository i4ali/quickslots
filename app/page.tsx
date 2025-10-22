'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SlotManager } from '@/components/slot-manager';
import { TimeSlot } from '@/components/availability-input';
import { TimezoneSelector } from '@/components/timezone-selector';
import { isValidEmail, getEmailError, getNameError, getPurposeError } from '@/lib/validation';
import { getUserTimezone } from '@/lib/timezone';
import { convertToApiTimeSlots } from '@/lib/slot-utils';
import { CreateSlotResponse } from '@/types/slot';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [timezone, setTimezone] = useState(() => getUserTimezone());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ name: false, email: false, purpose: false });

  // Validation
  const emailError = touched.email ? getEmailError(email) : null;
  const nameError = touched.name ? getNameError(name) : null;
  const purposeError = touched.purpose ? getPurposeError(purpose) : null;

  const canGenerateLink = isValidEmail(email) && slots.length > 0 && !nameError && !purposeError;

  const handleGenerateLink = async () => {
    // Mark all fields as touched to show errors
    setTouched({ name: true, email: true, purpose: true });
    setError(null);

    // Validate
    if (!canGenerateLink) {
      setError('Please fix the errors above before generating a link');
      return;
    }

    setIsLoading(true);

    try {
      // Convert frontend TimeSlots to API format
      const apiTimeSlots = convertToApiTimeSlots(slots);

      // Call API
      const response = await fetch('/api/slots/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorName: name.trim() || undefined,
          creatorEmail: email.trim(),
          meetingPurpose: purpose.trim() || undefined,
          timeSlots: apiTimeSlots,
          timezone,
        }),
      });

      const data: CreateSlotResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as any).error || 'Failed to create link');
      }

      if (data.success) {
        // Success! Navigate to confirmation page
        console.log('Link created successfully:', data);
        router.push(`/created/${data.slotId}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate link. Please try again.';
      setError(errorMessage);
      console.error('Error generating link:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm relative z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src="/logo-256.png" alt="WhenAvailable" className="w-10 h-10" />
              <span className="text-2xl font-bold text-gray-900">
                WhenAvailable
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Share Your Availability<br />Instantly
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create temporary scheduling links in seconds. No signup required. Perfect for one-time meetings.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 sm:p-10 mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/30 rounded-2xl pointer-events-none"></div>
          <div className="relative z-10">
          <div className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600 font-medium">
                  ⚠️ {error}
                </p>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sarah Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400 ${
                    nameError
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                />
                {nameError && (
                  <p className="text-xs text-red-600 mt-1">{nameError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400 ${
                    emailError
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                />
                {emailError && (
                  <p className="text-xs text-red-600 mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Purpose (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Coffee chat"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  onBlur={() => setTouched({ ...touched, purpose: true })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400 ${
                    purposeError
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                />
                {purposeError && (
                  <p className="text-xs text-red-600 mt-1">{purposeError}</p>
                )}
              </div>

              {/* Timezone Selector */}
              <TimezoneSelector value={timezone} onChange={setTimezone} />

              {/* Slot Manager Component */}
              <SlotManager onSlotsChange={setSlots} />
            </div>

            {/* CTA Button */}
            <button
              onClick={handleGenerateLink}
              disabled={!canGenerateLink || isLoading}
              className={`w-full py-4 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-base ${
                canGenerateLink && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating your link...
                </>
              ) : canGenerateLink ? (
                'Create Your Link'
              ) : (
                'Enter email and availability to continue'
              )}
            </button>
          </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
            Why teams love WhenAvailable
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Instant Scheduling</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Create and share links in seconds, no account needed</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Privacy-First</h3>
              <p className="text-sm text-gray-600 leading-relaxed">No signup, no tracking, no permanent data storage</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Temporary Links</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Links expire after booking or 24 hours</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🗑️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Zero Retention</h3>
              <p className="text-sm text-gray-600 leading-relaxed">All data automatically deleted after use</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-8 sm:p-12 mb-20 shadow-lg border border-blue-100/50">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5" aria-label="Step 1">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Share availability</h3>
              <p className="text-gray-600 leading-relaxed">
                Type when you're free using plain English
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5" aria-label="Step 2">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Share your link</h3>
              <p className="text-gray-600 leading-relaxed">
                Send via email, text, or any messaging app
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5" aria-label="Step 3">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Get confirmed</h3>
              <p className="text-gray-600 leading-relaxed">
                Both parties receive email confirmations with calendar invites
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {/* FAQ 0 - What is Temporary Scheduling */}
            <details className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                What is temporary scheduling?
                <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
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
            <details className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                How long do WhenAvailable links last?
                <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Links expire after 24 hours or immediately after booking, whichever comes first. All data is automatically deleted for maximum privacy.
              </p>
            </details>

            {/* FAQ 2 */}
            <details className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                Do I need to create an account?
                <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                No! WhenAvailable requires no signup or account creation. Simply enter your email, share your availability, and generate a link instantly.
              </p>
            </details>

            {/* FAQ 3 */}
            <details className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                Is WhenAvailable free?
                <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Yes, WhenAvailable is completely free to use. You can create unlimited temporary scheduling links at no cost.
              </p>
            </details>

            {/* FAQ 4 */}
            <details className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                What happens to my data?
                <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
                All data is automatically deleted after 24 hours. We don't store, archive, or retain any information beyond the temporary period needed for booking.
              </p>
            </details>

            {/* FAQ 5 */}
            <details className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all group">
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                How do I enter my availability?
                <span className="text-blue-600 text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">
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
            "name": "How to Create a Temporary Scheduling Link",
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
                "name": "Share Your Link",
                "text": "Send the link via email, text, or chat",
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
                  "text": "Links expire after 24 hours or immediately after booking, whichever comes first. All data is automatically deleted for maximum privacy."
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
                  "text": "All data is automatically deleted after 24 hours. We don't store, archive, or retain any information beyond the temporary period needed for booking."
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
    </main>
  );
}
