/**
 * URL slug for internship detail: job-title-at-company--id
 * Enables readable URLs like /dashboard/internships/software-engineer-intern-at-meta--abc123
 */

import type { MatchedListing } from "./internships-api";

function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "job";
}

/** Build slug from listing: job-title-at-company--id */
export function buildInternshipSlug(listing: MatchedListing): string {
  const titleSlug = slugify(listing.title);
  const companySlug = slugify(listing.company);
  const id = encodeURIComponent(listing.id);
  return `${titleSlug}-at-${companySlug}--${id}`;
}

/** Parse slug: extract id for lookup. Supports legacy plain-id URLs. */
export function parseInternshipSlug(slug: string): string {
  const decoded = decodeURIComponent(slug);
  const idx = decoded.lastIndexOf("--");
  if (idx >= 0) {
    return decoded.slice(idx + 2);
  }
  return decoded;
}
