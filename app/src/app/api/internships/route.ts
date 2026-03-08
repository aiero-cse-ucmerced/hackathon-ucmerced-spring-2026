import { NextResponse } from "next/server";

type JoobleJob = {
  id: string;
  title: string;
  company: string;
  location?: string;
  snippet?: string;
  salary?: string;
  type?: string;
  link?: string;
  source?: string;
  updated?: string;
};

export type InternshipKind = "internship" | "entry-level";

export interface MatchedListing {
  id: string;
  title: string;
  company: string;
  location?: string;
  snippet?: string;
  salary?: string;
  type?: string;
  link?: string;
  source?: string;
  updated?: string;
  kind: InternshipKind;
  /** Fit score, normalized 1–100 based on simple keyword overlap. */
  score: number;
}

function buildKeywords(
  kind: InternshipKind,
  interests: string[],
  major?: string,
  strengths?: string[],
) {
  const base: string[] = [];

  if (kind === "internship") {
    base.push("internship", "intern");
  } else {
    base.push("entry level", "junior");
  }

  if (major) {
    base.push(major);
  }

  return [...base, ...interests, ...(strengths ?? [])].join(" ");
}

function computeScore(
  job: JoobleJob,
  interests: string[],
  major?: string,
  strengths?: string[],
) {
  const haystack = `${job.title} ${job.snippet ?? ""} ${job.type ?? ""}`.toLowerCase();

  if (!haystack.trim()) {
    return 60;
  }

  let matches = 0;
  for (const interest of interests) {
    const token = interest.toLowerCase().trim();
    if (!token) continue;
    if (haystack.includes(token)) {
      matches += 1;
    }
  }
  for (const strength of strengths ?? []) {
    const token = strength.toLowerCase().trim();
    if (!token) continue;
    if (haystack.includes(token)) {
      matches += 1;
    }
  }

  if (major && haystack.includes(major.toLowerCase())) {
    matches += 1;
  }

  if (matches === 0) return 45;
  const clamped = Math.min(matches, 6);
  return 50 + clamped * 10;
}

async function fetchFromJooble(params: {
  kind: InternshipKind;
  interests: string[];
  major?: string;
  strengths?: string[];
  location?: string;
  page?: number;
  /** When set, used as Jooble keywords instead of buildKeywords(). */
  keywordsOverride?: string;
}): Promise<JoobleJob[]> {
  const apiKey = process.env.JOOBLE_API_KEY;
  if (!apiKey) {
    return [];
  }

  const keywords =
    params.keywordsOverride?.trim() ||
    buildKeywords(params.kind, params.interests, params.major, params.strengths);
  const body: Record<string, unknown> = {
    keywords,
  };
  if (params.location) body.location = params.location;
  if (params.page != null) body.page = params.page;

  const res = await fetch(`https://jooble.org/api/${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.warn(
      "[UncookedAura] Jooble API error",
      res.status,
      await res.text(),
    );
    return [];
  }

  const json = (await res.json()) as { jobs?: JoobleJob[] };
  return Array.isArray(json.jobs) ? json.jobs : [];
}

const FALLBACK_JOBS: JoobleJob[] = [
  {
    id: "mock-frontend-intern",
    title: "Frontend Engineer Intern",
    company: "Studio Ember",
    location: "Remote",
    snippet:
      "Work with React and TypeScript to build UI for student-facing tools.",
    type: "Internship",
  },
  {
    id: "mock-data-analyst-intern",
    title: "Data Analyst Intern",
    company: "Northwind Analytics",
    location: "San Francisco, CA",
    snippet:
      "Support analysts with dashboards, SQL queries, and experiments.",
    type: "Internship",
  },
  {
    id: "mock-entry-level-fe",
    title: "Entry-level Frontend Engineer",
    company: "Aurora Systems",
    location: "Seattle, WA",
    snippet:
      "Build production interfaces with React; ideal for recent graduates.",
    type: "Full-time",
  },
];

/** In-memory cache for Jooble responses to stay under ~500 req/day rate limit. TTL 15 min. */
const JOOBLE_CACHE_TTL_MS = 15 * 60 * 1000;
const joobleCache = new Map<string, { body: string; expires: number }>();

function joobleCacheKey(params: {
  kind: InternshipKind;
  interests: string[];
  strengths: string[];
  major?: string;
  location?: string;
  keywords?: string;
  page?: number;
  minScore: number;
}): string {
  const parts = [
    params.kind,
    params.interests.slice().sort().join(","),
    params.strengths.slice().sort().join(","),
    params.major ?? "",
    (params.location ?? "").trim().toLowerCase(),
    (params.keywords ?? "").trim().toLowerCase(),
    String(params.page ?? 0),
    String(params.minScore),
  ];
  return parts.join("|");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const kindParam = searchParams.get("type") as InternshipKind | null;
  const kind: InternshipKind = kindParam === "entry-level" ? "entry-level" : "internship";

  const rawInterests = searchParams.get("interests") ?? "";
  const interests = rawInterests
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const rawStrengths = searchParams.get("strengths") ?? "";
  const strengths = rawStrengths
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const major = searchParams.get("major") ?? undefined;
  const location = searchParams.get("location") ?? undefined;
  const keywordsOverride = searchParams.get("keywords") ?? undefined;
  const minScore = Number.parseInt(searchParams.get("minScore") ?? "50", 10);
  const pageParam = searchParams.get("page");
  const page = pageParam ? Number.parseInt(pageParam, 10) || undefined : undefined;

  const cacheKey = joobleCacheKey({
    kind,
    interests,
    strengths,
    major,
    location,
    keywords: keywordsOverride,
    page,
    minScore,
  });
  const now = Date.now();
  const cached = joobleCache.get(cacheKey);
  if (cached && cached.expires > now) {
    return new NextResponse(cached.body, {
      headers: { "Content-Type": "application/json", "X-Jooble-Cache": "HIT" },
    });
  }

  let jobs: JoobleJob[] = [];
  try {
    jobs = await fetchFromJooble({
      kind,
      interests,
      major,
      strengths,
      location,
      page,
      keywordsOverride,
    });
  } catch (error) {
    console.warn("[UncookedAura] Jooble fetch failed", error);
  }

  if (jobs.length === 0) {
    jobs = FALLBACK_JOBS;
  }

  let matched: MatchedListing[] = jobs
    .map((job) => {
      const score = computeScore(job, interests, major, strengths);
      return {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        snippet: job.snippet,
        salary: job.salary,
        type: job.type,
        link: job.link,
        source: job.source,
        updated: job.updated,
        kind,
        score,
      } satisfies MatchedListing;
    })
    .filter((item) => item.score >= minScore)
    .sort((a, b) => b.score - a.score);

  const rawQuery = keywordsOverride?.trim() ?? "";
  const prefix = rawQuery.toLowerCase().slice(0, 4);
  if (prefix.length > 0) {
    matched = matched.filter((item) => {
      const haystack = `${item.title} ${item.snippet ?? ""} ${item.type ?? ""}`.toLowerCase();
      return haystack.includes(prefix);
    });
  }

  const body = JSON.stringify({ items: matched, kind });
  joobleCache.set(cacheKey, { body, expires: now + JOOBLE_CACHE_TTL_MS });
  return new NextResponse(body, {
    headers: { "Content-Type": "application/json" },
  });
}

