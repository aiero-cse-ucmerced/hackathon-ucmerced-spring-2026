import { ViewTransitionLink } from "@/components/ViewTransitionLink";
import { Badge } from "@/components/ui/badge";
import type { MatchedListing } from "@/lib/internships-api";
import { buildInternshipSlug } from "@/lib/internship-slug";

function extractCardKeywords(item: MatchedListing): string[] {
  const seen = new Set<string>();
  const add = (s: string) => {
    const t = s.trim();
    if (t.length >= 2 && t.length <= 25 && !seen.has(t.toLowerCase())) {
      seen.add(t.toLowerCase());
      return t;
    }
    return null;
  };
  const keywords: string[] = [];
  if (item.type && add(item.type)) keywords.push(item.type);
  const text = `${item.title} ${item.snippet ?? ""}`.toLowerCase();
  const terms = ["react", "python", "data", "analytics", "frontend", "remote", "ux", "marketing", "finance", "engineering"];
  for (const term of terms) {
    if (text.includes(term) && add(term)) keywords.push(term.charAt(0).toUpperCase() + term.slice(1));
  }
  return keywords.slice(0, 4);
}

export function MatchedInternshipCard({
  item,
  disableTitleLink,
}: {
  item: MatchedListing;
  disableTitleLink?: boolean;
}) {
  const keywords = extractCardKeywords(item);
  const detailHref = `/dashboard/internships/${buildInternshipSlug(item)}`;

  const content = (
    <article className="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-zinc-900">
              {disableTitleLink ? (
                <span className="block">{item.title}</span>
              ) : (
                <ViewTransitionLink
                  href={detailHref}
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 rounded"
                >
                  {item.title}
                </ViewTransitionLink>
              )}
            </h3>
            <p className="mt-1 text-xs font-medium tracking-wide text-zinc-500">
              {item.company}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0 font-medium">
            {item.score}% match
          </Badge>
        </div>
        {item.location ? (
          <p className="mt-2 text-xs text-zinc-500">{item.location}</p>
        ) : null}
        {keywords.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {keywords.map((kw) => (
              <Badge key={kw} variant="outline" className="text-[10px] font-normal">
                {kw}
              </Badge>
            ))}
          </div>
        )}
        {item.snippet ? (
          <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-zinc-600">
            {item.snippet}
          </p>
        ) : null}
      </div>
      <div className="mt-3 flex items-center justify-between pt-1 text-xs text-zinc-500">
        <span>{item.source}</span>
        <div className="flex items-center gap-2">
          {!disableTitleLink && (
            <ViewTransitionLink
              href={detailHref}
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              View details
            </ViewTransitionLink>
          )}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-zinc-900 underline underline-offset-2"
              onClick={disableTitleLink ? (e) => e.stopPropagation() : undefined}
            >
              Apply
            </a>
          )}
        </div>
      </div>
    </article>
  );

  return content;
}

