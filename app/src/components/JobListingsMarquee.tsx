"use client";

import { JobCard } from "./JobCard";
import { useJobs } from "@/lib/use-jobs";

const GRID_WIDTH = 280 * 3 + 16 * 2; // 3 cards + 2 gaps

function JobGrid({
  blockIndex,
  jobs,
}: {
  blockIndex: number;
  jobs: { jobTitle: string; company: string }[];
}) {
  return (
    <div
      className="grid shrink-0 grid-cols-3 grid-rows-2 gap-4"
      style={{ width: GRID_WIDTH }}
    >
      {jobs.map((job) => (
        <JobCard
          key={`${blockIndex}-${job.jobTitle}-${job.company}`}
          jobTitle={job.jobTitle}
          company={job.company}
        />
      ))}
    </div>
  );
}

export function JobListingsMarquee() {
  const { jobs, loading } = useJobs({ major: "cs" });

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-white py-16">
        <div className="mx-auto max-w-6xl px-6 text-center text-zinc-500">
          Loading job listings…
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="flex w-max animate-[marquee_50s_linear_infinite] gap-8">
        <JobGrid blockIndex={0} jobs={jobs} />
        <JobGrid blockIndex={1} jobs={jobs} />
        <JobGrid blockIndex={2} jobs={jobs} />
      </div>
    </section>
  );
}
