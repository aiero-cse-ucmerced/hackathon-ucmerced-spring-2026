/**
 * Client-side cache of job listings from the Jobs page search.
 * The internship detail page reads from this when the user navigated from Jobs
 * so the listing can be shown and Save / Mark completed work.
 */

import type { MatchedListing } from "./internships-api";

let cache: MatchedListing[] = [];

export function setJobsSearchCache(items: MatchedListing[]): void {
  cache = items;
}

export function getJobsSearchListing(id: string): MatchedListing | undefined {
  return cache.find((item) => item.id === id);
}
