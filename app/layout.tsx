import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { CookieConsent } from "@/components/cookie-consent";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhenAvailable - Share Availability Instantly | No Signup Required",
  description: "WhenAvailable creates temporary scheduling links that expire after booking. Perfect for temporary scheduling of meetings, interviews, and appointments. No signup, no data storage.",
  keywords: [
    "temporary scheduling",
    "temporary scheduling link",
    "temporary scheduling tool",
    "temporary scheduling software",
    "temporary appointment scheduling",
    "temporary meeting scheduler",
    "temporary calendar scheduling",
    "disposable calendar",
    "quick booking",
    "share availability",
    "no signup scheduling",
    "temporary meeting link",
    "one-time booking link",
    "instant scheduling",
    "privacy-first scheduling",
    "ephemeral calendar link",
  ],
  authors: [{ name: "WhenAvailable" }],
  creator: "WhenAvailable",
  publisher: "WhenAvailable",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://whenavailable.app'),
  openGraph: {
    title: "WhenAvailable - Share Availability Instantly | No Signup Required",
    description: "Create temporary scheduling links that expire after booking. Perfect for meetings, interviews, and appointments. No signup required.",
    type: "website",
    url: "/",
    siteName: "WhenAvailable",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WhenAvailable - Share Availability Instantly",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WhenAvailable - Share Availability Instantly",
    description: "Share your availability instantly. No signup required.",
    creator: "@whenavailable",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification code here
    // After you click CONTINUE in Google Search Console, you'll get a code
    // Paste it here like: google: 'ABC123xyz...'
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://whenavailable.app';

  // Schema.org JSON-LD structured data
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "WhenAvailable",
    "url": baseUrl,
    "description": "WhenAvailable is a temporary scheduling tool for creating disposable meeting links. Create temporary scheduling links that expire after booking. Perfect for temporary appointment scheduling, job interviews, and one-time meetings. No signup, no data storage.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Temporary scheduling links",
      "Temporary appointment scheduling",
      "Temporary meeting scheduler",
      "No signup required",
      "Natural language time input",
      "Automatic timezone detection",
      "Links expire after booking",
      "Email notifications",
      "Calendar file (.ics) generation"
    ]
  };

  // Organization Schema for brand recognition
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "WhenAvailable",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/og-image.png`,
      "width": 1200,
      "height": 630
    },
    "description": "WhenAvailable provides temporary scheduling solutions for privacy-first meeting coordination. Create disposable scheduling links that expire after use.",
    "sameAs": [
      "https://twitter.com/whenavailable"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": baseUrl
    }
  };

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* WebApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="md:col-span-2">
                <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-3">
                  <img src="/logo-256.png" alt="WhenAvailable" className="w-8 h-8" />
                  WhenAvailable
                </Link>
                <p className="text-sm text-gray-600 max-w-md leading-relaxed">
                  Create temporary scheduling links in seconds. No signup required. Privacy-first meeting coordination.
                </p>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">Product</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Create Scheduling Link
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/support" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">Legal</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-200 mt-10 pt-8 text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} WhenAvailable. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Cookie Consent Banner */}
        <CookieConsent />

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
