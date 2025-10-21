'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CopyButton } from '@/components/copy-button';
import { CountdownTimer } from '@/components/countdown-timer';
import { TipButton } from '@/components/tip-button';
import { DisplayAd } from '@/components/display-ad';

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleCreateAnother}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              <img src="/logo-256.png" alt="WhenAvailable" className="w-10 h-10" />
              WhenAvailable
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
        {/* Success Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Your Link is Ready!
          </h1>
          <p className="text-xl text-gray-600">
            Share it with anyone you want to meet
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          {/* Shareable Link Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Your Shareable Link
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm text-gray-900 break-all">
                {shareableUrl}
              </div>
              <CopyButton text={shareableUrl} />
            </div>
          </div>

          {/* Expiration Countdown */}
          {expiresAt && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>📋</span> What happens next?
            </h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p className="text-gray-600 pt-0.5">
                  <strong className="text-gray-900">Share your link</strong> via email, text message, or any chat app
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p className="text-gray-600 pt-0.5">
                  <strong className="text-gray-900">They pick a time</strong> from your available slots
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p className="text-gray-600 pt-0.5">
                  <strong className="text-gray-900">You both get notified</strong> instantly via email with calendar invites
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <p className="text-gray-600 pt-0.5">
                  <strong className="text-gray-900">Link expires</strong> after booking or 24 hours (whichever comes first)
                </p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>🔒 Privacy:</strong> All data is automatically deleted after your link expires. We never store your information permanently.
            </p>
          </div>
        </div>

        {/* Tip Button */}
        <TipButton className="mb-8" />

        {/* Ad Placement: After tip button */}
        <DisplayAd
          adSlot="REPLACE_WITH_YOUR_AD_SLOT_ID"
          adFormat="auto"
          fullWidthResponsive={true}
          className="mb-8"
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleCreateAnother}
            className="flex-1 py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
}
