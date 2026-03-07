"use client";

import { JobCard } from "./JobCard";

const JOBS = [
  { jobTitle: "SOFTWARE SYSTEM ENGINEER", company: "APPLE" },
  { jobTitle: "SENIOR FINANCIAL ANAYST", company: "J.P MORGAN AND CHASE" },
  { jobTitle: "AI RESEARCHER", company: "GOOGLE" },
  { jobTitle: "AMAZON WAREHOUSE MANAGER", company: "AMAZON" },
  { jobTitle: "CYBERSECURITY LEAD", company: "CISCO" },
  { jobTitle: "H.R MANAGER", company: "WALMART INC." },
];

const GRID_WIDTH = 280 * 3 + 16 * 2; // 3 cards + 2 gaps

function JobGrid({ blockIndex }: { blockIndex: number }) {
  return (
    <div
      className="grid shrink-0 grid-cols-3 grid-rows-2 gap-4"
      style={{ width: GRID_WIDTH }}
    >
      {JOBS.map((job) => (
        <JobCard
          key={`${blockIndex}-${job.jobTitle}`}
          jobTitle={job.jobTitle}
          company={job.company}
        />
      ))}
    </div>
  );
}

export function JobListingsMarquee() {
  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="flex w-max animate-[marquee_50s_linear_infinite] gap-8">
        <JobGrid blockIndex={0} />
        <JobGrid blockIndex={1} />
        <JobGrid blockIndex={2} />
      </div>
    </section>
  );
}
