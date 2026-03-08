import Link from "next/link";
import type { MatchedListing } from "@/lib/internships-api";

export function MatchedInternshipCard({
  item,
  disableTitleLink,
}: {
  item: MatchedListing;
  disableTitleLink?: boolean;
}) {
  return (
    <article className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              {disableTitleLink ? (
                <span className="block">{item.title}</span>
              ) : (
                <Link
                  href={`/dashboard/internships/${encodeURIComponent(item.id)}`}
                  className="hover:underline"
                >
                  {item.title}
                </Link>
              )}
            </h3>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
              {item.company}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            {item.score}% match
          </span>
        </div>
        {item.location ? (
          <p className="mt-2 text-xs text-zinc-500">{item.location}</p>
        ) : null}
        {item.snippet ? (
          <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-zinc-600">
            {item.snippet}
          </p>
        ) : null}
      </div>
      <div className="mt-3 flex items-center justify-between pt-1 text-xs text-zinc-500">
        <span>{item.source}</span>
        {item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-zinc-900 underline underline-offset-2"
            onClick={disableTitleLink ? (e) => e.stopPropagation() : undefined}
          >
            Apply
          </a>
        ) : null}
      </div>
    </article>
  );
}

