'use client';

import { useState } from 'react';

interface TipButtonProps {
  className?: string;
}

export function TipButton({ className = '' }: TipButtonProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predefinedAmounts = [2, 5];

  const handleTip = async (amount: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tips/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create tip session');
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process tip. Please try again.';
      setError(errorMessage);
      console.error('Error processing tip:', err);
      setIsLoading(false);
    }
  };

  const handleCustomTip = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount < 1) {
      setError('Please enter a valid amount ($1 minimum)');
      return;
    }
    handleTip(amount);
  };

  return (
    <div className={`bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-100 mb-2">
          ☕ Love QuickSlots?
        </h3>
        <p className="text-sm text-gray-300">
          Help keep this free tool running! Tips do not remove ads or unlock features.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-sm text-red-400">⚠️ {error}</p>
        </div>
      )}

      {/* Predefined Amounts */}
      <div className="flex gap-3 mb-4">
        {predefinedAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => {
              setSelectedAmount(amount);
              setError(null);
              handleTip(amount);
            }}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              isLoading && selectedAmount === amount
                ? 'bg-blue-600/50 text-white cursor-wait'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
            }`}
          >
            {isLoading && selectedAmount === amount ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                Processing...
              </span>
            ) : (
              `$${amount}`
            )}
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCustomTip();
              }
            }}
            disabled={isLoading}
            className="w-full pl-8 pr-4 py-3 bg-slate-900/70 border-2 border-slate-500 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        <button
          onClick={handleCustomTip}
          disabled={isLoading || !customAmount}
          className="px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading && selectedAmount === null ? (
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
          ) : (
            'Tip'
          )}
        </button>
      </div>

      {/* Footer Message */}
      <p className="text-xs text-gray-400 text-center mt-4">
        💝 Your support helps keep QuickSlots free for everyone
      </p>
    </div>
  );
}
