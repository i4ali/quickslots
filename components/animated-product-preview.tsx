'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const screens = [
  {
    id: 'step1',
    title: 'Step 1: Enter Your Availability',
    description: 'Type in natural language - no complex forms',
    mockup: (
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-full max-w-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Share Your Availability</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Your Email</label>
            <input
              type="email"
              value="sarah@email.com"
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">When are you free?</label>
            <div className="relative">
              <input
                type="text"
                disabled
                className="w-full px-3 py-2 border border-green-500 rounded-lg bg-white text-gray-900 text-xs"
              />
              <TypewriterText text="tomorrow 2-4pm" className="absolute left-3 top-2 text-gray-900 text-xs pointer-events-none" />
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
            <p className="text-xs font-medium text-green-800">✓ Parsed successfully:</p>
            <p className="text-xs text-green-900 mt-0.5">Thursday, Nov 7, 2025 - 2:00 PM to 4:00 PM</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'step2',
    title: 'Step 2: Get Your Link',
    description: 'Instant shareable link - no account needed',
    mockup: (
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-full max-w-sm">
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">✅</div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Your Link is Ready!</h3>
          <p className="text-gray-600 text-xs">Share it with anyone you want to meet</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-900 mb-1.5">Shareable Link</label>
            <div className="flex gap-2">
              <div className="flex-1 px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg font-mono text-xs text-gray-900 truncate">
                whenavailable.app/abc123
              </div>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg">
                Copy
              </button>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
            <p className="text-xs font-semibold text-blue-900 mb-1">⏰ Link expires in:</p>
            <p className="text-base font-bold text-blue-900">23:59:47</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'step3',
    title: 'Step 3: They Book a Time',
    description: 'Clean booking page for your invitees',
    mockup: (
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-full max-w-sm">
        <div className="text-center mb-4">
          <div className="text-2xl mb-1.5">📅</div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Book Time with Sarah</h3>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 text-xs">
            <span className="font-medium">Coffee chat</span>
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="p-3 rounded-lg border-2 border-blue-600 bg-blue-50">
            <p className="font-semibold text-gray-900 text-xs mb-0.5">Thursday, November 7, 2025</p>
            <p className="text-xs text-blue-700">2:00 PM - 4:00 PM (EST)</p>
          </div>
          <div className="p-3 rounded-lg border-2 border-gray-200 bg-white opacity-50">
            <p className="font-semibold text-gray-900 text-xs mb-0.5">Friday, November 8, 2025</p>
            <p className="text-xs text-gray-600">10:00 AM - 12:00 PM (EST)</p>
          </div>
        </div>
        <button className="w-full mt-3 py-2.5 bg-blue-600 text-white font-semibold rounded-lg text-xs">
          Continue →
        </button>
      </div>
    ),
  },
  {
    id: 'step4',
    title: 'Step 4: Email Confirmation',
    description: 'Both parties get instant email with calendar invite',
    mockup: (
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-xl">
        {/* Email Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-t-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">📧</span>
            </div>
            <div>
              <p className="font-semibold text-sm">WhenAvailable</p>
              <p className="text-xs text-blue-100">noreply@whenavailable.app</p>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-4">
          {/* Subject Line */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-0.5">Subject:</p>
            <h4 className="text-sm font-bold text-gray-900">
              ✅ Your meeting is confirmed! Thursday, Nov 7 at 2:00 PM with Sarah
            </h4>
          </div>

          {/* Success Message */}
          <div className="mb-4 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-green-900 mb-0.5 text-sm">Booking Confirmed</p>
                <p className="text-xs text-green-800">Your meeting has been successfully scheduled.</p>
              </div>
            </div>
          </div>

          {/* Meeting Details Card */}
          <div className="mb-4 border-2 border-gray-200 rounded-lg p-3 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h5 className="font-bold text-gray-900 mb-2.5 flex items-center gap-1.5 text-sm">
              <span>📅</span> Meeting Details
            </h5>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-gray-600 w-16 flex-shrink-0">📍 With:</span>
                <span className="font-medium text-gray-900">Sarah Chen</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-600 w-16 flex-shrink-0">🕐 When:</span>
                <span className="font-medium text-gray-900">Thu, Nov 7, 2025<br />2:00-4:00 PM EST</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-600 w-16 flex-shrink-0">💬 Purpose:</span>
                <span className="font-medium text-gray-900">Coffee chat</span>
              </div>
            </div>
          </div>

          {/* Calendar Invite Attachment */}
          <div className="mb-4 p-3 bg-purple-50 border-2 border-purple-200 rounded-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📎</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-xs mb-0.5 truncate">meeting-invite.ics</p>
                <p className="text-xs text-gray-600">Calendar invite file</p>
              </div>
              <button className="px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors flex-shrink-0">
                Download
              </button>
            </div>
            <div className="mt-2 pt-2 border-t border-purple-200">
              <p className="text-xs text-purple-900 flex items-center gap-1.5">
                <span>💡</span>
                <span>Works with all major calendars</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button className="flex-1 py-2 px-3 bg-blue-600 text-white font-semibold rounded-lg text-xs hover:bg-blue-700 transition-colors">
              Add to Calendar
            </button>
            <button className="flex-1 py-2 px-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg text-xs hover:border-blue-400 hover:text-blue-600 transition-colors">
              View Details
            </button>
          </div>
        </div>

        {/* Email Footer */}
        <div className="bg-gray-50 px-4 py-2.5 rounded-b-lg border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Scheduled with WhenAvailable • Privacy-first • Auto-deletes after expiration
          </p>
        </div>
      </div>
    ),
  },
];

function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span className={className}>{displayText}</span>;
}

export function AnimatedProductPreview() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % screens.length);
    }, 5000); // Change screen every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg mb-4">
          <span className="animate-pulse">●</span>
          Live Preview
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          See How It Works
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Watch the entire flow from creating your link to receiving bookings
        </p>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-3 mb-8">
        {screens.map((screen, index) => (
          <button
            key={screen.id}
            onClick={() => setCurrentStep(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentStep
                ? 'w-12 bg-blue-600'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to ${screen.title}`}
          />
        ))}
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Animated Screen Transitions */}
        <div className="relative min-h-[480px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full flex flex-col items-center"
            >
              {/* Step Info */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {screens[currentStep].title}
                </h3>
                <p className="text-gray-600">
                  {screens[currentStep].description}
                </p>
              </div>

              {/* Mockup */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="w-full flex justify-center"
              >
                {screens[currentStep].mockup}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Features Checklist */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 sticky top-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Everything You Need</h3>
            <p className="text-gray-600">Simple, powerful scheduling without the complexity</p>
          </div>

          <div className="space-y-4">
            {/* Feature items */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">No Signup Required</h4>
                <p className="text-sm text-gray-600">Create links instantly without creating an account</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Natural Language Input</h4>
                <p className="text-sm text-gray-600">Type availability in plain English like "tomorrow 2-4pm"</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Multiple Bookings</h4>
                <p className="text-sm text-gray-600">Let multiple people book from the same link</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Automatic Email Confirmations</h4>
                <p className="text-sm text-gray-600">Both parties get instant emails with calendar invites</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Flexible Duration</h4>
                <p className="text-sm text-gray-600">Links last from 24 hours up to 7 days</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Privacy-First</h4>
                <p className="text-sm text-gray-600">No tracking, auto-deletes after expiration</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Group & Individual Modes</h4>
                <p className="text-sm text-gray-600">Support both 1-on-1 and group bookings</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Timezone Support</h4>
                <p className="text-sm text-gray-600">Automatic timezone conversion for all participants</p>
              </div>
            </div>
          </div>

          {/* Highlight */}
          <div className="mt-6 pt-6 border-t-2 border-blue-200">
            <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
              <p className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>100% Free - Forever</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
