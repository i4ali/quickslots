import { notFound } from 'next/navigation';

interface BookingPageProps {
  params: Promise<{
    slotId: string;
  }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { slotId } = await params;

  // TODO: Fetch slot data from Redis in future stories
  // For now, show a placeholder booking page

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book Time with [Creator Name]
          </h1>
          <p className="text-gray-600">
            Select a time slot that works for you
          </p>
        </div>

        {/* Booking Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            {/* Slot Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Booking ID: <span className="font-mono font-semibold">{slotId}</span>
              </p>
            </div>

            {/* Placeholder Content */}
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
              <p className="text-gray-500 mb-2">Booking page coming soon!</p>
              <p className="text-sm text-gray-400">
                This page will display available time slots and booking form.
              </p>
            </div>

            {/* Info */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">📅</span>
                  <span>Select your preferred time slot</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✉️</span>
                  <span>Enter your name and email</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Receive instant confirmation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Powered by QuickSlots - Temporary scheduling made simple
        </p>
      </div>
    </main>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BookingPageProps) {
  const { slotId } = await params;

  return {
    title: 'Book a Time Slot - QuickSlots',
    description: 'Select a time that works for you to schedule this meeting.',
  };
}
