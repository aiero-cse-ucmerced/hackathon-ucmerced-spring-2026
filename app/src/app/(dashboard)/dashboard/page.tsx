"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MatchedInternshipCard } from "@/components/MatchedInternshipCard";
import { InternshipCardSkeleton } from "@/components/skeleton/InternshipCardSkeleton";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/lib/use-profile";
import { useInternships } from "@/lib/use-internships";

const SCORE_OPTIONS = [50, 60, 70, 80];
const ENTRY_UNLOCK_THRESHOLD = 3;

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile, save, loading } = useProfile();

  if (!user) {
    return null;
  }

  const interests = profile?.interests ?? [];
  const major = profile?.major;
  const minScore = profile?.minScore ?? 50;

  const {
    items: internships,
    loading: loadingInternships,
    online,
  } = useInternships({
    kind: "internship",
    interests,
    major,
    minScore,
  });

  const completedCount = profile?.completedIds?.length ?? 0;
  const savedCount = profile?.savedIds?.length ?? 0;
  const entryUnlocked = completedCount >= ENTRY_UNLOCK_THRESHOLD;

  const {
    items: entryLevel,
    loading: loadingEntry,
  } = useInternships({
    kind: "entry-level",
    interests,
    major,
    minScore,
  });

  function handleScoreChange(next: number) {
    if (!profile) return;
    save({ ...profile, minScore: next });
  }

  const showProfileBanner = !loading && (!profile || interests.length === 0);

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
            Welcome back, {user.name || "student"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600">
            Explore internships that line up with your interests and use them to
            unlock stronger entry-level roles.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 text-sm text-zinc-700">
          <div>
            <span className="font-semibold">{completedCount}</span>{" "}
            internships completed
          </div>
          <div>
            <span className="font-semibold">{savedCount}</span> saved listings
          </div>
        </div>
      </section>

      {showProfileBanner && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>
              Add a few interests to your profile so we can start matching you
              to better internships.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                window.location.href = "/dashboard/profile";
              }}
            >
              Complete profile
            </Button>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Matched internships
            </h2>
            <p className="text-sm text-zinc-600">
              Filter by minimum match score to hide low-fit listings.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-700">
            <span>Min score</span>
            <div className="flex gap-1.5 rounded-full border border-zinc-200 bg-white p-0.5">
              {SCORE_OPTIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleScoreChange(value)}
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    minScore === value
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {value}+
                </button>
              ))}
            </div>
          </div>
        </div>

        {!online && (
          <p className="text-sm text-amber-700">
            You&apos;re offline. Previously loaded matches may still be visible,
            but new results require a connection.
          </p>
        )}

        {loadingInternships ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <InternshipCardSkeleton key={index} />
            ))}
          </div>
        ) : internships.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-600">
            No matches yet. Try lowering the minimum score or adding more
            interests in your{" "}
            <Link
              href="/dashboard/profile"
              className="font-medium text-zinc-900 underline underline-offset-2"
            >
              profile
            </Link>
            .
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {internships.map((item) => (
              <MatchedInternshipCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Saved</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Quickly revisit internships you&apos;ve starred.
          </p>
          <p className="mt-3 text-sm text-zinc-800">
            <span className="font-semibold">{savedCount}</span> saved
            internships
          </p>
          <div className="mt-4">
            <Link
              href="/dashboard/saved"
              className="text-sm font-medium text-zinc-900 underline underline-offset-2"
            >
              View saved internships
            </Link>
          </div>
        </article>

        <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">
            Entry-level jobs
          </h2>
          {entryUnlocked ? (
            <>
              <p className="mt-1 text-sm text-zinc-600">
                Based on your completed internships, these roles should feel
                within reach.
              </p>
              {loadingEntry ? (
                <div className="mt-3 space-y-2">
                  <InternshipCardSkeleton />
                  <InternshipCardSkeleton />
                </div>
              ) : entryLevel.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-600">
                  No entry-level matches yet. Try adjusting your minimum score
                  or adding more interests.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {entryLevel.slice(0, 3).map((item) => (
                    <MatchedInternshipCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="mt-1 text-sm text-zinc-600">
              Complete{" "}
              <span className="font-semibold">
                {Math.max(ENTRY_UNLOCK_THRESHOLD - completedCount, 1)}
              </span>{" "}
              more internship
              {ENTRY_UNLOCK_THRESHOLD - completedCount === 1 ? "" : "s"} to
              unlock tailored entry-level roles.
            </p>
          )}
        </article>
      </section>
    </div>
  );
}

