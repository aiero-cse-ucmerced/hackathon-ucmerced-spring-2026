"use client";

import Link from "next/link";
import { useMemo } from "react";
import { MatchedInternshipCard } from "@/components/MatchedInternshipCard";
import { InternshipCardSkeleton } from "@/components/skeleton/InternshipCardSkeleton";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/lib/use-profile";
import { useInternships } from "@/lib/use-internships";
import type { MatchedListing } from "@/lib/internships-api";
import { formatRelativeTime } from "@/lib/format-relative-time";

function SavedInternshipCard({
  item,
  onUnsave,
}: {
  item: MatchedListing;
  onUnsave: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) return;
        onUnsave();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onUnsave();
        }
      }}
      className="cursor-pointer rounded-xl transition-all hover:ring-2 hover:ring-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500"
      aria-label={`Unsave ${item.title}`}
    >
      <MatchedInternshipCard item={item} />
      {item.updated && (
        <p className="mt-2 text-xs text-zinc-500">
          {formatRelativeTime(item.updated)}
        </p>
      )}
    </div>
  );
}

export default function SavedPage() {
  const { user } = useAuth();
  const { profile, save } = useProfile();

  if (!user) {
    return null;
  }

  const savedIds = profile?.savedIds ?? [];
  const interests = profile?.interests ?? [];
  const strengths = profile?.strengths ?? [];
  const major = profile?.major;
  const minScore = 1;

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

  const allItems = useMemo(
    () => [...internships, ...entryLevel],
    [internships, entryLevel],
  );

  const savedListings = useMemo(() => {
    const seen = new Set<string>();
    return allItems.filter((item) => {
      if (!savedIds.includes(item.id)) return false;
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [allItems, savedIds]);

  const loading = loadingInternships || loadingEntry;

  function remove(id: string) {
    if (!profile) return;
    const nextSaved = savedIds.filter((value) => value !== id);
    save({ ...profile, savedIds: nextSaved });
  }

  if (savedIds.length === 0) {
    return (
      <div
        className="mt-10 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-600"
        style={{ viewTransitionName: "vt-content" }}
      >
        You haven&apos;t saved any internships yet. Browse matches on the{" "}
        <Link
          href="/dashboard"
          className="font-medium text-zinc-900 underline underline-offset-2"
        >
          dashboard
        </Link>{" "}
        and star the ones you want to track.
      </div>
    );
  }

  return (
    <div className="space-y-4" style={{ viewTransitionName: "vt-content" }}>
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg font-semibold text-zinc-900">
          Saved internships
        </h1>
        <p className="text-sm text-zinc-600">
          {savedIds.length} saved internship{savedIds.length === 1 ? "" : "s"}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: savedIds.length }).map((_, index) => (
            <InternshipCardSkeleton key={index} />
          ))}
        </div>
      ) : savedListings.length === 0 ? (
        <p className="text-sm text-zinc-600">
          Saved internships could not be loaded. They may have expired or
          changed; try refreshing or saving new listings from the dashboard.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedListings.map((item) => (
            <SavedInternshipCard
              key={item.id}
              item={item}
              onUnsave={() => remove(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

