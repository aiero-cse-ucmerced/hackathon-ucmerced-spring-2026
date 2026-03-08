"use client";

import { notFound, useParams } from "next/navigation";
import { ViewTransitionLink } from "@/components/ViewTransitionLink";
import { useAuth } from "@/components/AuthProvider";

const CONNECTIONS: Record<
  string,
  { title: string; description: string; detail: string }
> = {
  "career-center": {
    title: "Career center",
    description: "Book a session with your campus career advisor.",
    detail:
      "Schedule a one-on-one to review your resume, practice interviews, or explore career paths. Drop by during walk-in hours or book online.",
  },
  "alumni-network": {
    title: "Alumni network",
    description: "Connect with graduates in your field.",
    detail:
      "Browse alumni by industry and role. Message them for advice or informational chats. Many are happy to share their journey and tips.",
  },
  mentorship: {
    title: "Mentorship",
    description: "Find a mentor for your internship search.",
    detail:
      "Get matched with experienced professionals who can guide you through applications and offers. Mentors typically meet monthly.",
  },
  workshops: {
    title: "Workshops",
    description: "Upcoming resume and interview workshops.",
    detail:
      "Weekly sessions on networking, LinkedIn, and technical interviews. Drop-in welcome. Check the events calendar for dates.",
  },
  "employer-events": {
    title: "Employer events",
    description: "Info sessions and meet-and-greets.",
    detail:
      "Virtual and on-campus events with recruiters. Check the calendar for dates and registration links.",
  },
};

export default function ConnectionDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ? decodeURIComponent(params.slug) : "";
  const connection = slug ? CONNECTIONS[slug] : null;

  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (!connection) {
    notFound();
  }

  return (
    <div
      className="space-y-6"
      style={{ viewTransitionName: "vt-content" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <ViewTransitionLink
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 rounded-md"
            aria-label="Close and return to dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to dashboard
          </ViewTransitionLink>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
            {connection.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600">
            {connection.description}
          </p>
        </div>
        <ViewTransitionLink
          href="/dashboard"
          className="shrink-0 inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
          aria-label="Close and return to dashboard"
        >
          Close
        </ViewTransitionLink>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-900">Overview</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          {connection.detail}
        </p>
      </div>
    </div>
  );
}
