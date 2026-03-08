"use client";

import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MatchedInternshipCard } from "@/components/MatchedInternshipCard";
import { InternshipCardSkeleton } from "@/components/skeleton/InternshipCardSkeleton";
import { ViewTransitionLink } from "@/components/ViewTransitionLink";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/lib/use-profile";
import { useInternships } from "@/lib/use-internships";
import { getJobsSearchListing } from "@/lib/jobs-search-cache";

export default function InternshipDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ? decodeURIComponent(params.id) : "";

  const { user } = useAuth();
  const { profile, save } = useProfile();

  const interests = profile?.interests ?? [];
  const strengths = profile?.strengths ?? [];
  const major = profile?.major;
  const minScore = profile?.minScore ?? 50;

  const {
    items: internships,
    loading: loadingInternships,
  } = useInternships({
    kind: "internship",
    interests,
    major,
    minScore,
    strengths,
  });

  const {
    items: entryLevel,
    loading: loadingEntry,
  } = useInternships({
    kind: "entry-level",
    interests,
    major,
    minScore,
    strengths,
  });

  const listing = useMemo(() => {
    const fromJobs = getJobsSearchListing(id);
    if (fromJobs) return fromJobs;
    return [...internships, ...entryLevel].find((item) => item.id === id);
  }, [internships, entryLevel, id]);

  const [message, setMessage] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const allLoaded = !loadingInternships && !loadingEntry;

  if (allLoaded && !listing) {
    notFound();
  }

  const savedIds = profile?.savedIds ?? [];
  const completedIds = profile?.completedIds ?? [];
  const isSaved = savedIds.includes(id);
  const isCompleted = completedIds.includes(id);

  function toggleSaved() {
    if (!profile) return;
    const nextSaved = isSaved
      ? savedIds.filter((value) => value !== id)
      : [...savedIds, id];
    save({ ...profile, savedIds: nextSaved });
    setMessage(isSaved ? "Removed from saved." : "Saved for later.");
  }

  function markCompleted() {
    if (!profile) return;
    if (isCompleted) {
      setMessage("Already marked as completed.");
      return;
    }
    const nextCompleted = [...completedIds, id];
    save({ ...profile, completedIds: nextCompleted });
    setMessage(
      "Marked as completed. Entry-level roles may unlock as you finish more internships.",
    );
  }

  if (!listing) {
    return (
      <div className="mt-10">
        <InternshipCardSkeleton />
      </div>
    );
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
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-600">
            View details, save for later, or mark as completed. Use the Apply
            link to open the job posting.
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

      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <MatchedInternshipCard item={listing} />
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-zinc-900">
              Quick actions
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Save for later or mark as completed to unlock more roles.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <Button type="button" variant="outline" onClick={toggleSaved}>
                {isSaved ? "Remove from saved" : "Save for later"}
              </Button>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600"
                onClick={markCompleted}
              >
                {isCompleted ? "Completed" : "Mark as completed"}
              </Button>
            </div>
            {message && (
              <p className="mt-3 text-xs text-zinc-600" role="status">
                {message}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

