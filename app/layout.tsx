import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickSlots - Temporary Scheduling Links",
  description: "Share your availability in seconds. No signup required.",
  keywords: ["scheduling", "temporary link", "calendar", "booking", "availability", "no signup"],
  openGraph: {
    title: "QuickSlots - Temporary Scheduling Links",
    description: "Share your availability in seconds. No signup required.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
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
                    <span className="text-gray-600">Privacy Policy (Coming Soon)</span>
                  </li>
                  <li>
                    <span className="text-gray-600">Terms of Service (Coming Soon)</span>
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
      </body>
    </html>
  );
}
