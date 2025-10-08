import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickSlots - Temporary Scheduling Links | Share Availability in Seconds",
  description: "Create temporary scheduling links that expire after booking. No signup, no data storage. Share your availability instantly for quick meetings, appointments, and one-time bookings.",
  keywords: [
    "temporary scheduling link",
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
  authors: [{ name: "QuickSlots" }],
  creator: "QuickSlots",
  publisher: "QuickSlots",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://quickslots.app'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "QuickSlots - Temporary Scheduling Links",
    description: "Share your availability in seconds. No signup required. Links expire after booking for maximum privacy.",
    type: "website",
    url: "/",
    siteName: "QuickSlots",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QuickSlots - Temporary Scheduling Links",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickSlots - Temporary Scheduling Links",
    description: "Share your availability in seconds. No signup required.",
    creator: "@quickslots",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://quickslots.app';

  // Schema.org JSON-LD structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "QuickSlots",
    "url": baseUrl,
    "description": "Create temporary scheduling links that expire after booking. No signup, no data storage.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Temporary scheduling links",
      "No signup required",
      "Natural language time input",
      "Automatic timezone detection",
      "Links expire after booking",
      "Email notifications",
      "Calendar file (.ics) generation"
    ]
  };

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand */}
              <div>
                <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  ⚡ QuickSlots
                </Link>
                <p className="text-sm text-gray-600 mt-2">
                  Share your availability in seconds. No signup required.
                </p>
              </div>

              {/* Links */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                      Create Link
                    </Link>
                  </li>
                  <li>
                    <Link href="/api/health" className="text-gray-600 hover:text-blue-600 transition-colors">
                      System Status
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
                <ul className="space-y-2 text-sm">
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
            <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
              <p>© {new Date().getFullYear()} QuickSlots. All rights reserved.</p>
              <p className="mt-1">Temporary scheduling links that expire after booking.</p>
            </div>
          </div>
        </footer>

        {/* Cookie Consent Banner */}
        <CookieConsent />
      </body>
    </html>
  );
}
