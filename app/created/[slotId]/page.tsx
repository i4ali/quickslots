'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CopyButton } from '@/components/copy-button';
import { CountdownTimer } from '@/components/countdown-timer';
import { TipButton } from '@/components/tip-button';

interface SlotData {
  id: string;
  expiresAt: number;
  maxBookings: number;
  bookingsCount: number;
  expirationDays: number;
}

export default function LinkCreatedPage() {
  const params = useParams();
  const router = useRouter();
  const slotId = params.slotId as string;
  const [shareableUrl, setShareableUrl] = useState('');
  const [slotData, setSlotData] = useState<SlotData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the shareable URL from the current origin
    const url = `${window.location.origin}/${slotId}`;
    setShareableUrl(url);

    // Fetch actual slot data from API
    const fetchSlotData = async () => {
      try {
        const response = await fetch(`/api/slots/${slotId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch slot data');
        }

        if (data.success && data.slot) {
          setSlotData({
            id: data.slot.id,
            expiresAt: data.slot.expiresAt,
            maxBookings: data.slot.maxBookings,
            bookingsCount: data.slot.bookingsCount,
            expirationDays: data.slot.expirationDays,
          });
        }
      } catch (err) {
        console.error('Error fetching slot data:', err);
        // Don't show error, just use defaults
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlotData();
  }, [slotId]);

  const handleCreateAnother = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-center">
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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm relative z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              <img src="/logo-256.png" alt="WhenAvailable" className="w-10 h-10" />
              WhenAvailable
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20 relative z-10">
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
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-8">
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

          {/* Link Details */}
          {slotData && (
            <div className="mb-8 space-y-4">
              {/* Booking Status */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-900 mb-1">
                  📊 Booking Status
                </p>
                <p className="text-green-800">
                  <strong>{slotData.bookingsCount}/{slotData.maxBookings}</strong> booking{slotData.maxBookings > 1 ? 's' : ''} confirmed
                  {slotData.maxBookings - slotData.bookingsCount > 0 && (
                    <> • <strong>{slotData.maxBookings - slotData.bookingsCount}</strong> {slotData.maxBookings - slotData.bookingsCount === 1 ? 'spot' : 'spots'} remaining</>
                  )}
                </p>
              </div>

              {/* Expiration Countdown */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Link expires in:
                    </p>
                    <CountdownTimer expiresAt={new Date(slotData.expiresAt).toISOString()} />
                  </div>
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
                  <strong className="text-gray-900">Link expires</strong> {slotData ? (
                    slotData.maxBookings > 1 ?
                      `when all ${slotData.maxBookings} slots are filled or after ${slotData.expirationDays} ${slotData.expirationDays === 1 ? 'day' : 'days'}` :
                      `after booking or ${slotData.expirationDays} ${slotData.expirationDays === 1 ? 'day' : 'days'}`
                  ) : 'based on your settings'}
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
