'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  expiresAt: string; // ISO 8601 date string
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeRemaining(expiresAt: string): TimeRemaining {
  const now = Date.now();
  const expiration = new Date(expiresAt).getTime();
  const total = Math.max(0, expiration - now);

  const hours = Math.floor(total / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, total };
}

export function CountdownTimer({ expiresAt }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(expiresAt)
  );

  useEffect(() => {
    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(expiresAt);
      setTimeRemaining(remaining);

      // Stop the interval when time is up
      if (remaining.total <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (timeRemaining.total <= 0) {
    return (
      <p className="text-lg font-bold text-red-600">
        Expired
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Hours */}
      <div className="flex flex-col items-center">
        <div className="bg-blue-600 text-white px-3 py-2 rounded-lg min-w-[60px] text-center">
          <div className="text-2xl font-bold tabular-nums">
            {String(timeRemaining.hours).padStart(2, '0')}
          </div>
        </div>
        <span className="text-xs text-gray-600 mt-1">hours</span>
      </div>

      <span className="text-2xl font-bold text-blue-600">:</span>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <div className="bg-blue-600 text-white px-3 py-2 rounded-lg min-w-[60px] text-center">
          <div className="text-2xl font-bold tabular-nums">
            {String(timeRemaining.minutes).padStart(2, '0')}
          </div>
        </div>
        <span className="text-xs text-gray-600 mt-1">mins</span>
      </div>

      <span className="text-2xl font-bold text-blue-600">:</span>

      {/* Seconds */}
      <div className="flex flex-col items-center">
        <div className="bg-blue-600 text-white px-3 py-2 rounded-lg min-w-[60px] text-center">
          <div className="text-2xl font-bold tabular-nums">
            {String(timeRemaining.seconds).padStart(2, '0')}
          </div>
        </div>
        <span className="text-xs text-gray-600 mt-1">secs</span>
      </div>
    </div>
  );
}
