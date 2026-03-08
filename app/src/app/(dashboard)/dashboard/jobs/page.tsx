"use client";

import { useCallback, useEffect, useState } from "react";
import { JobSearchBar } from "@/components/JobSearchBar";
import { MatchedInternshipCard } from "@/components/MatchedInternshipCard";
import { InternshipCardSkeleton } from "@/components/skeleton/InternshipCardSkeleton";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/lib/use-profile";
import { useOnlineStatus } from "@/lib/use-online-status";
import { fetchInternships } from "@/lib/internships-api";
import type { MatchedListing } from "@/lib/internships-api";
import { getJobsSearchCache, setJobsSearchCache } from "@/lib/jobs-search-cache";

const DEFAULT_LOCATION = "Merced, CA";

export default function JobsPage() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { online } = useOnlineStatus();
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [items, setItems] = useState<MatchedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    try {
      const interests = profile?.interests ?? [];
      const strengths = profile?.strengths ?? [];
      const [internshipRes, entryRes] = await Promise.all([
        fetchInternships({
          type: "internship",
          interests,
          strengths,
          major: profile?.major,
          minScore: 1,
          keywords: keywords.trim() || undefined,
          location: location.trim() || undefined,
        }),
        fetchInternships({
          type: "entry-level",
          interests,
          strengths,
          major: profile?.major,
          minScore: 1,
          keywords: keywords.trim() || undefined,
          location: location.trim() || undefined,
        }),
      ]);
      const merged = [...internshipRes.items, ...entryRes.items];
      setItems(merged);
      setJobsSearchCache(merged);
    } finally {
      setLoading(false);
    }
  }, [keywords, location, profile?.interests, profile?.strengths, profile?.major]);

  useEffect(() => {
    const cached = getJobsSearchCache();
    if (cached.length > 0) {
      setItems(cached);
      setSearched(true);
      setLoading(false);
    } else {
      runSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run once on mount
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-10" style={{ viewTransitionName: "vt-content" }}>
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
          Find Internships & Entry-Level Jobs
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-600">
          Search by title, keywords, or location. Results are personalized to
          your profile and match score.
        </p>
      </header>

      <section aria-label="Search">
        {!online && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Searching requires an internet connection. Your matched internships are available on the Dashboard when offline.
          </p>
        )}
        <JobSearchBar
        keywords={keywords}
        location={location}
        onKeywordsChange={setKeywords}
        onLocationChange={setLocation}
        onSearch={runSearch}
        disabled={loading || !online}
      />
      </section>

      <section aria-label="Results">
      {loading ? (
        <div className="space-y-4" role="status" aria-live="polite" aria-label="Loading job results">
          <p className="text-sm text-zinc-500">Loading results…</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <InternshipCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : searched && items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-12 text-center">
          <p className="text-base font-medium text-zinc-900">
            No jobs found
          </p>
          <p className="mt-2 max-w-md mx-auto text-sm leading-relaxed text-zinc-600">
            Try different keywords, a broader location, or remove filters to see
            more results.
          </p>
        </div>
      ) : items.length > 0 ? (
        <>
        <p className="mb-4 text-sm text-zinc-600" role="status">
          {items.length} {items.length === 1 ? "job" : "jobs"} found
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <MatchedInternshipCard
              key={`${item.id}-${item.source ?? "job"}-${index}`}
              item={item}
            />
          ))}
        </div>
        </>
      ) : null}
      </section>
    </div>
  );
}
