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
    "react", "typescript", "python", "javascript", "sql", "data", "analytics",
    "frontend", "backend", "full-stack", "remote", "hybrid", "internship",
    "entry level", "engineering", "software", "product", "ux", "design",
    "marketing", "finance", "research", "consulting", "devops", "cloud",
    "mobile", "cybersecurity", "hr", "operations", "sales",
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
  return keywords.slice(0, 14);
}

/** Parse snippet into description and requirements if structured. */
function parseSnippet(snippet: string): { description: string; requirements: string[] } {
  if (!snippet?.trim()) return { description: "", requirements: [] };

  const lower = snippet.toLowerCase();
  const reqMarkers = ["requirements:", "qualifications:", "must have:", "you have:", "requirements", "qualifications"];
  let reqStart = -1;
  let reqMarker = "";
  for (const m of reqMarkers) {
    const idx = lower.indexOf(m);
    if (idx !== -1 && (reqStart === -1 || idx < reqStart)) {
      reqStart = idx;
      reqMarker = m;
    }
  }

  if (reqStart !== -1) {
    const description = snippet.slice(0, reqStart).trim();
    let reqText = snippet.slice(reqStart + reqMarker.length).trim();
    const reqLines = reqText
      .split(/\n|•|–|—|\*|(?=\d+\.)/)
      .map((s) => s.replace(/^[\s\-•*]+/, "").trim())
      .filter((s) => s.length > 10);
    return { description: description || snippet, requirements: reqLines };
  }

  const lines = snippet.split(/\n+/).filter(Boolean);
  const bulletLines = lines.filter((l) => /^[\s]*[•\-*]\s/.test(l) || /^[\s]*\d+\.\s/.test(l));
  if (bulletLines.length >= 2) {
    const descEnd = lines.findIndex((l) => /^[\s]*[•\-*]\s/.test(l) || /^[\s]*\d+\.\s/.test(l));
    const description = descEnd >= 0 ? lines.slice(0, descEnd).join("\n\n").trim() : snippet;
    const requirements = bulletLines.map((l) => l.replace(/^[\s\-•*\d.]+\s*/, "").trim()).filter(Boolean);
    return { description: description || snippet, requirements };
  }

  return { description: snippet, requirements: [] };
}

/** Which of the user's interests/strengths appear in the job text (supports partial match). */
function getMatchingInterests(
  listing: MatchedListing,
  interests: string[],
  strengths: string[]
): { interests: string[]; strengths: string[] } {
  const haystack = `${listing.title} ${listing.snippet ?? ""}`.toLowerCase();
  const matches = (items: string[]) =>
    items.filter((item) => {
      const lower = item.toLowerCase().trim();
      if (haystack.includes(lower)) return true;
      const tokens = lower.split(/[\s&/]+/).filter((t) => t.length >= 3);
      return tokens.some((t) => haystack.includes(t));
    });
  return {
    interests: matches(interests),
    strengths: matches(strengths),
  };
}

