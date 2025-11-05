import type { Metadata } from 'next';
import Link from 'next/link';
import { TipButton } from '@/components/tip-button';

export const metadata: Metadata = {
  title: 'Support WhenAvailable | Help Keep It Free',
  description: 'Love WhenAvailable? Support us to help keep this scheduling tool free for everyone. Your contributions help cover hosting and development costs.',
  alternates: {
    canonical: '/support',
  },
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/90 backdrop-blur-md relative z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-0 group">
              <img src="/logo.svg" alt="WhenAvailable" className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-105 transition-transform" />
              <span className="text-base sm:text-xl lg:text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
                WhenAvailable
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              <Link href="/blog" className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors px-2 sm:px-4 py-2 rounded-lg hover:bg-blue-50">
                Blog
              </Link>
              <Link href="/support" className="text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 transition-colors px-2 sm:px-4 py-2 rounded-lg">
                Support
              </Link>
              <a
                href="https://github.com/i4ali/quickslots/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex text-xs sm:text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors px-2 sm:px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                Report an Issue
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            Support WhenAvailable
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Help keep this tool free and accessible for everyone
          </p>
        </div>

        {/* Why Support Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Support?</h2>
          <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
            <p>
              WhenAvailable is <strong className="text-gray-900">100% free</strong> with no ads, no premium tiers, and no hidden costs.
              We believe scheduling should be simple and accessible to everyone.
            </p>
            <p>
              Your support helps us:
            </p>
            <ul className="space-y-3 ml-6">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">✓</span>
                <span>Cover hosting and infrastructure costs</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">✓</span>
                <span>Maintain and improve the service</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">✓</span>
                <span>Keep the platform ad-free</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">✓</span>
                <span>Add new features and improvements</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tip Button */}
        <TipButton className="mb-12" />

        {/* Other Ways to Help */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border border-indigo-100 p-8 sm:p-10 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Other Ways to Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">📢</div>
              <h3 className="font-bold text-gray-900 mb-2 text-xl">Spread the Word</h3>
              <p className="text-gray-600">
                Share WhenAvailable with friends, colleagues, and on social media
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-bold text-gray-900 mb-2 text-xl">Share Feedback</h3>
              <p className="text-gray-600">
                Help us improve by{' '}
                <a
                  href="https://github.com/i4ali/quickslots/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  reporting bugs
                </a>
                {' '}or suggesting features
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="font-bold text-gray-900 mb-2 text-xl">Star on GitHub</h3>
              <p className="text-gray-600">
                Give us a star on{' '}
                <a
                  href="https://github.com/i4ali/quickslots"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  GitHub
                </a>
                {' '}to show your support
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">👨‍💻</div>
              <h3 className="font-bold text-gray-900 mb-2 text-xl">Contribute Code</h3>
              <p className="text-gray-600">
                WhenAvailable is open source. Contributions are always welcome!
              </p>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="text-center bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-5xl mb-4">💙</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your support means the world to us and helps keep WhenAvailable free for everyone.
            Whether you tip, share, or simply use the service, we appreciate you!
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-lg shadow-md hover:shadow-lg"
            >
              Create a Scheduling Link
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
