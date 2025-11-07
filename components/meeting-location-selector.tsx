'use client';

import { useState } from 'react';
import { MeetingLocation, MeetingLocationType } from '@/types/slot';

interface MeetingLocationSelectorProps {
  value: MeetingLocation | null;
  onChange: (location: MeetingLocation | null) => void;
}

export function MeetingLocationSelector({ value, onChange }: MeetingLocationSelectorProps) {
  const [locationType, setLocationType] = useState<MeetingLocationType | null>(
    value?.type || null
  );
  const [phoneNumber, setPhoneNumber] = useState(value?.details.phoneNumber || '');
  const [address, setAddress] = useState(value?.details.address || '');
  const [customLink, setCustomLink] = useState(value?.details.customLink || '');
  const [customLinkLabel, setCustomLinkLabel] = useState(value?.details.customLinkLabel || 'Video Call');

  const handleLocationTypeChange = (type: MeetingLocationType | null) => {
    setLocationType(type);

    if (!type) {
      onChange(null);
      return;
    }

    // Create initial meeting location object
    const location: MeetingLocation = {
      type,
      details: {},
    };

    onChange(location);
  };

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    if (locationType === 'phone') {
      onChange({
        type: 'phone',
        details: { phoneNumber: value },
      });
    }
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (locationType === 'in-person') {
      onChange({
        type: 'in-person',
        details: { address: value },
      });
    }
  };

  const handleCustomLinkChange = (link: string, label: string) => {
    setCustomLink(link);
    setCustomLinkLabel(label);
    if (locationType === 'custom') {
      onChange({
        type: 'custom',
        details: { customLink: link, customLinkLabel: label },
      });
    }
  };

  return (
    <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📍</span>
        <h3 className="text-sm font-semibold text-gray-900">Meeting Location (Optional)</h3>
      </div>

      <div className="space-y-3">
        {/* No location option */}
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
          <input
            type="radio"
            name="location"
            checked={locationType === null}
            onChange={() => handleLocationTypeChange(null)}
            className="w-4 h-4 text-purple-600"
          />
          <span className="text-gray-700">No location specified</span>
        </label>

        {/* Phone call option */}
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
          <input
            type="radio"
            name="location"
            checked={locationType === 'phone'}
            onChange={() => handleLocationTypeChange('phone')}
            className="w-4 h-4 text-purple-600"
          />
          <span>📞 Phone call</span>
        </label>

        {locationType === 'phone' && (
          <div className="ml-7 mb-2">
            <input
              type="tel"
              placeholder="Phone number (e.g., +1 234 567 8900)"
              value={phoneNumber}
              onChange={(e) => handlePhoneNumberChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
          </div>
        )}

        {/* In-person option */}
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
          <input
            type="radio"
            name="location"
            checked={locationType === 'in-person'}
            onChange={() => handleLocationTypeChange('in-person')}
            className="w-4 h-4 text-purple-600"
          />
          <span>📍 In-person meeting</span>
        </label>

        {locationType === 'in-person' && (
          <div className="ml-7 mb-2">
            <textarea
              placeholder="Address or location details"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none"
            />
          </div>
        )}

        {/* Custom link option */}
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white transition-colors">
          <input
            type="radio"
            name="location"
            checked={locationType === 'custom'}
            onChange={() => handleLocationTypeChange('custom')}
            className="w-4 h-4 text-purple-600"
          />
          <span>🔗 Custom video link</span>
        </label>

        {locationType === 'custom' && (
          <div className="ml-7 space-y-2 mb-2">
            <input
              type="text"
              placeholder="Label (e.g., Google Meet, Microsoft Teams)"
              value={customLinkLabel}
              onChange={(e) => handleCustomLinkChange(customLink, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
            <input
              type="url"
              placeholder="Video link (e.g., https://meet.google.com/...)"
              value={customLink}
              onChange={(e) => handleCustomLinkChange(e.target.value, customLinkLabel)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            />
          </div>
        )}
      </div>
    </div>
  );
}
