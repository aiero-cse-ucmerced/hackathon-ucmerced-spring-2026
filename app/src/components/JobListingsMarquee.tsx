"use client";

import { JobCard } from "./JobCard";
import { useJobs } from "@/lib/use-jobs";

const CARDS_PER_ROW = 8;
const ROWS = 2;
const GRID_WIDTH = 280 * CARDS_PER_ROW + 16 * (CARDS_PER_ROW - 1); // 8 cards + 7 gaps

const LANDING_EXTRA_JOBS: { jobTitle: string; company: string }[] = [
  { jobTitle: "Production Engineer", company: "Spotify" },
  { jobTitle: "Registered Nurse", company: "Kaiser Permanente" },
  { jobTitle: "Banking Manager", company: "Lehman Brothers" },
  { jobTitle: "Radiologist", company: "Sutter Health" },
  { jobTitle: "Digital Designer", company: "Pinterest" },
  { jobTitle: "Accountant", company: "Deloitte" },
  { jobTitle: "QA Engineer", company: "BlueShield" },
  { jobTitle: "Mechanical Engineer", company: "Lockheed Martin" },
  { jobTitle: "Field Quality Inspector", company: "Tesla" },
  { jobTitle: "Toxicologist", company: "AstraZeneca" },
  { jobTitle: "VR Systems Lead", company: "Meta" },
  { jobTitle: "Space Researcher", company: "NASA" },
];

function JobGrid({
  blockIndex,
  jobs,
}: {
  blockIndex: number;
  jobs: { jobTitle: string; company: string }[];
}) {
  return (
    <div
      className="grid shrink-0 grid-cols-8 grid-rows-2 gap-4"
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

  const displayJobs = [...jobs, ...LANDING_EXTRA_JOBS].slice(
    0,
    CARDS_PER_ROW * ROWS
  );

  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="flex w-max animate-[marquee_50s_linear_infinite] gap-8">
        <JobGrid blockIndex={0} jobs={displayJobs} />
        <JobGrid blockIndex={1} jobs={displayJobs} />
        <JobGrid blockIndex={2} jobs={displayJobs} />
      </div>
    </section>
  );
}
