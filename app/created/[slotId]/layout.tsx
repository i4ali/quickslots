import type { Metadata } from "next";
import { GoogleAdSense } from "@/components/google-adsense";

export const metadata: Metadata = {
  title: "Link Created - WhenAvailable",
  description: "Your scheduling link has been created. Share it to let others book time with you.",
  openGraph: {
    title: "Link Created - WhenAvailable",
    description: "Your scheduling link has been created and is ready to share.",
    type: "website",
  },
  robots: {
    index: false, // Don't index individual link pages (temporary)
    follow: true,
  },
};

export default function CreatedLayout({
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
