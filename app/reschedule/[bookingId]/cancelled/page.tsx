'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatInTimezone, getTimezoneAbbr } from '@/lib/timezone';

interface BookingData {
  id: string;
  selectedTime: string;
  bookerName: string;
  creatorName: string;
  meetingPurpose?: string;
  cancelledAt: number;
  originalSelectedTime?: string;
}

export default function BookingCancelledPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTimezone, setUserTimezone] = useState<string>('');

  useEffect(() => {
    // Get user timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(tz);

    // Fetch cancelled booking data
    const fetchBookingData = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        const data = await response.json();

        if (!response.ok) {
          // If booking is cancelled (410), we still want to show it
          if (response.status === 410 && data.booking) {
            setBooking(data.booking);
          } else {
            setError(data.message || 'Unable to load booking information');
          }
          setIsLoading(false);
          return;
        }

        if (data.success && data.booking) {
          setBooking(data.booking);
        } else {
          setError('Booking not found');
        }
      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError('Unable to load booking information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cancellation confirmation...</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Confirmation Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || 'Unable to load cancellation confirmation'}
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cancelledDate = new Date(booking?.cancelledAt || Date.now());
  const originalMeetingDate = new Date(booking?.originalSelectedTime || booking?.selectedTime || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-red-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm relative z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-1 group">
              <img src="/logo.svg" alt="WhenAvailable" className="w-10 h-10 group-hover:scale-105 transition-transform" />
              <span className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                WhenAvailable
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20 relative z-10">
        {/* Cancellation Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Booking Cancelled
          </h1>
          <p className="text-xl text-gray-600">
            Your meeting has been cancelled
          </p>
        </div>

        {/* Cancellation Details Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-8">
          {/* Cancelled Meeting Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Cancelled Meeting
            </h2>

            <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg mb-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📅</div>
                <div className="flex-1">
                  <p className="text-sm text-red-700 font-semibold mb-1">
                    Originally Scheduled For
                  </p>
                  <p className="text-lg font-bold text-red-900">
                    {formatInTimezone(originalMeetingDate, userTimezone, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-lg text-red-900">
                    {formatInTimezone(originalMeetingDate, userTimezone, 'h:mm a')} ({getTimezoneAbbr(userTimezone)})
                  </p>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 font-semibold mb-2">
                  Host
                </p>
                <p className="font-semibold text-gray-900">{booking?.creatorName}</p>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-purple-700 font-semibold mb-2">
                  Attendee
                </p>
                <p className="font-semibold text-gray-900">{booking?.bookerName}</p>
              </div>
            </div>

            {/* Meeting Purpose */}
            {booking?.meetingPurpose && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6">
                <p className="text-xs text-gray-700 font-semibold mb-2">
                  Purpose
                </p>
                <p className="text-gray-900">{booking.meetingPurpose}</p>
              </div>
            )}

            {/* Cancellation Time */}
            <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Cancelled on:</strong> {formatInTimezone(cancelledDate, userTimezone, 'MMMM d, yyyy')} at {formatInTimezone(cancelledDate, userTimezone, 'h:mm a')}
              </p>
            </div>
          </div>

          {/* Email Confirmation Notice */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 text-center">
              <strong>✉️ Cancellation emails sent!</strong>
              <br />
              Both you and {booking?.creatorName} have been notified of the cancellation.
            </p>
          </div>
        </div>

        {/* What Happens Next Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span> What Happens Next?
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold border border-red-200">
                ✓
              </span>
              <span>
                <strong className="text-gray-900">Cancellation emails sent</strong> to both you and {booking?.creatorName}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold border border-red-200">
                ✓
              </span>
              <span>
                <strong className="text-gray-900">Calendar event cancelled</strong> - You'll receive a cancellation notice
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold border border-blue-200">
                📅
              </span>
              <span>
                <strong className="text-gray-900">Time slot freed up</strong> - The slot is now available for others to book
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold border border-blue-200">
                💬
              </span>
              <span>
                <strong className="text-gray-900">Need to reschedule?</strong> Contact {booking?.creatorName} directly to set up a new meeting
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex-1 py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}
