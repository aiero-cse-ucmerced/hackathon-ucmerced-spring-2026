"use client";

import { JobCard } from "./JobCard";
import { useJobs } from "@/lib/use-jobs";

const CARDS_PER_ROW = 8;
const ROWS = 2;
const GRID_WIDTH = 300 * CARDS_PER_ROW + 20 * (CARDS_PER_ROW - 1);

/** Curated internship/tech roles with fit scores — matches pitch: CS & engineering, fit score for every listing */
const LANDING_JOBS: { jobTitle: string; company: string; fitScore: number }[] = [
  { jobTitle: "Software Engineering Intern", company: "Meta", fitScore: 94 },
  { jobTitle: "Data Science Intern", company: "Spotify", fitScore: 88 },
  { jobTitle: "Product Design Intern", company: "Pinterest", fitScore: 91 },
  { jobTitle: "Frontend Dev Intern", company: "Vercel", fitScore: 96 },
  { jobTitle: "ML Research Intern", company: "Google", fitScore: 89 },
  { jobTitle: "DevOps Intern", company: "Stripe", fitScore: 82 },
  { jobTitle: "UX Research Intern", company: "Apple", fitScore: 87 },
  { jobTitle: "Backend Intern", company: "Discord", fitScore: 93 },
  { jobTitle: "Cybersecurity Intern", company: "Cloudflare", fitScore: 85 },
  { jobTitle: "Full-Stack Intern", company: "Linear", fitScore: 90 },
  { jobTitle: "Data Analyst Intern", company: "Notion", fitScore: 84 },
  { jobTitle: "Mobile Dev Intern", company: "Snap", fitScore: 86 },
  { jobTitle: "Infrastructure Intern", company: "Netflix", fitScore: 81 },
  { jobTitle: "Growth Engineering Intern", company: "Figma", fitScore: 92 },
  { jobTitle: "Security Intern", company: "1Password", fitScore: 88 },
  { jobTitle: "Platform Intern", company: "Twitch", fitScore: 79 },
];

function JobGrid({
  blockIndex,
  jobs,
}: {
  blockIndex: number;
  jobs: { jobTitle: string; company: string; fitScore: number }[];
}) {
  return (
    <div
      className="grid shrink-0 grid-cols-8 grid-rows-2 gap-5"
      style={{ width: GRID_WIDTH }}
    >
      {jobs.map((job) => (
        <JobCard
          key={`${blockIndex}-${job.jobTitle}-${job.company}`}
          jobTitle={job.jobTitle}
          company={job.company}
          fitScore={job.fitScore}
          variant="landing"
        />
      ))}
    </div>
  );
}

export function JobListingsMarquee() {
  const { jobs, loading } = useJobs({ major: "cs" });

  if (loading) {
    return (
      <section className="relative overflow-hidden border-t border-zinc-100 bg-gradient-to-b from-amber-50/30 to-white py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm font-medium text-zinc-500">Loading internships…</p>
        </div>
      </section>
    );
  }

  /** Merge API jobs (with placeholder fit) and curated landing jobs, prefer landing data */
  const apiJobsWithScore = jobs.slice(0, 8).map((j, i) => ({
    jobTitle: j.jobTitle,
    company: j.company,
    fitScore: 78 + (i % 5) * 4,
  }));
  const displayJobs =
    apiJobsWithScore.length >= CARDS_PER_ROW * ROWS
      ? apiJobsWithScore.slice(0, CARDS_PER_ROW * ROWS)
      : LANDING_JOBS.slice(0, CARDS_PER_ROW * ROWS);

  return (
    <section className="relative overflow-hidden border-t border-zinc-100 bg-gradient-to-b from-amber-50/40 to-white py-20 md:py-24">
      {/* Section intro — ties to pitch */}
      <div className="mx-auto mb-14 max-w-2xl px-6 text-center">
        <h2
          className="text-xl font-bold tracking-tight text-zinc-900 md:text-2xl"
          style={{ fontFamily: "var(--font-syne), var(--font-poppins), sans-serif" }}
        >
          Real internships. Real fit scores.
        </h2>
        <p className="mt-3 text-sm text-zinc-600">
          Every listing shows how well it matches your interests—no guessing.
        </p>
      </div>

      {/* Gradient fade edges */}
      <div
        className="pointer-events-none absolute left-0 top-1/2 z-10 h-[120%] w-24 -translate-y-1/2 bg-gradient-to-r from-amber-50/40 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-1/2 z-10 h-[120%] w-24 -translate-y-1/2 bg-gradient-to-l from-amber-50/40 to-transparent"
        aria-hidden
      />

      <div className="landing-marquee-track flex w-max gap-10">
        <JobGrid blockIndex={0} jobs={displayJobs} />
        <JobGrid blockIndex={1} jobs={displayJobs} />
        <JobGrid blockIndex={2} jobs={displayJobs} />
      </div>
    </section>
  );
}
