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

interface SlotData {
  id: string;
  creatorName?: string;
  meetingPurpose?: string;
  timeSlots: { start: string; end: string }[];
  timezone: string;
  expiresAt: number;
  status: string;
  maxBookings: number;
  bookingsCount: number;
  expirationDays: number;
  bookingMode: 'individual' | 'group';
  bookedTimeSlotIndices: number[];
  meetingLocation?: MeetingLocation;
}

export default function ReschedulePage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [slot, setSlot] = useState<SlotData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeSlotIndex, setSelectedTimeSlotIndex] = useState<number | null>(null);
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

          // Fetch parent slot data
          const slotResponse = await fetch(`/api/slots/${data.booking.slotId}`);
          const slotData = await slotResponse.json();

          if (!slotResponse.ok) {
            setError(slotData.message || 'Unable to load slot information');
            setIsLoading(false);
            return;
          }

          if (slotData.success && slotData.slot) {
            setSlot(slotData.slot);
          } else {
            setError('Slot information not found');
          }
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

  const handleReschedule = async () => {
    if (selectedTimeSlotIndex === null) {
      setSubmitError('Please select a new time slot');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedTimeSlotIndex,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.message || data.error || 'Failed to reschedule booking');
        setIsSubmitting(false);
        return;
      }

      if (data.success) {
        // Redirect to confirmation page
        router.push(`/reschedule/${bookingId}/confirmed`);
      } else {
        setSubmitError('Failed to reschedule booking');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      setSubmitError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

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

  if (error || !booking || !slot) {
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
  const maxReschedules = 3;
  const remainingReschedules = maxReschedules - booking.rescheduleCount;
  const canReschedule = remainingReschedules > 0;

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

      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Reschedule or Cancel
          </h1>
          <p className="text-xl text-gray-600">
            Manage your booking with {booking.creatorName}
          </p>
        </div>

        {/* Current Booking Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Current Booking
          </h2>

          {/* Date & Time */}
          <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📅</div>
              <div className="flex-1">
                <p className="text-sm text-blue-700 font-semibold mb-1">
                  Current Time
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

          {/* Meeting Purpose */}
          {booking.meetingPurpose && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-xs text-gray-700 font-semibold mb-2">
                Purpose
              </p>
              <p className="text-gray-900">{booking.meetingPurpose}</p>
            </div>
          )}

          {/* Reschedule Count */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Reschedules used:</strong> {booking.rescheduleCount} / {maxReschedules}
              {canReschedule && (
                <span className="ml-2">({remainingReschedules} remaining)</span>
              )}
            </p>
          </div>
        </div>

        {/* Reschedule Section */}
        {canReschedule && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Select New Time
            </h2>

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Error:</strong> {submitError}
                </p>
              </div>
            )}

            {/* Available Time Slots */}
            <div className="space-y-3 mb-6">
              {slot.timeSlots.map((timeSlot, index) => {
                const startDate = new Date(timeSlot.start);
                const endDate = new Date(timeSlot.end);
                const isCurrentTime = index === booking.selectedTimeSlotIndex;
                const isBooked = slot.bookingMode === 'individual' &&
                                 slot.bookedTimeSlotIndices.includes(index) &&
                                 index !== booking.selectedTimeSlotIndex;
                const isSelected = selectedTimeSlotIndex === index;

                return (
                  <button
                    key={index}
                    onClick={() => !isBooked && setSelectedTimeSlotIndex(index)}
                    disabled={isBooked || isSubmitting}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      isBooked
                        ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                        : isSelected
                        ? 'bg-green-50 border-green-500 shadow-md'
                        : isCurrentTime
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-gray-300 hover:border-blue-500 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatInTimezone(startDate, userTimezone, 'EEEE, MMMM d')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatInTimezone(startDate, userTimezone, 'h:mm a')} - {formatInTimezone(endDate, userTimezone, 'h:mm a')} ({getTimezoneAbbr(userTimezone)})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCurrentTime && (
                          <span className="px-3 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded-full">
                            Current
                          </span>
                        )}
                        {isBooked && (
                          <span className="px-3 py-1 bg-gray-300 text-gray-700 text-xs font-semibold rounded-full">
                            Booked
                          </span>
                        )}
                        {isSelected && (
                          <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reschedule Button */}
            <button
              onClick={handleReschedule}
              disabled={selectedTimeSlotIndex === null || isSubmitting}
              className={`w-full py-4 px-6 font-semibold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                selectedTimeSlotIndex === null || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Confirm Reschedule
                </>
              )}
            </button>
          </div>
        )}

        {/* Reschedule Limit Reached */}
        {!canReschedule && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Reschedule Limit Reached
              </h2>
              <p className="text-gray-600 mb-6">
                You have used all {maxReschedules} reschedules for this booking.
                If you need to change the time, please cancel and create a new booking.
              </p>
            </div>
          </div>
        )}

        {/* Cancel Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Need to cancel?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            If you can't make the meeting, you can cancel your booking. Both you and {booking.creatorName} will be notified.
          </p>
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}
