'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function TipSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-emerald-500/50 p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/50">
              <svg
                className="w-10 h-10 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
            Thank You! 💚
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Your support helps keep QuickSlots free and running for everyone.
          </p>

          {/* Details */}
          <div className="bg-slate-900/50 border-2 border-slate-600 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-400 mb-2">
              Your contribution makes a real difference!
            </p>
            <p className="text-gray-300">
              We truly appreciate your support in keeping this service free, simple, and accessible.
            </p>
          </div>

          {/* Session ID (for reference) */}
          {sessionId && (
            <p className="text-xs text-gray-500 mb-6">
              Transaction ID: {sessionId.slice(0, 20)}...
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all"
            >
              Create Another Link
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-slate-700 text-gray-200 font-semibold rounded-lg hover:bg-slate-600 hover:shadow-lg transition-all"
            >
              Return to Homepage
            </Link>
          </div>

          {/* Emoji Footer */}
          <div className="mt-8 text-4xl animate-bounce">
            ☕✨
          </div>
        </div>
      </div>
    </main>
  );
}

export default function TipSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
          <div className="text-gray-300">Loading...</div>
        </main>
      }
    >
      <TipSuccessContent />
    </Suspense>
  );
}
