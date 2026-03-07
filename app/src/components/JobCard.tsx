export interface JobCardProps {
  jobTitle: string;
  company: string;
}

export function JobCard({ jobTitle, company }: JobCardProps) {
  return (
    <article className="flex min-h-[88px] flex-col justify-center rounded-lg border border-zinc-200/80 bg-white px-5 py-4 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-zinc-900">
        {jobTitle}
      </p>
      <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {company}
      </p>
    </article>
  );
}
