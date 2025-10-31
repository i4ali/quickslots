import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300">404</div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or may have expired.
        </p>

        {/* Common Reasons */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 text-left">
          <h2 className="font-semibold text-gray-900 mb-3">
            Possible reasons:
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>This scheduling link has expired (24-hour limit)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>This slot has already been booked</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>The scheduling link was typed incorrectly</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Your Own Scheduling Link
        </Link>

        {/* Footer Text */}
        <p className="text-sm text-gray-500 mt-8">
          WhenAvailable - Temporary scheduling links that expire after booking
        </p>
      </div>
    </main>
  );
}

export const metadata = {
  title: '404 - Page Not Found | WhenAvailable',
  description: 'The page you are looking for does not exist or has expired.',
};
