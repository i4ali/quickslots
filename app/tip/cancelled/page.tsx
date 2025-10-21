import Link from 'next/link';

export default function TipCancelledPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto border-2 border-gray-300">
              <svg
                className="w-10 h-10 text-gray-600"
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
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tip Cancelled
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            No worries! Your support is always voluntary.
          </p>

          {/* Details */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-gray-700">
              WhenAvailable will always remain free. If you change your mind, you can support us anytime!
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              Create a Link
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