export default function InternshipDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ? decodeURIComponent(params.id) : "";

  const { user } = useAuth();
  const { profile, save } = useProfile();

  const interests = profile?.interests ?? [];
  const strengths = profile?.strengths ?? [];
  const major = profile?.major;
  const minScore = profile?.minScore ?? 30;

  const { items: internships, loading: loadingInternships } = useInternships({
    kind: "internship",
    interests,
    major,
    minScore,
    strengths,
  });

  const { items: entryLevel, loading: loadingEntry } = useInternships({
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

  if (!user) return null;

  const allLoaded = !loadingInternships && !loadingEntry;
  if (allLoaded && !listing) notFound();

  const savedIds = profile?.savedIds ?? [];
  const completedIds = profile?.completedIds ?? [];
  const isSaved = savedIds.includes(id);
  const isCompleted = completedIds.includes(id);

  function toggleSaved() {
    if (!profile) return;
    const nextSaved = isSaved ? savedIds.filter((v) => v !== id) : [...savedIds, id];
    save({ ...profile, savedIds: nextSaved });
    setMessage(isSaved ? "Removed from saved." : "Saved for later.");
  }

  function markCompleted() {
    if (!profile) return;
    if (isCompleted) {
      setMessage("Already marked as completed.");
      return;
    }
    save({ ...profile, completedIds: [...completedIds, id] });
    setMessage("Marked as completed. Entry-level roles may unlock as you finish more internships.");
  }

  if (!listing) {
    return (
      <div className="mt-10">
        <InternshipCardSkeleton />
      </div>
    );
  }

  const keywords = extractKeywords(listing);
  const { description, requirements } = parseSnippet(listing.snippet ?? "");
  const { interests: matchingInterests, strengths: matchingStrengths } = getMatchingInterests(
    listing,
    interests,
    strengths
  );
  const hasMatch = matchingInterests.length > 0 || matchingStrengths.length > 0;

  return (
    <div className="min-h-0" style={{ viewTransitionName: "vt-content" }}>
      <nav className="mb-8">
        <ViewTransitionLink
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
          aria-label="Back to dashboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to dashboard
        </ViewTransitionLink>
      </nav>

      {/* Header — job title, company, meta */}
      <header className="mb-10 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-medium">
            {listing.kind === "internship" ? "Internship" : "Entry-level"}
          </Badge>
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            {listing.score}% match
          </Badge>
          {listing.source && <Badge variant="outline">{listing.source}</Badge>}
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
          {listing.title}
        </h1>
        <p className="mt-2 text-lg font-medium text-zinc-600">{listing.company}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-500">
          {listing.location && (
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {listing.location}
            </span>
          )}
          {listing.type && <span>{listing.type}</span>}
          {listing.salary && <span>{listing.salary}</span>}
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          {/* Your match — student-focused: which of YOUR interests align */}
          {hasMatch && (
            <Card className="border-amber-200/60 bg-amber-50/30">
              <CardHeader>
                <CardTitle className="text-base">Your match</CardTitle>
                <CardDescription>
                  Your interests and strengths that align with this role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {matchingInterests.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Interests</p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {matchingInterests.map((i) => (
                        <Badge key={i} className="bg-amber-100 text-amber-800">
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {matchingStrengths.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Strengths</p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {matchingStrengths.map((s) => (
                        <Badge key={s} variant="outline" className="border-amber-300 text-amber-800">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-zinc-600">
                  {listing.kind === "internship"
                    ? "Internships often don't require prior experience. Apply with your resume and a brief cover letter."
                    : "Entry-level roles value potential. Highlight projects and coursework that show relevant skills."}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Full job description */}
          <Card className="border-zinc-200">
            <CardHeader>
              <CardTitle className="text-base">Job description</CardTitle>
              <CardDescription>Full role details and responsibilities</CardDescription>
            </CardHeader>
            <CardContent>
              {description ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
                  {description}
                </div>
              ) : listing.snippet ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
                  {listing.snippet}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  No detailed description available. Use the Apply button to view the full posting on the employer's site.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Requirements / qualifications */}
          {(requirements.length > 0 || keywords.length > 0) && (
            <Card className="border-zinc-200">
              <CardHeader>
                <CardTitle className="text-base">Requirements & qualifications</CardTitle>
                <CardDescription>
                  Skills and qualifications mentioned for this role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {requirements.length > 0 && (
                  <ul className="list-inside list-disc space-y-1.5 text-sm text-zinc-700">
                    {requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
                {keywords.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Skills & areas
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {keywords.map((kw) => (
                        <Badge key={kw} variant="secondary">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Student tip */}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-600">
            <p className="font-medium text-zinc-700">Tip for students</p>
            <p className="mt-1">
              Apply soon—internship and entry-level roles fill quickly. Tailor your cover letter to mention 1–2 specific interests that match this role.
            </p>
          </div>
        </div>

        {/* Sidebar — apply, save, complete */}
        <aside className="space-y-6">
          <Card className="sticky top-4 border-zinc-200">
            <CardHeader>
              <CardTitle className="text-base">Apply & track</CardTitle>
              <CardDescription>
                Save for later or mark as completed to unlock more roles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {listing.link && (
                <a href={listing.link} target="_blank" rel="noreferrer" className="block w-full">
                  <Button className="w-full bg-zinc-900 hover:bg-zinc-800">
                    Apply now
                  </Button>
                </a>
              )}
              <Button type="button" variant="outline" className="w-full" onClick={toggleSaved}>
                {isSaved ? "Remove from saved" : "Save for later"}
              </Button>
              <Button
                type="button"
                className="w-full bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-600"
                onClick={markCompleted}
              >
                {isCompleted ? "Completed" : "Mark as completed"}
              </Button>
              {message && <p className="text-sm text-zinc-600" role="status">{message}</p>}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
