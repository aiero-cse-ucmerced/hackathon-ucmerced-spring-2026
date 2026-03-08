"use client";

interface ResumeUploadLinksProps {
  title: string;
  company: string;
  applyLink?: string;
  className?: string;
}

const JOB_BOARDS = [
  {
    name: "LinkedIn",
    url: (q: string) =>
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q)}`,
  },
  {
    name: "Indeed",
    url: (q: string) =>
      `https://www.indeed.com/jobs?q=${encodeURIComponent(q)}`,
  },
  {
    name: "Glassdoor",
    url: (q: string) =>
      `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(q)}`,
  },
];

export function ResumeUploadLinks({
  title,
  company,
  applyLink,
  className = "",
}: ResumeUploadLinksProps) {
  const searchQuery = `${title} ${company}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-sm font-medium text-zinc-700">
        Upload your resume
      </p>
      <p className="text-xs text-zinc-500">
        Find this role on recruitment sites to submit your resume.
      </p>
      <div className="flex flex-wrap gap-2">
        {applyLink && (
          <a
            href={applyLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Original posting
          </a>
        )}
        {JOB_BOARDS.map((board) => (
          <a
            key={board.name}
            href={board.url(searchQuery)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            {board.name}
          </a>
        ))}
      </div>
    </div>
  );
}
