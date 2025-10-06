export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            ⚡ QuickSlots
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-2">
            Share your availability in seconds
          </p>
          <p className="text-gray-500">
            No signup. Link expires after booking.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-12">
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 text-center">
                <strong>Coming Soon:</strong> Natural language availability input
                <br />
                <span className="text-blue-600">
                  (e.g., "tomorrow 2-4pm", "next Friday at 3pm")
                </span>
              </p>
            </div>

            {/* Form Placeholder */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sarah Chen"
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Meeting Purpose (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Coffee chat"
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  When are you available?
                </label>
                <input
                  type="text"
                  placeholder='Try: "tomorrow 2-4pm" or "Friday at 3pm"'
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Natural language input powered by chrono-node
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              disabled
              className="w-full py-4 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
            >
              Generate Link (Coming Soon)
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-1">Instant</h3>
            <p className="text-sm text-gray-600">Create links in seconds</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-1">Private</h3>
            <p className="text-sm text-gray-600">No signup required</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">⏰</div>
            <h3 className="font-semibold text-gray-900 mb-1">Temporary</h3>
            <p className="text-sm text-gray-600">Expires after 24 hours</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-3xl mb-2">🗑️</div>
            <h3 className="font-semibold text-gray-900 mb-1">Zero Data</h3>
            <p className="text-sm text-gray-600">Auto-deleted forever</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share Availability</h3>
              <p className="text-sm text-gray-600">
                Type when you're free in plain English
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share Your Link</h3>
              <p className="text-sm text-gray-600">
                Send the link via email, text, or chat
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Confirmed</h3>
              <p className="text-sm text-gray-600">
                Both parties receive email confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Development Status */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium">Story 1.5 Complete:</span>
            <span>Basic Routing & Layout ✓</span>
          </div>
        </div>
      </div>
    </main>
  );
}
