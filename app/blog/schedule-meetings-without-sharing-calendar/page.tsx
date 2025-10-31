import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Schedule Meetings Without Sharing Your Calendar | Privacy Guide",
  description: "Protect your privacy while scheduling meetings. Learn 5 proven methods to share availability without exposing your entire calendar to others.",
  keywords: ["schedule meeting without calendar", "privacy scheduling", "share availability without calendar", "meeting scheduler privacy"],
  openGraph: {
    title: "How to Schedule Meetings Without Sharing Your Calendar",
    description: "5 proven methods to share availability while protecting your calendar privacy.",
  },
};

export default function ScheduleWithoutSharingPost() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://whenavailable.app';

  return (
    <>
      <article className="prose prose-lg max-w-none">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
            Privacy
          </span>
          <span className="text-sm text-gray-500">6 min read</span>
          <span className="text-sm text-gray-400">•</span>
          <time className="text-sm text-gray-500">October 8, 2025</time>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          How to Schedule Meetings Without Sharing Your Calendar
        </h1>

        <p className="text-xl text-gray-600 leading-relaxed">
          Sharing your calendar can expose personal appointments, meeting patterns, and your daily schedule. Learn how to schedule meetings while keeping your calendar private.
        </p>
      </header>

      {/* Introduction */}
      <h2>Why You Shouldn't Share Your Calendar</h2>

      <p>
        When you share calendar access with others, you're revealing more than just your availability:
      </p>

      <ul>
        <li><strong>Personal appointments:</strong> Doctor visits, family time, personal commitments</li>
        <li><strong>Work patterns:</strong> When you're most productive, meeting frequency, work hours</li>
        <li><strong>Negotiating position:</strong> If your calendar looks empty, people may lowball offers</li>
        <li><strong>Security risks:</strong> Detailed schedules can reveal when you're away from home</li>
      </ul>

      <p>
        Fortunately, there are better ways to schedule meetings without compromising your privacy.
      </p>

      {/* Method 1 */}
      <h2>Method 1: Use Temporary Scheduling Links (Recommended)</h2>

      <p>
        The most privacy-friendly approach is using temporary, single-use scheduling links that expire after booking.
      </p>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 my-6 not-prose">
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          ⚡ Try WhenAvailable for Maximum Privacy
        </h3>
        <p className="text-gray-700 mb-4">
          Create a temporary scheduling link with your available times. Share it once, it gets booked, then it's gone forever. No calendar access needed.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span className="text-sm text-gray-700">No signup required</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span className="text-sm text-gray-700">Expires after booking</span>
          </div>
          <div className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span className="text-sm text-gray-700">Data auto-deletes</span>
          </div>
        </div>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Free Scheduling Link →
        </Link>
      </div>

      <p><strong>How it works:</strong></p>
      <ol>
        <li>Look at your calendar privately</li>
        <li>Create a scheduling link with 2-3 available time slots</li>
        <li>Send the scheduling link to the person you're meeting</li>
        <li>They pick a time, scheduling link expires, data gets deleted</li>
      </ol>

      <p><strong>Perfect for:</strong> Recruiters, sales calls, one-time consultations, job interviews</p>

      {/* Method 2 */}
      <h2>Method 2: Manually Propose Times via Email</h2>

      <p>
        The old-school method still works and gives you complete control over what you share.
      </p>

      <p><strong>Email template:</strong></p>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4 not-prose">
        <p className="text-sm font-mono text-gray-700 leading-relaxed">
          Hi [Name],<br /><br />
          I'd love to schedule a meeting. Here are my available times this week:<br /><br />
          • Tuesday, Oct 10 at 2:00 PM - 3:00 PM<br />
          • Wednesday, Oct 11 at 10:00 AM - 11:00 AM<br />
          • Thursday, Oct 12 at 3:30 PM - 4:30 PM<br /><br />
          Do any of these work for you? If not, please suggest alternative times.<br /><br />
          Best,<br />
          [Your name]
        </p>
      </div>

      <p><strong>Pros:</strong> Complete privacy control, works everywhere, no tools needed</p>
      <p><strong>Cons:</strong> Time-consuming, back-and-forth emails, doesn't scale</p>

      {/* Method 3 */}
      <h2>Method 3: Create a Separate "Public" Calendar</h2>

      <p>
        Many calendar apps let you create multiple calendars. Create one specifically for scheduling:
      </p>

      <ol>
        <li>Create a new calendar called "Availability" or "Public Times"</li>
        <li>Block out chunks when you're available (not your actual meetings)</li>
        <li>Share only this calendar, keep your main calendar private</li>
        <li>Update it regularly to reflect real availability</li>
      </ol>

      <p><strong>Pros:</strong> Works with existing calendar tools, automated</p>
      <p><strong>Cons:</strong> Requires maintenance, still reveals patterns over time</p>

      {/* Method 4 */}
      <h2>Method 4: Use Scheduling Tools with Privacy Controls</h2>

      <p>
        Some scheduling tools let you show availability without calendar integration:
      </p>

      <ul>
        <li><strong>WhenAvailable:</strong> No calendar connection, manual time entry, data auto-deletes</li>
        <li><strong>Cal.com:</strong> Self-hosting option, you control all data</li>
        <li><strong>Doodle:</strong> Poll-based scheduling, no calendar required</li>
      </ul>

      <p>
        The key is choosing tools that don't require calendar access and have strong privacy policies.
      </p>

      {/* Method 5 */}
      <h2>Method 5: Use Time Slot Buffers</h2>

      <p>
        If you must use calendar-connected tools, create privacy buffers:
      </p>

      <ol>
        <li>Mark personal events as "Busy" with no details</li>
        <li>Create fake "Focus Time" blocks to hide free periods</li>
        <li>Use vague titles like "Meeting" instead of specific details</li>
        <li>Enable "Hide event details" in calendar sharing settings</li>
      </ol>

      <p><strong>Pros:</strong> Works with any calendar tool</p>
      <p><strong>Cons:</strong> Still reveals timing patterns, requires maintenance</p>

      {/* Comparison Table */}
      <h2>Privacy Method Comparison</h2>

      <div className="overflow-x-auto my-8 not-prose">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Method</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Privacy</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Effort</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Scalability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 font-medium">Temporary Links</td>
              <td className="px-4 py-3 text-green-600">★★★★★ Excellent</td>
              <td className="px-4 py-3 text-green-600">Low</td>
              <td className="px-4 py-3 text-green-600">High</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Manual Email</td>
              <td className="px-4 py-3 text-green-600">★★★★★ Excellent</td>
              <td className="px-4 py-3 text-red-600">High</td>
              <td className="px-4 py-3 text-red-600">Low</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Separate Calendar</td>
              <td className="px-4 py-3 text-yellow-600">★★★☆☆ Moderate</td>
              <td className="px-4 py-3 text-yellow-600">Medium</td>
              <td className="px-4 py-3 text-green-600">High</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Privacy-First Tools</td>
              <td className="px-4 py-3 text-green-600">★★★★☆ Good</td>
              <td className="px-4 py-3 text-green-600">Low</td>
              <td className="px-4 py-3 text-green-600">High</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Time Buffers</td>
              <td className="px-4 py-3 text-yellow-600">★★☆☆☆ Fair</td>
              <td className="px-4 py-3 text-yellow-600">Medium</td>
              <td className="px-4 py-3 text-yellow-600">Medium</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Best Practices */}
      <h2>Best Practices for Calendar Privacy</h2>

      <h3>1. Never Share Your Primary Calendar</h3>
      <p>
        Your main calendar contains your entire life. Always use intermediary methods or separate calendars for scheduling.
      </p>

      <h3>2. Limit Time Window Visibility</h3>
      <p>
        Only show availability for the next 2-4 weeks. Don't give access to your entire schedule history or far future.
      </p>

      <h3>3. Use Generic Event Titles</h3>
      <p>
        If you must share a calendar, use titles like "Busy" or "Meeting" instead of "Doctor Appointment" or "Interview at Company X."
      </p>

      <h3>4. Revoke Access After Meetings</h3>
      <p>
        If you temporarily shared calendar access, revoke it immediately after the meeting is scheduled.
      </p>

      <h3>5. Prefer One-Time Solutions</h3>
      <p>
        For one-off meetings, use temporary solutions like <Link href="/">WhenAvailable</Link> instead of ongoing calendar access.
      </p>

      {/* Common Scenarios */}
      <h2>Privacy Solutions for Common Scenarios</h2>

      <h3>Job Interviews</h3>
      <p>
        <strong>Problem:</strong> Don't want current employer seeing interview activity<br />
        <strong>Solution:</strong> Use <Link href="/">WhenAvailable</Link> temporary links. Create scheduling link, share once, data deletes after 24 hours
      </p>

      <h3>Sales Calls</h3>
      <p>
        <strong>Problem:</strong> Don't want prospects knowing how busy/empty your calendar is<br />
        <strong>Solution:</strong> Manual time proposals or temporary links that hide overall calendar status
      </p>

      <h3>Personal Services (Doctors, Lawyers)</h3>
      <p>
        <strong>Problem:</strong> Highly sensitive appointment information<br />
        <strong>Solution:</strong> Always use manual email or phone scheduling for maximum privacy
      </p>

      <h3>Recruiting Candidates</h3>
      <p>
        <strong>Problem:</strong> Scheduling many candidates without revealing hiring patterns<br />
        <strong>Solution:</strong> Create separate "Interview Availability" calendar or use privacy-focused tools
      </p>

      {/* Conclusion */}
      <h2>Conclusion: Take Control of Your Calendar Privacy</h2>

      <p>
        You don't need to expose your entire schedule to schedule a single meeting. The best approach depends on your situation:
      </p>

      <ul>
        <li><strong>For maximum privacy:</strong> Use temporary links like <Link href="/">WhenAvailable</Link></li>
        <li><strong>For complete control:</strong> Manually propose times via email</li>
        <li><strong>For frequent scheduling:</strong> Create a separate public calendar</li>
        <li><strong>For technical users:</strong> Self-host your scheduling tool</li>
      </ul>

      <p>
        Remember: Your calendar is a detailed record of your life. Treat it with the same privacy you'd give your email or photos.
      </p>

      {/* Final CTA */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-8 my-12 text-center not-prose">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Schedule Your Next Meeting Privately
        </h3>
        <p className="text-gray-700 mb-6 text-lg">
          Create a temporary scheduling link in 30 seconds. No calendar access required. Data auto-deletes after booking.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors text-lg"
        >
          Try WhenAvailable Free →
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          No signup • No calendar connection • Maximum privacy
        </p>
      </div>

      {/* Related Articles */}
      <div className="border-t border-gray-200 pt-8 mt-12 not-prose">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Related Articles</h3>
        <div className="space-y-3">
          <Link
            href="/blog/privacy-first-scheduling-tools"
            className="block text-purple-600 hover:text-purple-700 font-medium"
          >
            → Privacy-First Scheduling Tools: Complete Guide
          </Link>
          <Link
            href="/blog/best-free-calendly-alternatives-2025"
            className="block text-purple-600 hover:text-purple-700 font-medium"
          >
            → Best Free Calendly Alternatives 2025
          </Link>
        </div>
      </div>
    </article>

      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "How to Schedule Meetings Without Sharing Your Calendar",
            "description": "Protect your privacy while scheduling meetings. Learn 5 proven methods to share availability without exposing your entire calendar to others.",
            "image": `${baseUrl}/og-image.png`,
            "author": {
              "@type": "Organization",
              "name": "WhenAvailable",
              "url": baseUrl
            },
            "publisher": {
              "@type": "Organization",
              "name": "WhenAvailable",
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/og-image.png`
              }
            },
            "datePublished": "2025-10-08",
            "dateModified": "2025-10-08",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${baseUrl}/blog/schedule-meetings-without-sharing-calendar`
            },
            "articleSection": "Privacy",
            "keywords": ["schedule meeting without calendar", "privacy scheduling", "share availability without calendar", "meeting scheduler privacy"]
          })
        }}
      />
    </>
  );
}
