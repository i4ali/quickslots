'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatInTimezone, getTimezoneAbbr } from '@/lib/timezone';

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

  // Booking form state
  const [bookerName, setBookerName] = useState('');
  const [bookerEmail, setBookerEmail] = useState('');
  const [bookerNote, setBookerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ name: false, email: false });

  useEffect(() => {
    // Detect user timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(tz);

    // Fetch slot data
    fetchSlotData();
  }, [slotId]);

  const fetchSlotData = async () => {
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
  };

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading availability...</p>
        </div>
      </div>
    );
  }

  // Error state (expired, not found, already booked)
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-red-500/50 p-8 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-3xl font-bold text-gray-100 mb-3">
              Link Unavailable
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              {error}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/')}
                className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your Own Link
              </button>
              <p className="text-sm text-gray-400">
                WhenAvailable links expire after 24 hours or once booked
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">No booking information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📅</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3">
            Book Time with {slotData.creatorName}
          </h1>
          {slotData.meetingPurpose && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-300 rounded-full border border-blue-500/30">
              <span className="font-medium">{slotData.meetingPurpose}</span>
            </div>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 sm:p-8 mb-8">
          {/* Timezone Info */}
          <div className="mb-6 p-4 bg-purple-600/10 border border-purple-500/30 rounded-lg">
            <p className="text-sm text-purple-300">
              <strong>🌍 Times shown in your timezone:</strong>{' '}
              <span className="font-mono">{getTimezoneAbbr(userTimezone)}</span>
            </p>
          </div>

          {/* Available Slots */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-100 mb-4">
              Select a Time Slot
            </h2>
            <div className="space-y-3">
              {slotData.timeSlots.map((slot, index) => {
                const startDate = new Date(slot.start);
                const endDate = new Date(slot.end);
                const isSelected = selectedSlot === index;

                // Format dates
                const dateStr = formatInTimezone(startDate, userTimezone, 'EEEE, MMMM d, yyyy');
                const startTime = formatInTimezone(startDate, userTimezone, 'h:mm a');
                const endTime = formatInTimezone(endDate, userTimezone, 'h:mm a');

                return (
                  <button
                    key={index}
                    onClick={() => handleSlotSelect(index)}
                    className={`w-full p-5 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600/20 shadow-lg scale-105'
                        : 'border-slate-600 bg-slate-900/50 hover:border-blue-500/50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-100 text-lg mb-1">
                          {dateStr}
                        </p>
                        <p className={`text-sm ${isSelected ? 'text-blue-300' : 'text-gray-400'}`}>
                          {startTime} - {endTime} ({getTimezoneAbbr(userTimezone)})
                        </p>
                      </div>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-600 bg-slate-900'
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
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                  : 'bg-slate-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedSlot !== null ? 'Continue to Booking →' : 'Select a time slot to continue'}
            </button>
          ) : (
            /* Booking Form */
            <div className="border-t-2 border-slate-700 pt-8 mt-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-100 mb-2">Your Information</h3>
                <p className="text-sm text-gray-400">
                  Enter your details to confirm the booking
                </p>
              </div>

              {/* Selected Slot Display */}
              {selectedSlot !== null && slotData && (
                <div className="mb-6 p-4 bg-emerald-600/10 border-2 border-emerald-500/30 rounded-lg">
                  <p className="text-sm text-emerald-400 font-semibold mb-1">
                    📅 Your Selected Time:
                  </p>
                  <p className="text-emerald-300 font-medium">
                    {formatInTimezone(new Date(slotData.timeSlots[selectedSlot].start), userTimezone, 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-emerald-300">
                    {formatInTimezone(new Date(slotData.timeSlots[selectedSlot].start), userTimezone, 'h:mm a')} -{' '}
                    {formatInTimezone(new Date(slotData.timeSlots[selectedSlot].end), userTimezone, 'h:mm a')}{' '}
                    ({getTimezoneAbbr(userTimezone)})
                  </p>
                  <button
                    onClick={() => {
                      setShowBookingForm(false);
                      setBookingError(null);
                    }}
                    className="text-sm text-emerald-400 hover:text-emerald-300 underline mt-2"
                  >
                    ← Choose a different time
                  </button>
                </div>
              )}

              {/* Error Display */}
              {bookingError && (
                <div className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/30 rounded-lg">
                  <p className="text-sm text-red-400 font-medium">
                    ⚠️ {bookingError}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Alex Rodriguez"
                    value={bookerName}
                    onChange={(e) => setBookerName(e.target.value)}
                    onBlur={() => setTouched({ ...touched, name: true })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-slate-900/50 text-gray-100 placeholder-gray-500 ${
                      touched.name && !bookerName.trim()
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    disabled={isSubmitting}
                  />
                  {touched.name && !bookerName.trim() && (
                    <p className="text-xs text-red-400 mt-1">Name is required</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Your Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={bookerEmail}
                    onChange={(e) => setBookerEmail(e.target.value)}
                    onBlur={() => setTouched({ ...touched, email: true })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-slate-900/50 text-gray-100 placeholder-gray-500 ${
                      touched.email && (!bookerEmail.trim() || !bookerEmail.includes('@'))
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                    disabled={isSubmitting}
                  />
                  {touched.email && !bookerEmail.trim() && (
                    <p className="text-xs text-red-400 mt-1">Email is required</p>
                  )}
                  {touched.email && bookerEmail.trim() && !bookerEmail.includes('@') && (
                    <p className="text-xs text-red-400 mt-1">Please enter a valid email</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    You'll receive a confirmation email with calendar invite
                  </p>
                </div>

                {/* Note Input (Optional) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Add a note (optional)
                  </label>
                  <textarea
                    placeholder="e.g., Looking forward to our meeting!"
                    value={bookerNote}
                    onChange={(e) => setBookerNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all resize-none bg-slate-900/50 text-gray-100 placeholder-gray-500 border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    This note will be shared with {slotData?.creatorName || 'the creator'}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !bookerName.trim() || !bookerEmail.trim() || !bookerEmail.includes('@')}
                  className={`w-full py-4 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    isSubmitting || !bookerName.trim() || !bookerEmail.trim() || !bookerEmail.includes('@')
                      ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg'
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
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-600/50 p-6">
          <h3 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <span>ℹ️</span> What Happens Next?
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold border border-blue-500/30">
                1
              </span>
              <span>Enter your name and email</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold border border-blue-500/30">
                2
              </span>
              <span>Both you and {slotData.creatorName} will receive email confirmations</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold border border-blue-500/30">
                3
              </span>
              <span>Calendar invites (.ics files) will be attached to make it easy to add to your calendar</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold border border-blue-500/30">
                4
              </span>
              <span>This link will expire immediately after booking (one-time use)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
