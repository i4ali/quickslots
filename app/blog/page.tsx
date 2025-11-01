import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - Scheduling Tips & Guides | WhenAvailable",
  description: "Learn about privacy-first scheduling, temporary calendar links, and alternatives to traditional meeting schedulers. Expert tips for efficient meeting management.",
  alternates: {
    canonical: '/blog',
  },
};

const blogPosts = [
  {
    slug: "temporary-scheduling-solutions-2025",
    title: "Best Temporary Scheduling Solutions for 2025",
    description: "Compare the best temporary scheduling tools and software for 2025. Find the perfect solution for meetings, interviews, and appointments without calendar integration.",
    date: "2025-10-11",
    readTime: "10 min read",
    category: "Comparisons",
  },
  {
    slug: "best-free-calendly-alternatives-2025",
    title: "Best Free Calendly Alternatives 2025",
    description: "Discover the top free alternatives to Calendly for scheduling meetings without breaking the bank. Compare features, privacy policies, and ease of use.",
    date: "2025-10-08",
    readTime: "8 min read",
    category: "Comparisons",
  },
  {
    slug: "schedule-meetings-without-sharing-calendar",
    title: "How to Schedule Meetings Without Sharing Your Calendar",
    description: "Protect your privacy while scheduling meetings. Learn techniques to share availability without exposing your entire calendar.",
    date: "2025-10-08",
    readTime: "6 min read",
    category: "Privacy",
  },
  {
    slug: "privacy-first-scheduling-tools",
    title: "Privacy-First Scheduling Tools: Complete Guide",
    description: "Why privacy matters in scheduling tools and how to choose solutions that respect your data. Feature comparison and recommendations.",
    date: "2025-10-08",
    readTime: "10 min read",
    category: "Privacy",
  },
];

export default function BlogPage() {
  return (
    <div>
      {/* Blog Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          WhenAvailable Blog
        </h1>
        <p className="text-xl text-gray-600">
          Tips, guides, and insights for better meeting scheduling
        </p>
      </div>

      {/* Blog Posts Grid */}
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                {post.category}
              </span>
              <span className="text-sm text-gray-500">{post.readTime}</span>
              <span className="text-sm text-gray-400">•</span>
              <time className="text-sm text-gray-500">{post.date}</time>
            </div>

            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
            </Link>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {post.description}
            </p>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
