"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, DEFAULT_AVATAR_IMAGE } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MatchedInternshipCard } from "@/components/MatchedInternshipCard";
import { InternshipCardSkeleton } from "@/components/skeleton/InternshipCardSkeleton";
import { ViewTransitionLink } from "@/components/ViewTransitionLink";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/lib/use-profile";
import { useInternships } from "@/lib/use-internships";
import { md5 } from "@/lib/md5";

function getGravatarUrl(email: string): string {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=404&s=80`;
}

const SCORE_OPTIONS = [50, 60, 70, 80];
const ENTRY_UNLOCK_THRESHOLD = 3;

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, save, loading } = useProfile();
  const [avatarError, setAvatarError] = useState(false);

  const avatarSrc = useMemo(() => {
    if (!user) return DEFAULT_AVATAR_IMAGE;
    if (avatarError) return DEFAULT_AVATAR_IMAGE;
    const u = user as { avatarUrl?: string };
    if (u.avatarUrl) return u.avatarUrl;
    if (user.email) return getGravatarUrl(user.email);
    return DEFAULT_AVATAR_IMAGE;
  }, [user, avatarError]);

  if (!user) {
    return null;
  }

  const interests = profile?.interests ?? [];
  const strengths = profile?.strengths ?? [];
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
    strengths,
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
    strengths,
  });

  function handleScoreChange(next: number) {
    if (!profile) return;
    save({ ...profile, minScore: next });
  }

  const showProfileBanner = !loading && (!profile || interests.length === 0);

  return (
    <div className="space-y-10">
      <div style={{ viewTransitionName: "vt-section-1" }}>
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AspectRatio ratio={4 / 1}>
          <Card className="flex h-full flex-col justify-center border-0 p-5">
            <div className="flex items-center gap-3">
              <Avatar size="lg" className="shrink-0 ring-1 ring-zinc-200">
                <Avatar.Image
                  src={avatarSrc}
                  alt={user.name || "User"}
                  onError={() => setAvatarError(true)}
                />
                <Avatar.Fallback>
                  <Avatar.UserIcon />
                </Avatar.Fallback>
              </Avatar>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
                {user.name || "student"}
              </h1>
            </div>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600">
              AI-powered matching surfaces internships that line up with your
              interests and strengths. Complete them to unlock stronger entry-level
              roles.
            </p>
          </Card>
        </AspectRatio>
        <AspectRatio ratio={4 / 1}>
          <Card className="flex h-full flex-col justify-center border-0 p-5">
            <div className="flex flex-col items-start gap-2 text-sm text-zinc-700">
              <div>
                <span className="font-semibold">{completedCount}</span>{" "}
                internships completed
              </div>
              <div>
                <span className="font-semibold">{savedCount}</span> saved
                listings
              </div>
              <Link
                href="/dashboard/saved"
                className="mt-2 text-sm font-medium text-zinc-900 underline underline-offset-2"
              >
                View saved
              </Link>
            </div>
          </Card>
        </AspectRatio>
        </section>
      </div>

      {showProfileBanner && (
        <section className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
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

      <div style={{ viewTransitionName: "vt-section-2" }}>
        <AspectRatio ratio={4 / 3}>
          <Card className="flex h-full w-full flex-col overflow-hidden border-0 p-0">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 p-4">
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
              <div className="flex gap-1.5 rounded-full bg-white p-0.5">
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
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {!online && (
              <p className="mb-3 text-sm text-amber-700">
                You&apos;re offline. Previously loaded matches may still be
                visible, but new results require a connection.
              </p>
            )}
            {loadingInternships ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <InternshipCardSkeleton key={index} />
                ))}
              </div>
            ) : internships.length === 0 ? (
              <div className="rounded-xl bg-zinc-50 px-4 py-6 text-sm text-zinc-600">
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
          </div>
        </Card>
        </AspectRatio>
      </div>

      <div style={{ viewTransitionName: "vt-section-3" }}>
        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-xl bg-white p-4 shadow-sm">
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

        <article className="rounded-xl bg-white p-4 shadow-sm">
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

      <div style={{ viewTransitionName: "vt-section-4" }}>
        <section className="space-y-6">
          <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Connections
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-zinc-600">
                People and resources to help you grow. Click a card to learn more.
              </p>
            </div>
            <ViewTransitionLink
              href="/dashboard/connections"
              className="shrink-0 text-sm font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700"
            >
              View all
            </ViewTransitionLink>
          </header>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              {
                slug: "career-center",
                title: "Career center",
                description:
                  "Book a session with your campus career advisor.",
              },
              {
                slug: "alumni-network",
                title: "Alumni network",
                description: "Connect with graduates in your field.",
              },
              {
                slug: "mentorship",
                title: "Mentorship",
                description: "Find a mentor for your internship search.",
              },
              {
                slug: "workshops",
                title: "Workshops",
                description: "Upcoming resume and interview workshops.",
              },
              {
                slug: "employer-events",
                title: "Employer events",
                description: "Info sessions and meet-and-greets.",
              },
            ].map((item) => (
              <ViewTransitionLink
                key={item.slug}
                href={`/dashboard/connections/${item.slug}`}
                className="group flex min-h-[7rem] flex-col rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50/80 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              >
                <h3 className="text-sm font-semibold text-zinc-900">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
                  {item.description}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-zinc-700 group-hover:text-zinc-900">
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
              </ViewTransitionLink>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

