'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatInTimezone, getTimezoneAbbr } from '@/lib/timezone';
import { TipButton } from '@/components/tip-button';
import { generateBookingICS, downloadICS } from '@/lib/ics';

interface BookingData {
  slotId: string;
  selectedTime: string;
  bookerName: string;
  bookerEmail: string;
  creatorName: string;
  creatorEmail: string;
  meetingPurpose?: string;
  bookerNote?: string;
  bookerTimezone?: string;
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const slotId = params.slotId as string;

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTimezone, setUserTimezone] = useState<string>('');

  useEffect(() => {
    // Get user timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(tz);

    // Try to get booking data from sessionStorage first (passed from booking form)
    const storedData = sessionStorage.getItem(`booking_${slotId}`);

    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setBookingData(data);
        setIsLoading(false);
        // Don't clear sessionStorage immediately - let browser handle cleanup
        // This prevents errors on page refresh or React strict mode re-renders
        return;
      } catch (err) {
        console.error('Failed to parse booking data:', err);
        // Fall through to API fetch
      }
    }

    // Fallback: Fetch booking data from API
    // This handles page refreshes, direct navigation, or strict mode re-renders
    const fetchBookingData = async () => {
      try {
        const response = await fetch(`/api/bookings/${slotId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Unable to load booking confirmation');
          return;
        }

        if (data.success && data.booking) {
          setBookingData(data.booking);
        } else {
          setError('Booking confirmation not found');
        }
      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError('Unable to load booking confirmation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [slotId]);

  const handleDownloadICS = () => {
    if (!bookingData) return;

    try {
      // Generate .ics file content
      const icsContent = generateBookingICS({
        creatorName: bookingData.creatorName,
        creatorEmail: bookingData.creatorEmail,
        bookerName: bookingData.bookerName,
        bookerEmail: bookingData.bookerEmail,
        meetingPurpose: bookingData.meetingPurpose || 'WhenAvailable Meeting',
        selectedTime: bookingData.selectedTime,
        duration: 60, // Default 60 minutes
      });

      // Trigger download
      const filename = `quickslots-meeting-${bookingData.slotId}.ics`;
      downloadICS(icsContent, filename);
    } catch (error) {
      console.error('Failed to generate calendar file:', error);
      alert('Sorry, there was an error generating the calendar file. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Confirmation Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || 'Unable to load booking confirmation'}
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

  const meetingDate = new Date(bookingData.selectedTime);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              WhenAvailable
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
        {/* Success Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            You're all set for your meeting
          </p>
        </div>

        {/* Main Confirmation Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          {/* Meeting Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Meeting Details
            </h2>

            {/* Date & Time */}
            <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📅</div>
                <div className="flex-1">
                  <p className="text-sm text-green-700 font-semibold mb-1">
                    When
                  </p>
                  <p className="text-lg font-bold text-green-900">
                    {formatInTimezone(meetingDate, userTimezone, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-lg text-green-900">
                    {formatInTimezone(meetingDate, userTimezone, 'h:mm a')} ({getTimezoneAbbr(userTimezone)})
                  </p>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Creator */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 font-semibold mb-2">
                  Host
                </p>
                <p className="font-semibold text-gray-900">{bookingData.creatorName}</p>
                <p className="text-sm text-gray-600">{bookingData.creatorEmail}</p>
              </div>

              {/* Booker */}
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-purple-700 font-semibold mb-2">
                  Attendee
                </p>
                <p className="font-semibold text-gray-900">{bookingData.bookerName}</p>
                <p className="text-sm text-gray-600">{bookingData.bookerEmail}</p>
              </div>
            </div>

            {/* Meeting Purpose */}
            {bookingData.meetingPurpose && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-700 font-semibold mb-2">
                  Purpose
                </p>
                <p className="text-gray-900">{bookingData.meetingPurpose}</p>
              </div>
            )}

            {/* Booker Note */}
            {bookingData.bookerNote && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700 font-semibold mb-2">
                  Note from {bookingData.bookerName}
                </p>
                <p className="text-gray-900">{bookingData.bookerNote}</p>
              </div>
            )}
          </div>

          {/* Add to Calendar Button */}
          <button
            onClick={handleDownloadICS}
            className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mb-6"
          >
            <span>📥</span>
            Add to Calendar
          </button>

          {/* Email Confirmation Notice */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              <strong>✉️ Confirmation emails sent!</strong>
              <br />
              Both you and {bookingData.creatorName} will receive email confirmations with calendar invites.
            </p>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span> What Happens Next?
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold border border-green-200">
                ✓
              </span>
              <span>
                <strong className="text-gray-900">Confirmation emails sent</strong> to both you and {bookingData.creatorName} with calendar invites (.ics files)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold border border-green-200">
                ✓
              </span>
              <span>
                <strong className="text-gray-900">Link expired</strong> - This booking link can no longer be used
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold border border-green-200">
                ✓
              </span>
              <span>
                <strong className="text-gray-900">All data auto-deleted</strong> after 24 hours for your privacy
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold border border-blue-200">
                📅
              </span>
              <span>
                <strong className="text-gray-900">Check your calendar</strong> - Add the meeting to your preferred calendar app using the email attachment
              </span>
            </li>
          </ul>
        </div>

        {/* Tip Button */}
        <TipButton className="mb-8" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex-1 py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>➕</span>
            Create Another Link
          </button>
          <button
            onClick={handleDownloadICS}
            className="flex-1 py-4 px-6 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            <span>📥</span>
            Download Calendar File
          </button>
        </div>
      </div>
    </div>
  );
}
