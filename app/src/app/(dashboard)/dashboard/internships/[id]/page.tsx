"use client";

import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MatchedInternshipCard } from "@/components/MatchedInternshipCard";
import { InternshipCardSkeleton } from "@/components/skeleton/InternshipCardSkeleton";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/lib/use-profile";
import { useInternships } from "@/lib/use-internships";

export default function InternshipDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ? decodeURIComponent(params.id) : "";

  const { user } = useAuth();
  const { profile, save } = useProfile();

  const interests = profile?.interests ?? [];
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
  });

  const {
    items: entryLevel,
    loading: loadingEntry,
  } = useInternships({
    kind: "entry-level",
    interests,
    major,
    minScore,
  });

  const listing = useMemo(
    () => [...internships, ...entryLevel].find((item) => item.id === id),
    [internships, entryLevel, id],
  );

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
    <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <MatchedInternshipCard item={listing} />
      </div>
      <aside className="space-y-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Actions</h2>
          <div className="mt-3 flex flex-col gap-2">
            <Button type="button" variant="outline" onClick={toggleSaved}>
              {isSaved ? "Unsave" : "Save for later"}
            </Button>
            <Button type="button" onClick={markCompleted}>
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
  );
}

