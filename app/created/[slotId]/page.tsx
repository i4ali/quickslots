'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CopyButton } from '@/components/copy-button';
import { CountdownTimer } from '@/components/countdown-timer';
import { TipButton } from '@/components/tip-button';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-100 mb-2">Something went wrong</h1>
            <p className="text-gray-300 mb-6">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4">
            Your Link is Ready!
          </h1>
          <p className="text-xl text-gray-300">
            Share it with anyone you want to meet
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-8 mb-8">
          {/* Shareable Link Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Your Shareable Link
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 px-4 py-3 bg-slate-900/50 border-2 border-slate-600 rounded-lg font-mono text-sm text-gray-100 break-all">
                {shareableUrl}
              </div>
              <CopyButton text={shareableUrl} />
            </div>
          </div>

          {/* Expiration Countdown */}
          {expiresAt && (
            <div className="mb-8 p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">⏰</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-300 mb-1">
                    Link expires in:
                  </p>
                  <CountdownTimer expiresAt={expiresAt} />
                </div>
              </div>
            </div>
          )}

          {/* What Happens Next */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-100 mb-4 flex items-center gap-2">
              <span>📋</span> What Happens Next?
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-bold border border-blue-500/30">
                  1
                </div>
                <p className="text-gray-300 pt-0.5">
                  <strong className="text-gray-200">Share your link</strong> via email, text message, or any chat app
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-bold border border-blue-500/30">
                  2
                </div>
                <p className="text-gray-300 pt-0.5">
                  <strong className="text-gray-200">They pick a time</strong> from your available slots
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-bold border border-blue-500/30">
                  3
                </div>
                <p className="text-gray-300 pt-0.5">
                  <strong className="text-gray-200">You both get notified</strong> instantly via email with calendar invites
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-bold border border-blue-500/30">
                  4
                </div>
                <p className="text-gray-300 pt-0.5">
                  <strong className="text-gray-200">Link expires</strong> after booking or 24 hours (whichever comes first)
                </p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-300">
              <strong>🔒 Privacy:</strong> All data is automatically deleted after your link expires. We never store your information permanently.
            </p>
          </div>
        </div>

        {/* Tip Button */}
        <TipButton className="mb-8" />

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
            className="flex-1 py-4 px-6 bg-slate-800/50 text-blue-400 font-semibold rounded-lg border-2 border-blue-600 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>👀</span>
            Preview Link
          </button>
        </div>
      </div>
    </div>
  );
}
