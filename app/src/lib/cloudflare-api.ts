/**
 * UncookedAura – Cloudflare Workers API client.
 * Workers can use R2 bindings to serve job data; this frontend only calls the Worker URL.
 */

import { env } from "./env";

export interface JobListing {
  jobTitle: string;
  company: string;
}

export interface JobsResponse {
  jobs: JobListing[];
  /** Optional cursor for pagination */
  nextCursor?: string;
}

const DEFAULT_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

function buildHeaders(): Record<string, string> {
  const headers = { ...DEFAULT_HEADERS };
  if (env.apiKey) {
    headers["X-API-Key"] = env.apiKey;
  }
  return headers;
}

/**
 * Fetches job listings from the Cloudflare Worker (R2-backed).
 * Returns empty array if Workers API is not configured or request fails.
 */
export async function fetchJobs(options?: {
  cursor?: string;
  limit?: number;
  major?: string; // e.g. "cs" | "engineering" for Comp Sci & Engineering focus
}): Promise<JobsResponse> {
  if (!env.useWorkersApi) {
    return { jobs: [] };
  }

  const url = new URL(env.workersApiUrl);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  if (path === "/") {
    url.pathname = "/api/jobs";
  }
  if (options?.cursor) url.searchParams.set("cursor", options.cursor);
  if (options?.limit != null) url.searchParams.set("limit", String(options.limit));
  if (options?.major) url.searchParams.set("major", options.major);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: buildHeaders(),
    });

    if (!res.ok) {
      console.warn("[UncookedAura] Workers API error:", res.status, await res.text());
      return { jobs: [] };
    }

    const data = (await res.json()) as JobsResponse;
    return {
      jobs: Array.isArray(data.jobs) ? data.jobs : [],
      nextCursor: data.nextCursor,
    };
  } catch (err) {
    console.warn("[UncookedAura] Workers API fetch failed:", err);
    return { jobs: [] };
  }
}
