"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

const CONNECTIONS = [
  { slug: "career-center", title: "Career center", description: "Book a session with your campus career advisor." },
  { slug: "alumni-network", title: "Alumni network", description: "Connect with graduates in your field." },
  { slug: "mentorship", title: "Mentorship", description: "Find a mentor for your internship search." },
  { slug: "workshops", title: "Workshops", description: "Upcoming resume and interview workshops." },
  { slug: "employer-events", title: "Employer events", description: "Info sessions and meet-and-greets." },
];

export default function ConnectionsIndexPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 rounded-md"
            aria-label="Back to dashboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to dashboard
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
            Connections
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600">
            People and resources to help you grow. Click a card to learn more.
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONNECTIONS.map((item) => (
          <Link
            key={item.slug}
            href={`/dashboard/connections/${item.slug}`}
            className="group flex min-h-[7rem] flex-col rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50/80 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
          >
            <h2 className="text-sm font-semibold text-zinc-900">{item.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">{item.description}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-zinc-700 group-hover:text-zinc-900">
              Learn more
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
