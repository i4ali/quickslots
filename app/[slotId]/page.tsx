'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatInTimezone, getTimezoneAbbr } from '@/lib/timezone';
import { MeetingLocation } from '@/types/slot';

// Metadata can't be exported from client components, but we can add it via layout
// For now, add head tags manually in the component

interface TimeSlot {
  start: string; // ISO string
  end: string; // ISO string
}

interface SlotData {
  id: string;
  creatorName: string;
  meetingPurpose: string;
  timeSlots: TimeSlot[];
  timezone: string;
  expiresAt: string;
  status: string;
  maxBookings: number;
  bookingsCount: number;
  expirationDays: number;
  bookingMode: 'individual' | 'group';
  bookedTimeSlotIndices: number[];
  meetingLocation?: MeetingLocation;
}

interface ApiResponse {
  success?: boolean;
  slot?: SlotData;
  error?: string;
  message?: string;
  status?: string;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const slotId = params.slotId as string;

  const [slotData, setSlotData] = useState<SlotData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [userTimezone, setUserTimezone] = useState<string>('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [viewInCreatorTimezone, setViewInCreatorTimezone] = useState(false);

  // Booking form state
  const [bookerName, setBookerName] = useState('');
  const [bookerEmail, setBookerEmail] = useState('');
  const [bookerNote, setBookerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ name: false, email: false });

  const fetchSlotData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/slots/${slotId}`);
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 404) {
          setError(data.message || 'This link does not exist or has expired.');
        } else if (response.status === 410) {
          setError(data.message || 'This link is no longer available.');
        } else {
          setError(data.error || 'Failed to load booking information.');
        }
        return;
      }

      if (data.success && data.slot) {
        setSlotData(data.slot);
      }
    } catch (err) {
      console.error('Error fetching slot:', err);
      setError('Failed to load booking information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [slotId]);

  useEffect(() => {
    // Detect user timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(tz);

    // Fetch slot data
    fetchSlotData();
  }, [fetchSlotData]);

  const handleSlotSelect = (index: number) => {
    setSelectedSlot(index);
    setShowBookingForm(false);
    setBookingError(null);
  };

  const handleContinue = () => {
    if (selectedSlot !== null) {
      setShowBookingForm(true);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark fields as touched
    setTouched({ name: true, email: true });
    setBookingError(null);

    // Validate
    if (!bookerName.trim()) {
      setBookingError('Please enter your name');
      return;
    }

    if (!bookerEmail.trim() || !bookerEmail.includes('@')) {
      setBookingError('Please enter a valid email address');
      return;
    }

    if (selectedSlot === null || !slotData) {
      setBookingError('Please select a time slot');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call booking API
      const response = await fetch(`/api/slots/${slotId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedTimeSlotIndex: selectedSlot,
          bookerName: bookerName.trim(),
          bookerEmail: bookerEmail.trim(),
          bookerNote: bookerNote.trim() || undefined,
          timezone: userTimezone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Booking failed');
      }

