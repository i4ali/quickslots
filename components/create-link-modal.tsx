'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SlotManager } from '@/components/slot-manager';
import { TimeSlot } from '@/components/availability-input';
import { TimezoneSelector } from '@/components/timezone-selector';
import { MeetingLocationSelector } from '@/components/meeting-location-selector';
import { isValidEmail, getEmailError, getNameError, getPurposeError } from '@/lib/validation';
import { getUserTimezone } from '@/lib/timezone';
import { convertToApiTimeSlots } from '@/lib/slot-utils';
import { CreateSlotResponse, BookingMode, MeetingLocation } from '@/types/slot';
import { useRouter } from 'next/navigation';

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateLinkModal({ isOpen, onClose }: CreateLinkModalProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [timezone, setTimezone] = useState(() => getUserTimezone());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ name: false, email: false, purpose: false, inviteeLimit: false });

  // Multi-booking and extended duration settings
  const [expirationDays, setExpirationDays] = useState(1);
  const [maxBookings, setMaxBookings] = useState(1);
  const [bookingMode, setBookingMode] = useState<BookingMode>('individual');

  // Meeting location
  const [meetingLocation, setMeetingLocation] = useState<MeetingLocation | null>(null);

  // Validation
  const emailError = touched.email ? getEmailError(email) : null;
  const nameError = touched.name ? getNameError(name) : null;
  const purposeError = touched.purpose ? getPurposeError(purpose) : null;

  const inviteeLimitError = touched.inviteeLimit && (maxBookings < 1 || maxBookings > 20)
    ? maxBookings < 1
      ? 'Must be at least 1 invitee'
      : 'Maximum 20 invitees allowed'
    : null;

  const canGenerateLink = isValidEmail(email) && slots.length > 0 && !nameError && !purposeError && !inviteeLimitError;

  const handleGenerateLink = async () => {
    setTouched({ name: true, email: true, purpose: true, inviteeLimit: true });
    setError(null);

    if (!canGenerateLink) {
      setError('Please fix the errors above before generating a link');
      return;
    }

    setIsLoading(true);

    try {
      const apiTimeSlots = convertToApiTimeSlots(slots);

      const response = await fetch('/api/slots/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorName: name.trim() || undefined,
          creatorEmail: email.trim(),
          meetingPurpose: purpose.trim() || undefined,
          timeSlots: apiTimeSlots,
          timezone,
          maxBookings,
          expirationDays,
          bookingMode,
          meetingLocation,
        }),
      });

      const data: CreateSlotResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as any).error || 'Failed to create scheduling link');
      }

      if (data.success) {
        console.log('Link created successfully:', data);
        router.push(`/created/${data.slotId}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate scheduling link. Please try again.';
      setError(errorMessage);
      console.error('Error generating link:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] my-8 relative overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center group"
                aria-label="Close"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="overflow-y-auto flex-1 p-8 sm:p-10">
                <div className="mb-6 text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Scheduling Link</h2>
                  <p className="text-gray-600">Fill in your details and availability to generate your link</p>
                </div>

                <div className="space-y-6">
                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-600 font-medium">
                        ⚠️ {error}
                      </p>
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Sarah Chen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setTouched({ ...touched, name: true })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400 ${
                          nameError
                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        }`}
                      />
                      {nameError && (
                        <p className="text-xs text-red-600 mt-1">{nameError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched({ ...touched, email: true })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400 ${
                          emailError
                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        }`}
                      />
                      {emailError && (
                        <p className="text-xs text-red-600 mt-1">{emailError}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meeting Purpose (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Coffee chat"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        onBlur={() => setTouched({ ...touched, purpose: true })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400 ${
                          purposeError
                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                        }`}
                      />
                      {purposeError && (
                        <p className="text-xs text-red-600 mt-1">{purposeError}</p>
                      )}
                    </div>

                    {/* Timezone Selector */}
                    <TimezoneSelector value={timezone} onChange={setTimezone} />

                    {/* Scheduling Link Settings */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">⚙️</span>
                        <h3 className="text-sm font-semibold text-gray-900">Scheduling Link Settings</h3>
                      </div>

                      <div className="space-y-4">
                        {/* Link Duration */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link Duration
                          </label>
                          <select
                            value={expirationDays}
                            onChange={(e) => setExpirationDays(Number(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900"
                          >
                            <option value={1}>24 hours</option>
                            <option value={3}>3 days</option>
                            <option value={7}>7 days</option>
                          </select>
                        </div>

                        {/* Invitee Limit */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Invitee Limit
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={maxBookings}
                            onChange={(e) => setMaxBookings(Number(e.target.value))}
                            onBlur={() => setTouched({ ...touched, inviteeLimit: true })}
                            placeholder="e.g., 5"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all bg-white text-gray-900 placeholder-gray-400 ${
                              inviteeLimitError
                                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                            }`}
                          />
                          {inviteeLimitError ? (
                            <p className="text-xs text-red-600 mt-1">{inviteeLimitError}</p>
                          ) : (
                            <p className="text-xs text-gray-500 mt-1">Maximum: 20 invitees (not including you)</p>
                          )}
                        </div>

                        {/* Booking Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Booking Type
                          </label>
                          <select
                            value={bookingMode}
                            onChange={(e) => setBookingMode(e.target.value as BookingMode)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900"
                          >
                            <option value="individual">Individual (1-on-1) - Each slot can only be booked by one invitee</option>
                            <option value="group">Group - Multiple invitees can book the same slot</option>
                          </select>
                        </div>

                        {/* Info Text */}
                        <div className="bg-white rounded-lg p-3 text-xs text-gray-600 leading-relaxed">
                          <p className="flex items-start gap-2">
                            <span className="flex-shrink-0">ℹ️</span>
                            <span>
                              {bookingMode === 'individual' ? (
                                <>
                                  <strong>Individual mode:</strong> Each time slot can only be booked once. Once a slot is booked, it disappears for others.
                                  {maxBookings > 1 && ` Link allows up to ${maxBookings} ${maxBookings === 1 ? 'invitee' : 'invitees'} total (not including you).`}
                                  {` Link expires when ${maxBookings > 1 ? `all ${maxBookings} invitees book` : '1 invitee books'} or after ${expirationDays} ${expirationDays === 1 ? 'day' : 'days'}.`}
                                </>
                              ) : (
                                <>
                                  <strong>Group mode:</strong> Multiple invitees can book the same time slot(s). All time slots remain visible until link expires.
                                  {` Link expires when ${maxBookings} ${maxBookings === 1 ? 'invitee books' : 'invitees book'} (not including you) or after ${expirationDays} ${expirationDays === 1 ? 'day' : 'days'}.`}
                                </>
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Meeting Location Selector */}
                    <MeetingLocationSelector
                      value={meetingLocation}
                      onChange={setMeetingLocation}
                    />

                    {/* Slot Manager Component */}
                    <SlotManager onSlotsChange={setSlots} />
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleGenerateLink}
                    disabled={!canGenerateLink || isLoading}
                    className={`w-full py-4 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-base ${
                      canGenerateLink && !isLoading
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
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
                        Creating your scheduling link...
                      </>
                    ) : canGenerateLink ? (
                      'Create Your Scheduling Link'
                    ) : (
                      'Enter email and availability to continue'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
