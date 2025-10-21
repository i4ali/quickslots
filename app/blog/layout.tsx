import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - WhenAvailable",
  description: "Tips, guides, and best practices for scheduling meetings efficiently. Learn about privacy-first scheduling tools and alternatives to traditional calendar apps.",
  openGraph: {
    title: "Blog - WhenAvailable",
    description: "Tips, guides, and best practices for scheduling meetings efficiently.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': 0,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Blog Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Back to WhenAvailable
          </Link>
        </div>
      </header>

      {/* Blog Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      {/* Blog Footer CTA */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to try WhenAvailable?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Create temporary scheduling links in seconds. No signup required.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </footer>
    </div>
  );
}
