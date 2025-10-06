'use client';

import { useState } from 'react';
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
        // Success! Show the shareable link
        console.log('Link created successfully:', data);
        alert(`Link created successfully!\n\nShare this link:\n${data.shareableUrl}\n\nExpires in 24 hours.`);

        // TODO: In Story 2.5, navigate to confirmation page instead
        // router.push(`/created/${data.slotId}`);

        // For now, reset form
        setName('');
        setEmail('');
        setPurpose('');
        setSlots([]);
        setTouched({ name: false, email: false, purpose: false });
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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            ⚡ QuickSlots
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-2">
            Share your availability in seconds
          </p>
          <p className="text-gray-500">
            No signup. Link expires after booking.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-12">
          <div className="space-y-6">
            {/* Success Banner */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 text-center">
                <strong>✅ Story 2.4 Complete:</strong> Link generation API is live! Links are stored in Redis.
                <br />
                <span className="text-green-700">
                  Try it out: Type "tomorrow 2-4pm", add your email, and generate a real scheduling link!
                </span>
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ {error}
                </p>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sarah Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    nameError
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {nameError && (
                  <p className="text-xs text-red-600 mt-1">{nameError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    emailError
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {emailError && (
                  <p className="text-xs text-red-600 mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Meeting Purpose (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Coffee chat"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  onBlur={() => setTouched({ ...touched, purpose: true })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    purposeError
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
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
                'Generate Link 🚀'
              ) : (
                'Add email and availability to continue'
              )}
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-1">Instant</h3>
            <p className="text-sm text-gray-600">Create links in seconds</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-1">Private</h3>
            <p className="text-sm text-gray-600">No signup required</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">⏰</div>
            <h3 className="font-semibold text-gray-900 mb-1">Temporary</h3>
            <p className="text-sm text-gray-600">Expires after 24 hours</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">🗑️</div>
            <h3 className="font-semibold text-gray-900 mb-1">Zero Data</h3>
            <p className="text-sm text-gray-600">Auto-deleted forever</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share Availability</h3>
              <p className="text-sm text-gray-600">
                Type when you're free in plain English
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share Your Link</h3>
              <p className="text-sm text-gray-600">
                Send the link via email, text, or chat
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Confirmed</h3>
              <p className="text-sm text-gray-600">
                Both parties receive email confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Development Status */}
        <div className="mt-12 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium">Story 2.4 Complete:</span>
            <span>Link Generation API ✓</span>
          </div>
          <p className="text-xs text-gray-500">
            Phase 1 (Foundation): 5/5 stories complete • Phase 2 (Core Features): 4/14 stories
          </p>
        </div>
      </div>
    </main>
  );
}
