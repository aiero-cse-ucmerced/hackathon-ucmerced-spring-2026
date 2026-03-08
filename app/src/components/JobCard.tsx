export interface JobCardProps {
  jobTitle: string;
  company: string;
  /** Fit score (0–100) for landing page — matches pitch: "fit score for every listing" */
  fitScore?: number;
  /** Use landing variant: polished card with fit badge, Syne typography */
  variant?: "default" | "landing";
}

export function JobCard({ jobTitle, company, fitScore, variant = "default" }: JobCardProps) {
  if (variant === "landing") {
    return (
      <article
        className="group relative flex min-h-[100px] flex-col justify-between overflow-hidden rounded-xl border border-zinc-200/90 bg-white px-5 py-4 shadow-md shadow-zinc-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-200/80 hover:shadow-lg hover:shadow-amber-500/10"
        style={{ fontFamily: "var(--font-dm-sans), var(--font-poppins), sans-serif" }}
      >
        {fitScore != null && (
          <span className="absolute right-3 top-3 rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-700">
            {fitScore}% match
          </span>
        )}
        <div className="pr-16">
          <p
            className="text-sm font-semibold leading-snug text-zinc-900"
            style={{ fontFamily: "var(--font-syne), var(--font-poppins), sans-serif" }}
          >
            {jobTitle}
          </p>
          <p className="mt-1.5 text-xs font-medium text-zinc-500">{company}</p>
        </div>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-amber-600/80">
          Matched by interests
        </p>
      </article>
    );
  }

  return (
    <article className="flex min-h-[88px] flex-col justify-center rounded-lg border border-zinc-200/80 bg-white px-5 py-4 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-zinc-900">{jobTitle}</p>
      <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">{company}</p>
    </article>
  );
}
