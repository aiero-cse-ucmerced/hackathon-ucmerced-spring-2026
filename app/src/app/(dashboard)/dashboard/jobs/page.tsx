"use client";

import { useCallback, useState } from "react";
import { JobSearchBar } from "@/components/JobSearchBar";
import { MatchedInternshipCard } from "@/components/MatchedInternshipCard";
import { InternshipCardSkeleton } from "@/components/skeleton/InternshipCardSkeleton";
import { useAuth } from "@/components/AuthProvider";
import { fetchInternships } from "@/lib/internships-api";
import type { MatchedListing } from "@/lib/internships-api";
import { setJobsSearchCache } from "@/lib/jobs-search-cache";

const DEFAULT_LOCATION = "Merced, CA";

export default function JobsPage() {
  const { user } = useAuth();
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [items, setItems] = useState<MatchedListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    try {
      const [internshipRes, entryRes] = await Promise.all([
        fetchInternships({
          type: "internship",
          interests: [],
          minScore: 1,
          keywords: keywords.trim() || undefined,
          location: location.trim() || undefined,
        }),
        fetchInternships({
          type: "entry-level",
          interests: [],
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
  }, [keywords, location]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
          Jobs
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Search internships and entry-level roles by title, keywords, or
          location.
        </p>
      </div>

      <JobSearchBar
        keywords={keywords}
        location={location}
        onKeywordsChange={setKeywords}
        onLocationChange={setLocation}
        onSearch={runSearch}
        disabled={loading}
      />

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
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-600">
          No jobs found. Try different keywords or a broader location.
        </div>
      ) : items.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <MatchedInternshipCard
              key={`${item.id}-${item.source ?? "job"}-${index}`}
              item={item}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
