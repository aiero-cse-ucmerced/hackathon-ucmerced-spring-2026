"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { JobSearchBar } from "@/components/JobSearchBar";
import { MatchedInternshipCard } from "@/components/MatchedInternshipCard";
import { InternshipCardSkeleton } from "@/components/skeleton/InternshipCardSkeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/lib/use-profile";
import { fetchInternships } from "@/lib/internships-api";
import type { MatchedListing } from "@/lib/internships-api";
import { getJobsSearchCache, setJobsSearchCache } from "@/lib/jobs-search-cache";

const DEFAULT_LOCATION = "Merced, CA";

export default function JobsPage() {
  const { user } = useAuth();
  const { profile, save } = useProfile();
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [items, setItems] = useState<MatchedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

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

  const savedIds = profile?.savedIds ?? [];
  const completedIds = profile?.completedIds ?? [];

  function toggleSaved(id: string) {
    if (!profile) return;
    const isSaved = savedIds.includes(id);
    const nextSaved = isSaved
      ? savedIds.filter((value) => value !== id)
      : [...savedIds, id];
    save({ ...profile, savedIds: nextSaved });
    setMessage(isSaved ? "Removed from saved." : "Saved for later.");
  }

  function markCompleted(id: string) {
    if (!profile) return;
    if (completedIds.includes(id)) {
      setMessage("Already marked as completed.");
      return;
    }
    const nextCompleted = [...completedIds, id];
    save({ ...profile, completedIds: nextCompleted });
    setMessage(
      "Marked as completed. Entry-level roles may unlock as you finish more internships.",
    );
  }

  useEffect(() => {
    if (expandedId && expandedRef.current) {
      expandedRef.current.focus({ preventScroll: true });
    }
  }, [expandedId]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8" style={{ viewTransitionName: "vt-content" }}>
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
          {items.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const isSaved = savedIds.includes(item.id);
            const isCompleted = completedIds.includes(item.id);
            return (
              <div
                key={`${item.id}-${item.source ?? "job"}-${index}`}
                className={`transition-all duration-200 ease-out ${
                  isExpanded ? "z-10 col-span-full scale-[1.02] md:scale-100" : ""
                }`}
                onClick={() => {
                  setMessage(null);
                  setExpandedId(isExpanded ? null : item.id);
                }}
                role="button"
                tabIndex={isExpanded ? 0 : -1}
                ref={isExpanded ? expandedRef : undefined}
                aria-expanded={isExpanded}
              >
                <div
                  className={
                    isExpanded
                      ? "rounded-xl border-2 border-zinc-300 bg-white p-6 shadow-md"
                      : ""
                  }
                >
                  <MatchedInternshipCard
                    item={item}
                    disableTitleLink
                  />
                  {isExpanded && (
                    <div
                      className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2 className="text-sm font-semibold text-zinc-900">
                        Actions
                      </h2>
                      <div className="mt-3 flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => toggleSaved(item.id)}
                        >
                          {isSaved ? "Unsave" : "Save for later"}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => markCompleted(item.id)}
                        >
                          {isCompleted ? "Completed" : "Mark as completed"}
                        </Button>
                      </div>
                      {message && (
                        <p className="mt-3 text-xs text-zinc-600" role="status">
                          {message}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-zinc-500">
                        Click the card again to collapse.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