      if (data.success) {
        // Success! Store booking data and navigate to confirmation page
        console.log('Booking successful:', data);

        // Store booking data in sessionStorage for confirmation page
        sessionStorage.setItem(`booking_${slotId}`, JSON.stringify({
          slotId,
          selectedTime: data.booking.selectedTime,
          bookerName: data.booking.bookerName,
          bookerEmail: data.booking.bookerEmail,
          creatorName: data.booking.creatorName,
          creatorEmail: data.booking.creatorEmail,
          meetingPurpose: data.booking.meetingPurpose,
          meetingLocation: data.booking.meetingLocation,
          bookerNote: bookerNote.trim() || undefined,
          bookerTimezone: userTimezone,
        }));

        // Navigate to confirmation page
        router.push(`/booked/${slotId}`);
      }
    } catch (err) {
      console.error('Booking error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to book this slot. Please try again.';
      setBookingError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading availability...</p>
        </div>
      </div>
    );
  }

  // Error state (expired, not found, already booked)
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-16 relative z-10">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Scheduling Link Unavailable
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              {error}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/')}
                className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Create Your Own Scheduling Link
              </button>
              <p className="text-sm text-gray-500">
                WhenAvailable links expire based on their settings or when fully booked
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No slot data (shouldn't happen, but handle it)
  if (!slotData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No booking information available</p>
        </div>
      </div>
    );
  }

  // Determine which timezone to display based on toggle
  const displayTimezone = viewInCreatorTimezone ? slotData.timezone : userTimezone;

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
            <Link href="/" className="flex items-center gap-1 group">
              <img src="/logo.svg" alt="WhenAvailable" className="w-10 h-10 group-hover:scale-105 transition-transform" />
              <span className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                WhenAvailable
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">📅</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Book Time with {slotData.creatorName}
          </h1>
          {slotData.meetingPurpose && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              <span className="font-medium">{slotData.meetingPurpose}</span>
            </div>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8 mb-8">
          {/* Timezone Info with Toggle */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-blue-900">
                <strong>🌍 Times shown in:</strong>{' '}
                <span className="font-mono">
                  {viewInCreatorTimezone
                    ? `${getTimezoneAbbr(slotData.timezone)} (${slotData.creatorName}'s timezone)`
                    : `${getTimezoneAbbr(userTimezone)} (your timezone)`}
                </span>
              </p>
              <button
                onClick={() => setViewInCreatorTimezone(!viewInCreatorTimezone)}
                className="text-xs bg-white hover:bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg border border-blue-300 transition-colors"
              >
                {viewInCreatorTimezone ? '← View in your timezone' : `View in ${slotData.creatorName}'s timezone →`}
              </button>
            </div>
          </div>

          {/* Meeting Location */}
          {slotData.meetingLocation && (
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm font-semibold text-purple-900 mb-2">
                📍 Meeting Location
              </p>
              {slotData.meetingLocation.type === 'phone' && (
                <div className="text-purple-800">
                  <p className="font-medium">📞 Phone Call</p>
                  {slotData.meetingLocation.details.phoneNumber && (
                    <p className="text-sm mt-1">
                      Number: <span className="font-mono">{slotData.meetingLocation.details.phoneNumber}</span>
                    </p>
                  )}
                </div>
              )}
              {slotData.meetingLocation.type === 'in-person' && (
                <div className="text-purple-800">
                  <p className="font-medium">📍 In-Person Meeting</p>
                  {slotData.meetingLocation.details.address && (
                    <p className="text-sm mt-1 whitespace-pre-line">{slotData.meetingLocation.details.address}</p>
                  )}
                </div>
              )}
              {slotData.meetingLocation.type === 'custom' && (
                <div className="text-purple-800">
                  <p className="font-medium">🔗 {slotData.meetingLocation.details.customLinkLabel || 'Video Call'}</p>
                  {slotData.meetingLocation.details.customLink && (
                    <a
                      href={slotData.meetingLocation.details.customLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 underline break-all mt-1 block"
                    >
                      {slotData.meetingLocation.details.customLink}
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Available Slots */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Select a time slot
            </h2>
            <div className="space-y-3">
              {slotData.timeSlots.map((slot, index) => {
                // Filter out booked slots in individual mode
                if (slotData.bookingMode === 'individual') {
                  const bookedIndices = slotData.bookedTimeSlotIndices || [];
                  if (bookedIndices.includes(index)) {
                    return null; // Skip this slot
                  }
                }
                const startDate = new Date(slot.start);
                const endDate = new Date(slot.end);
                const isSelected = selectedSlot === index;

                // Format dates
                const dateStr = formatInTimezone(startDate, displayTimezone, 'EEEE, MMMM d, yyyy');
                const startTime = formatInTimezone(startDate, displayTimezone, 'h:mm a');
                const endTime = formatInTimezone(endDate, displayTimezone, 'h:mm a');

                return (
                  <button
                    key={index}
                    onClick={() => handleSlotSelect(index)}
                    className={`w-full p-5 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-base mb-1">
                          {dateStr}
                        </p>
                        <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                          {startTime} - {endTime} ({getTimezoneAbbr(displayTimezone)})
                        </p>
                        {slotData.maxBookings > 1 && (
                          <p className={`text-xs mt-1 flex items-center gap-1 ${
                            slotData.bookingsCount >= slotData.maxBookings * 0.8
                              ? 'text-orange-600 font-medium'
                              : 'text-gray-500'
                          }`}>
                            <span>👥</span>
                            {slotData.maxBookings - slotData.bookingsCount > 0 ? (
                              <>
                                {slotData.maxBookings - slotData.bookingsCount} {slotData.maxBookings - slotData.bookingsCount === 1 ? 'spot' : 'spots'} remaining ({slotData.bookingsCount}/{slotData.maxBookings} booked)
                                {slotData.bookingsCount >= slotData.maxBookings * 0.8 && (
                                  <span className="ml-1">⚠️ Filling up fast!</span>
                                )}
                              </>
                            ) : (
                              <>Fully booked ({slotData.maxBookings}/{slotData.maxBookings})</>
                            )}
                          </p>
                        )}
                      </div>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continue Button or Booking Form */}
          {!showBookingForm ? (
            <button
              disabled={selectedSlot === null}
              onClick={handleContinue}
              className={`w-full py-4 font-semibold rounded-lg transition-all ${
                selectedSlot !== null
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedSlot !== null ? 'Continue →' : 'Select a time slot to continue'}
            </button>
          ) : (
            /* Booking Form */
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your information</h3>
                <p className="text-sm text-gray-600">
                  Enter your details to confirm the booking
                </p>
              </div>

              {/* Selected Slot Display */}
              {selectedSlot !== null && slotData && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-semibold mb-1">
                    📅 Your selected time:
                  </p>
                  <p className="text-green-900 font-medium">
                    {formatInTimezone(new Date(slotData.timeSlots[selectedSlot].start), displayTimezone, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-green-900">
                    {formatInTimezone(new Date(slotData.timeSlots[selectedSlot].start), displayTimezone, 'h:mm a')} -{' '}
                    {formatInTimezone(new Date(slotData.timeSlots[selectedSlot].end), displayTimezone, 'h:mm a')}{' '}
                    ({getTimezoneAbbr(displayTimezone)})
                  </p>
                  <button
                    onClick={() => {
                      setShowBookingForm(false);
                      setBookingError(null);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 underline mt-2"
                  >
                    ← Choose a different time
                  </button>
                </div>
              )}

              {/* Error Display */}
              {bookingError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">
                    ⚠️ {bookingError}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Alex Rodriguez"
                    value={bookerName}
                    onChange={(e) => setBookerName(e.target.value)}
                    onBlur={() => setTouched({ ...touched, name: true })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400 ${
                      touched.name && !bookerName.trim()
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    disabled={isSubmitting}
                  />
                  {touched.name && !bookerName.trim() && (
                    <p className="text-xs text-red-600 mt-1">Name is required</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={bookerEmail}
                    onChange={(e) => setBookerEmail(e.target.value)}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400 ${
                      touched.email && (!bookerEmail.trim() || !bookerEmail.includes('@'))
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    disabled={isSubmitting}
                  />
                  {touched.email && !bookerEmail.trim() && (
                    <p className="text-xs text-red-600 mt-1">Email is required</p>
                  )}
                  {touched.email && bookerEmail.trim() && !bookerEmail.includes('@') && (
                    <p className="text-xs text-red-600 mt-1">Please enter a valid email</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    You'll receive a confirmation email with calendar invite
                  </p>
                </div>

                {/* Note Input (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add a note (optional)
                  </label>
                  <textarea
                    placeholder="e.g., Looking forward to our meeting!"
                    value={bookerNote}
                    onChange={(e) => setBookerNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-all resize-none bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This note will be shared with {slotData?.creatorName || 'the creator'}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !bookerName.trim() || !bookerEmail.trim() || !bookerEmail.includes('@')}
                  className={`w-full py-4 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    isSubmitting || !bookerName.trim() || !bookerEmail.trim() || !bookerEmail.includes('@')
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Confirming Booking...
                    </>
                  ) : (
                    <>
                      <span>✅</span>
                      Confirm Booking
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>ℹ️</span> What happens next?
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Enter your name and email</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Both you and {slotData.creatorName} will receive email confirmations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Calendar invites (.ics files) will be attached to make it easy to add to your calendar</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                4
              </span>
              <span>
                {slotData.maxBookings > 1 ? (
                  <>This link allows up to {slotData.maxBookings} bookings and expires when all slots are filled or after {slotData.expirationDays} {slotData.expirationDays === 1 ? 'day' : 'days'}</>
                ) : (
                  <>This link will expire immediately after booking (one-time use)</>
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
