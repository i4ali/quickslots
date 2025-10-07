'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after 1 second delay
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t-4 border-blue-500 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Message */}
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🍪</div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">
                  We use cookies
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  QuickSlots uses essential cookies for functionality and may use advertising cookies
                  (Google AdSense) to support the free service. We do not track you across websites.{' '}
                  <Link
                    href="/privacy"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Learn more
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleDecline}
              className="px-6 py-2.5 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors whitespace-nowrap"
            >
              Essential Only
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Accept All
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-3 text-xs text-gray-400">
          <p>
            By clicking "Accept All", you consent to our use of cookies for analytics and advertising.
            Your data auto-deletes after 24 hours. Read our{' '}
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
              Privacy Policy
            </Link>
            {' '}and{' '}
            <Link href="/terms" className="text-blue-400 hover:text-blue-300 underline">
              Terms of Service
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
