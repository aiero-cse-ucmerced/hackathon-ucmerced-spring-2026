"use client";

import Link from "next/link";
import { MatchedInternshipCard } from "@/components/MatchedInternshipCard";
import { InternshipCardSkeleton } from "@/components/skeleton/InternshipCardSkeleton";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/lib/use-profile";
import { useInternships } from "@/lib/use-internships";

export default function SavedPage() {
  const { user } = useAuth();
  const { profile, save } = useProfile();

  if (!user) {
    return null;
  }

  const savedIds = profile?.savedIds ?? [];
  const interests = profile?.interests ?? [];
  const major = profile?.major;

  const {
    items: internships,
    loading,
  } = useInternships({
    kind: "internship",
    interests,
    major,
    minScore: 1,
  });

  const savedListings = internships.filter((item) =>
    savedIds.includes(item.id),
  );

  function remove(id: string) {
    if (!profile) return;
    const nextSaved = savedIds.filter((value) => value !== id);
    save({ ...profile, savedIds: nextSaved });
  }

  if (savedIds.length === 0) {
    return (
      <div className="mt-10 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-600">
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
    <div className="space-y-4">
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
            <div key={item.id} className="space-y-2">
              <MatchedInternshipCard item={item} />
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="text-xs text-zinc-600 underline underline-offset-2"
              >
                Remove from saved
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

