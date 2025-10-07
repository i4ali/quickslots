'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CopyButton } from '@/components/copy-button';
import { CountdownTimer } from '@/components/countdown-timer';
import { TipJar } from '@/components/tip-jar';

export default function LinkCreatedPage() {
  const params = useParams();
  const router = useRouter();
  const slotId = params.slotId as string;
  const [shareableUrl, setShareableUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the shareable URL from the current origin
    const url = `${window.location.origin}/${slotId}`;
    setShareableUrl(url);

    // Calculate expiration time (24 hours from now)
    const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    setExpiresAt(expirationTime);
    setIsLoading(false);
  }, [slotId]);

  const handleCreateAnother = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleCreateAnother}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Your Link is Ready!
          </h1>
          <p className="text-xl text-gray-600">
            Share it with anyone you want to meet
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          {/* Shareable Link Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Your Shareable Link
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg font-mono text-sm text-gray-900 break-all">
                {shareableUrl}
              </div>
              <CopyButton text={shareableUrl} />
            </div>
          </div>

          {/* Expiration Countdown */}
          {expiresAt && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">⏰</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Link expires in:
                  </p>
                  <CountdownTimer expiresAt={expiresAt} />
                </div>
              </div>
            </div>
          )}

          {/* What Happens Next */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📋</span> What Happens Next?
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <p className="text-gray-700 pt-0.5">
                  <strong>Share your link</strong> via email, text message, or any chat app
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <p className="text-gray-700 pt-0.5">
                  <strong>They pick a time</strong> from your available slots
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <p className="text-gray-700 pt-0.5">
                  <strong>You both get notified</strong> instantly via email with calendar invites
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <p className="text-gray-700 pt-0.5">
                  <strong>Link expires</strong> after booking or 24 hours (whichever comes first)
                </p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              <strong>🔒 Privacy:</strong> All data is automatically deleted after your link expires. We never store your information permanently.
            </p>
          </div>
        </div>

        {/* Tip Jar */}
        <TipJar />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleCreateAnother}
            className="flex-1 py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>➕</span>
            Create Another Link
          </button>
          <button
            onClick={() => window.open(shareableUrl, '_blank')}
            className="flex-1 py-4 px-6 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <span>👀</span>
            Preview Link
          </button>
        </div>

        {/* Development Status */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium">Story 2.5 Complete:</span>
            <span>Link Created Confirmation Page ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
