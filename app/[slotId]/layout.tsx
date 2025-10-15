import type { Metadata } from "next";
import { GoogleAdSense } from "@/components/google-adsense";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Book a Time Slot - WhenAvailable",
    description: "Select from available time slots to book a meeting. Quick and easy scheduling with automatic email confirmations.",
    openGraph: {
      title: "Book a Time Slot - WhenAvailable",
      description: "Select from available time slots to book a meeting.",
      type: "website",
    },
    robots: {
      index: false, // Don't index individual booking pages (temporary)
      follow: true,
    },
  };
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleAdSense />
      {children}
    </>
  );
}
