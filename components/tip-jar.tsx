'use client';

import { useState } from 'react';

export function TipJar() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const predefinedAmounts = [2, 5, 10];

  const handleTip = (amount: number) => {
    // TODO: In Story 3.2, integrate with Stripe/PayPal
    console.log('Tip amount:', amount);

    // Show thank you message
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      setSelectedAmount(null);
      setCustomAmount('');
    }, 3000);
  };

  const handleCustomTip = () => {
    const amount = parseFloat(customAmount);
    if (!isNaN(amount) && amount > 0) {
      handleTip(amount);
    }
  };

  if (showThankYou) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-green-200 p-8 mb-8 text-center">
        <div className="text-6xl mb-4">💚</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Thank You!
        </h3>
        <p className="text-gray-600">
          Your support helps keep WhenAvailable free for everyone
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-200 p-8 mb-8">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">☕</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Love WhenAvailable?
        </h3>
        <p className="text-gray-700">
          Help keep this service free and running for everyone!
        </p>
      </div>

      {/* Predefined Amounts */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {predefinedAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => setSelectedAmount(amount)}
            className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-all ${
              selectedAmount === amount
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-white text-purple-600 border-2 border-purple-300 hover:border-purple-600'
            }`}
          >
            ${amount}
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="number"
          placeholder="Custom amount"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setSelectedAmount(null);
          }}
          className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-600"
          min="1"
          step="0.01"
        />
      </div>

      {/* Tip Button */}
      <button
        onClick={() => {
          if (selectedAmount) {
            handleTip(selectedAmount);
          } else if (customAmount) {
            handleCustomTip();
          }
        }}
        disabled={!selectedAmount && !customAmount}
        className={`w-full py-4 font-semibold rounded-lg transition-all ${
          selectedAmount || customAmount
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {selectedAmount || customAmount ? '💝 Send Tip' : 'Select an amount'}
      </button>

      {/* Disclaimer */}
      <p className="text-xs text-gray-600 text-center mt-4">
        Tips are voluntary and don't unlock any features. This service will always be free!
      </p>

      {/* Development Note */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800 text-center">
          <strong>Development Note:</strong> Payment integration coming in Story 3.2 (Phase 3). Currently shows thank you message only.
        </p>
      </div>
    </div>
  );
}
