'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function TipSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto border-2 border-green-300">
              <svg
                className="w-10 h-10 text-green-600"
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Thank You! 💚
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your support helps keep WhenAvailable free and running for everyone.
          </p>

          {/* Details */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-green-800 mb-2 font-semibold">
              Your contribution makes a real difference!
            </p>
            <p className="text-gray-700">
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
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              Create Another Link
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all"
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
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-gray-600">Loading...</div>
        </main>
      }
    >
      <TipSuccessContent />
    </Suspense>
  );
}
