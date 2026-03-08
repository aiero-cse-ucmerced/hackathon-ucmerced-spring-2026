"use client";

import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InternshipCardSkeleton } from "@/components/skeleton/InternshipCardSkeleton";
import { ViewTransitionLink } from "@/components/ViewTransitionLink";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/lib/use-profile";
import { useInternships } from "@/lib/use-internships";
import { getJobsSearchListing } from "@/lib/jobs-search-cache";
import type { MatchedListing } from "@/lib/internships-api";

/** Extract keyword-style terms from listing for badge display. */
function extractKeywords(listing: MatchedListing): string[] {
  const seen = new Set<string>();
  const add = (s: string) => {
    const t = s.trim();
    if (t.length >= 2 && t.length <= 30 && !seen.has(t.toLowerCase())) {
      seen.add(t.toLowerCase());
      return t;
    }
    return null;
  };

  const keywords: string[] = [];

  if (listing.type) {
    const t = add(listing.type);
    if (t) keywords.push(t);
  }

  const text = `${listing.title} ${listing.snippet ?? ""}`.toLowerCase();
  const commonTerms = [
    "react",
    "typescript",
    "python",
    "javascript",
    "sql",
    "data",
    "analytics",
    "frontend",
    "backend",
    "full-stack",
    "remote",
    "hybrid",
    "internship",
    "entry level",
    "engineering",
    "software",
    "product",
    "ux",
    "design",
    "marketing",
    "finance",
    "research",
    "consulting",
    "devops",
    "cloud",
    "mobile",
    "cybersecurity",
    "hr",
    "operations",
    "sales",
  ];

  for (const term of commonTerms) {
    if (text.includes(term)) {
      const label = term.charAt(0).toUpperCase() + term.slice(1);
      if (add(label)) keywords.push(label);
    }
  }

  if (listing.location) {
    const t = add(listing.location);
    if (t) keywords.push(t);
  }

  return keywords.slice(0, 12);
}

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

  const keywords = extractKeywords(listing);

  return (
    <div
      className="min-h-0"
      style={{ viewTransitionName: "vt-content" }}
    >
      {/* Back nav – Orbit Media: standard layout, clear navigation */}
      <nav className="mb-8">
        <ViewTransitionLink
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 rounded-md transition-colors"
          aria-label="Back to dashboard"
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
      </nav>

      {/* Hero – Claritee: descriptive headline, visual hierarchy */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-medium">
            {listing.kind === "internship" ? "Internship" : "Entry-level"}
          </Badge>
          <Badge variant="outline">{listing.score}% match</Badge>
          {listing.source && (
            <Badge variant="outline">{listing.source}</Badge>
          )}
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
          {listing.title}
        </h1>
        <p className="mt-2 text-lg text-zinc-600">{listing.company}</p>
        {(listing.location || listing.type || listing.salary) && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
            {listing.location && <span>{listing.location}</span>}
            {listing.type && <span>{listing.type}</span>}
            {listing.salary && <span>{listing.salary}</span>}
          </div>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main content – Orbit Media: one focus at a time, tall page */}
        <div className="space-y-8">
          {/* Keywords as badges – shadcn Badge for job terms */}
          {keywords.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Keywords &amp; skills
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <Badge key={kw} variant="secondary">
                    {kw}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* About the role */}
          <Card className="border-zinc-200">
            <CardHeader>
              <CardTitle className="text-base">About the role</CardTitle>
              <CardDescription>
                Job description and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {listing.snippet ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
                  {listing.snippet}
                </p>
              ) : (
                <p className="text-sm text-zinc-500">
                  No detailed description available. Use the Apply link to view
                  the full posting.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Requirements – inferred from snippet keywords */}
          {keywords.length > 0 && (
            <Card className="border-zinc-200">
              <CardHeader>
                <CardTitle className="text-base">Related interests</CardTitle>
                <CardDescription>
                  Areas that align with this role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {keywords.slice(0, 8).map((kw) => (
                    <Badge key={kw} variant="outline">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar – CTA below fold per Orbit Media */}
        <aside className="space-y-6">
          <Card className="border-zinc-200 sticky top-4">
            <CardHeader>
              <CardTitle className="text-base">Quick actions</CardTitle>
              <CardDescription>
                Save for later or mark as completed to unlock more roles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {listing.link && (
                <a
                  href={listing.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full"
                >
                  <Button className="w-full bg-zinc-900 hover:bg-zinc-800">
                    Apply now
                  </Button>
                </a>
              )}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={toggleSaved}
              >
                {isSaved ? "Remove from saved" : "Save for later"}
              </Button>
              <Button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600"
                onClick={markCompleted}
              >
                {isCompleted ? "Completed" : "Mark as completed"}
              </Button>
              {message && (
                <p className="text-sm text-zinc-600" role="status">
                  {message}
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
