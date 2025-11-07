'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatInTimezone, getTimezoneAbbr } from '@/lib/timezone';
import { MeetingLocation, TimeSlot } from '@/types/slot';

interface BookingData {
  id: string;
  slotId: string;
  bookedAt: number;
  bookerName: string;
  bookerEmail: string;
  bookerNote?: string;
  selectedTime: string;
  selectedTimeSlotIndex: number;
  timezone: string;
  creatorName: string;
  creatorEmail: string;
  meetingPurpose?: string;
  meetingLocation?: MeetingLocation;
  rescheduleCount: number;
  rescheduledAt?: number;
  originalSelectedTime?: string;
}

export default function ReschedulePage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [userTimezone, setUserTimezone] = useState<string>('');

  useEffect(() => {
    // Get user timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(tz);

    // Fetch booking data
    const fetchBookingData = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Unable to load booking information');
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

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.message || data.error || 'Failed to cancel booking');
        setIsSubmitting(false);
        return;
      }

      if (data.success) {
        // Redirect to cancellation confirmation page
        router.push(`/reschedule/${bookingId}/cancelled`);
      } else {
        setSubmitError('Failed to cancel booking');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setSubmitError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking information...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || 'Unable to load booking information'}
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

  const currentMeetingDate = new Date(booking.selectedTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl"></div>
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

      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Manage Your Booking
          </h1>
          <p className="text-xl text-gray-600">
            View or cancel your meeting with {booking.creatorName}
          </p>
        </div>

        {/* Current Booking Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Booking
          </h2>

          {/* Date & Time */}
          <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📅</div>
              <div className="flex-1">
                <p className="text-sm text-blue-700 font-semibold mb-1">
                  Meeting Time
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {formatInTimezone(currentMeetingDate, userTimezone, 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-lg text-blue-900">
                  {formatInTimezone(currentMeetingDate, userTimezone, 'h:mm a')} ({getTimezoneAbbr(userTimezone)})
                </p>
              </div>
            </div>
          </div>

          {/* Meeting Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">👤</div>
              <div>
                <p className="text-sm text-gray-600">With</p>
                <p className="text-gray-900 font-medium">{booking.creatorName}</p>
              </div>
            </div>

            {booking.meetingPurpose && (
              <div className="flex items-start gap-3">
                <div className="text-2xl">📝</div>
                <div>
                  <p className="text-sm text-gray-600">Purpose</p>
                  <p className="text-gray-900">{booking.meetingPurpose}</p>
                </div>
              </div>
            )}

            {booking.meetingLocation && (
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {booking.meetingLocation.type === 'phone' && '📞'}
                  {booking.meetingLocation.type === 'in-person' && '📍'}
                  {booking.meetingLocation.type === 'custom' && '🔗'}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  {booking.meetingLocation.type === 'phone' && (
                    <p className="text-gray-900">
                      Phone Call
                      {booking.meetingLocation.details.phoneNumber &&
                        ` - ${booking.meetingLocation.details.phoneNumber}`}
                    </p>
                  )}
                  {booking.meetingLocation.type === 'in-person' && (
                    <p className="text-gray-900">
                      {booking.meetingLocation.details.address || 'In-person meeting'}
                    </p>
                  )}
                  {booking.meetingLocation.type === 'custom' && (
                    <div>
                      <p className="text-gray-900">
                        {booking.meetingLocation.details.customLinkLabel || 'Video Call'}
                      </p>
                      {booking.meetingLocation.details.customLink && (
                        <a
                          href={booking.meetingLocation.details.customLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm break-all"
                        >
                          {booking.meetingLocation.details.customLink}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cancel Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Need to cancel?
          </h3>
          <p className="text-gray-600 mb-6">
            If you can't make the meeting, you can cancel your booking. Both you and {booking.creatorName} will be notified via email.
          </p>

          {submitError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Error:</strong> {submitError}
              </p>
            </div>
          )}

          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Cancelling...
              </>
            ) : (
              <>
                <span>❌</span>
                Cancel Booking
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
