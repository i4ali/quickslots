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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            ⚡ QuickSlots
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-2">
            Temporary Scheduling Links - Share Your Availability in Seconds
          </p>
          <p className="text-gray-400">
            No signup. Perfect for temporary scheduling. Links expire after booking.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-slate-600 p-8 mb-12">
          <div className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-4">
                <p className="text-sm text-red-400 font-medium">
                  ⚠️ {error}
                </p>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sarah Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-slate-900/70 text-gray-100 placeholder-gray-400 ${
                    nameError
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                  }`}
                />
                {nameError && (
                  <p className="text-xs text-red-400 mt-1">{nameError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Your Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-slate-900/70 text-gray-100 placeholder-gray-400 ${
                    emailError
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                  }`}
                />
                {emailError && (
                  <p className="text-xs text-red-400 mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Meeting Purpose (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Coffee chat"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  onBlur={() => setTouched({ ...touched, purpose: true })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-slate-900/70 text-gray-100 placeholder-gray-400 ${
                    purposeError
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30'
                  }`}
                />
                {purposeError && (
                  <p className="text-xs text-red-400 mt-1">{purposeError}</p>
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
              className={`w-full py-4 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                canGenerateLink && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
                  Generating Link...
                </>
              ) : canGenerateLink ? (
                'Generate Link'
              ) : (
                'Add email and availability to continue'
              )}
            </button>
          </div>
        </div>

        {/* What is Temporary Scheduling Section */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border-2 border-slate-600 p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-100 mb-6">
            What is Temporary Scheduling?
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              <strong className="text-white">Temporary scheduling</strong> is a privacy-first approach to meeting coordination that uses disposable, time-limited links instead of permanent calendar access. Unlike traditional scheduling tools that require accounts and store your data indefinitely, temporary scheduling software creates links that automatically expire after use.
            </p>
            <p>
              Perfect for <strong className="text-white">one-time meetings</strong>, job interviews, sales calls, and appointments where you don't want to share your full calendar or create lasting digital footprints. With temporary scheduling, your availability is shared only when needed—no calendar integration required.
            </p>
            <p>
              <strong className="text-white">Why use temporary scheduling tools?</strong> They're ideal when you need to schedule quickly without the overhead of creating accounts, managing recurring availability, or worrying about data privacy. Simply share your open time slots for that specific meeting, and the link disappears after booking or within 24 hours.
            </p>
            <p className="text-blue-300">
              <Link href="/temporary-scheduling" className="underline hover:text-blue-200">
                Learn more about temporary scheduling →
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <h2 className="text-3xl font-bold text-gray-100 text-center mb-8">
          Why Choose QuickSlots?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-slate-800/40 backdrop-blur-sm rounded-lg border-2 border-slate-600 hover:border-blue-500 transition-all">
            <div className="text-3xl mb-2" aria-hidden="true">⚡</div>
            <h3 className="font-semibold text-gray-100 mb-1 text-lg">Instant Scheduling</h3>
            <p className="text-sm text-gray-400">Create links in seconds</p>
          </div>

          <div className="text-center p-6 bg-slate-800/40 backdrop-blur-sm rounded-lg border-2 border-slate-600 hover:border-blue-500 transition-all">
            <div className="text-3xl mb-2" aria-hidden="true">🔒</div>
            <h3 className="font-semibold text-gray-100 mb-1 text-lg">Privacy-First</h3>
            <p className="text-sm text-gray-400">No signup required</p>
          </div>

          <div className="text-center p-6 bg-slate-800/40 backdrop-blur-sm rounded-lg border-2 border-slate-600 hover:border-blue-500 transition-all">
            <div className="text-3xl mb-2" aria-hidden="true">⏰</div>
            <h3 className="font-semibold text-gray-100 mb-1 text-lg">Temporary Links</h3>
            <p className="text-sm text-gray-400">Expires after 24 hours</p>
          </div>

          <div className="text-center p-6 bg-slate-800/40 backdrop-blur-sm rounded-lg border-2 border-slate-600 hover:border-blue-500 transition-all">
            <div className="text-3xl mb-2" aria-hidden="true">🗑️</div>
            <h3 className="font-semibold text-gray-100 mb-1 text-lg">Zero Data Retention</h3>
            <p className="text-sm text-gray-400">Auto-deleted forever</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border-2 border-slate-600 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-100 text-center mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-blue-500/30" aria-label="Step 1">
                1
              </div>
              <h3 className="font-semibold text-gray-100 mb-2 text-lg">Share Availability</h3>
              <p className="text-sm text-gray-400">
                Type when you're free in plain English
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-blue-500/30" aria-label="Step 2">
                2
              </div>
              <h3 className="font-semibold text-gray-100 mb-2 text-lg">Share Your Link</h3>
              <p className="text-sm text-gray-400">
                Send the link via email, text, or chat
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border border-blue-500/30" aria-label="Step 3">
                3
              </div>
              <h3 className="font-semibold text-gray-100 mb-2 text-lg">Get Confirmed</h3>
              <p className="text-sm text-gray-400">
                Both parties receive email confirmation
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border-2 border-slate-600 p-8">
          <h2 className="text-2xl font-bold text-gray-100 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {/* FAQ 1 */}
            <details className="bg-slate-900/50 rounded-lg border border-slate-700 p-5 hover:border-blue-500/50 transition-colors">
              <summary className="font-semibold text-gray-100 cursor-pointer list-none flex items-center justify-between">
                How long do QuickSlots links last?
                <span className="text-blue-400 text-xl">+</span>
              </summary>
              <p className="text-gray-300 mt-4 leading-relaxed">
                Links expire after 24 hours or immediately after booking, whichever comes first. All data is automatically deleted for maximum privacy.
              </p>
            </details>

            {/* FAQ 2 */}
            <details className="bg-slate-900/50 rounded-lg border border-slate-700 p-5 hover:border-blue-500/50 transition-colors">
              <summary className="font-semibold text-gray-100 cursor-pointer list-none flex items-center justify-between">
                Do I need to create an account?
                <span className="text-blue-400 text-xl">+</span>
              </summary>
              <p className="text-gray-300 mt-4 leading-relaxed">
                No! QuickSlots requires no signup or account creation. Simply enter your email, share your availability, and generate a link instantly.
              </p>
            </details>

            {/* FAQ 3 */}
            <details className="bg-slate-900/50 rounded-lg border border-slate-700 p-5 hover:border-blue-500/50 transition-colors">
              <summary className="font-semibold text-gray-100 cursor-pointer list-none flex items-center justify-between">
                Is QuickSlots free?
                <span className="text-blue-400 text-xl">+</span>
              </summary>
              <p className="text-gray-300 mt-4 leading-relaxed">
                Yes, QuickSlots is completely free to use. You can create unlimited temporary scheduling links at no cost.
              </p>
            </details>

            {/* FAQ 4 */}
            <details className="bg-slate-900/50 rounded-lg border border-slate-700 p-5 hover:border-blue-500/50 transition-colors">
              <summary className="font-semibold text-gray-100 cursor-pointer list-none flex items-center justify-between">
                What happens to my data?
                <span className="text-blue-400 text-xl">+</span>
              </summary>
              <p className="text-gray-300 mt-4 leading-relaxed">
                All data is automatically deleted after 24 hours. We don't store, archive, or retain any information beyond the temporary period needed for booking.
              </p>
            </details>

            {/* FAQ 5 */}
            <details className="bg-slate-900/50 rounded-lg border border-slate-700 p-5 hover:border-blue-500/50 transition-colors">
              <summary className="font-semibold text-gray-100 cursor-pointer list-none flex items-center justify-between">
                How do I enter my availability?
                <span className="text-blue-400 text-xl">+</span>
              </summary>
              <p className="text-gray-300 mt-4 leading-relaxed">
                QuickSlots uses natural language processing. Simply type times like "tomorrow 2-4pm" or "next Friday at 3pm" and the system automatically understands and converts them.
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
            "description": "Learn how to share your availability and book meetings using QuickSlots",
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
                "name": "How long do QuickSlots links last?",
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
                  "text": "No! QuickSlots requires no signup or account creation. Simply enter your email, share your availability, and generate a link instantly."
                }
              },
              {
                "@type": "Question",
                "name": "Is QuickSlots free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, QuickSlots is completely free to use. You can create unlimited temporary scheduling links at no cost."
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
                  "text": "QuickSlots uses natural language processing. Simply type times like 'tomorrow 2-4pm' or 'next Friday at 3pm' and the system automatically understands and converts them."
                }
              }
            ]
          })
        }}
      />
    </main>
  );
}
