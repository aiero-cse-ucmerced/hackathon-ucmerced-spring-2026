"use client";

import { useEffect, useState } from "react";
import { fetchJobs, type JobListing } from "./cloudflare-api";

/** Default listings for Comp Sci & Engineering focus when Workers API is not configured. */
export const MOCK_JOBS: JobListing[] = [
  { jobTitle: "SOFTWARE SYSTEM ENGINEER", company: "APPLE" },
  { jobTitle: "SENIOR FINANCIAL ANALYST", company: "J.P MORGAN AND CHASE" },
  { jobTitle: "AI RESEARCHER", company: "GOOGLE" },
  { jobTitle: "AMAZON WAREHOUSE MANAGER", company: "AMAZON" },
  { jobTitle: "CYBERSECURITY LEAD", company: "CISCO" },
  { jobTitle: "H.R MANAGER", company: "WALMART INC." },
];

export function useJobs(options?: { major?: string }) {
  const [jobs, setJobs] = useState<JobListing[]>(MOCK_JOBS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { jobs: nextJobs } = await fetchJobs({
        limit: 12,
        major: options?.major,
      });
      if (!cancelled) {
        setJobs(nextJobs.length > 0 ? nextJobs : MOCK_JOBS);
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [options?.major]);

  return { jobs, loading };
}
