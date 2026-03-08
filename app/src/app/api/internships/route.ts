import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
  /** Fit score 1–100. Percentile-normalized so ~5% are highly matched; Gemini used when configured. */
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

/** Raw score 0–100 for ranking. 0 matches = low score so jobs sort to bottom. */
function computeRawScore(
  job: JoobleJob,
  interests: string[],
  major?: string,
  strengths?: string[],
): number {
  const haystack = `${job.title} ${job.snippet ?? ""} ${job.type ?? ""}`.toLowerCase();

  if (!haystack.trim()) {
    return 30;
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

  // 0 matches → 15 (bottom of distribution); 1–6+ → 35–100
  if (matches === 0) return 15;
  const clamped = Math.min(matches, 6);
  return 35 + Math.round((clamped / 6) * 65);
}

/**
 * Normalize scores by percentile so only ~5% get high scores (85–100).
 * Ensures realistic distribution: top 5% highly matched, rest spread across lower tiers.
 */
function normalizeScoresByPercentile(items: MatchedListing[]): MatchedListing[] {
  if (items.length === 0) return items;
  const sorted = [...items].sort((a, b) => b.score - a.score);
  return sorted.map((item, i) => {
    const p = (i + 1) / sorted.length; // 1 = top
    let displayScore: number;
    if (p >= 0.95) displayScore = 85 + Math.round(((p - 0.95) / 0.05) * 15);
    else if (p >= 0.80) displayScore = 70 + Math.round(((p - 0.80) / 0.15) * 14);
    else if (p >= 0.50) displayScore = 50 + Math.round(((p - 0.50) / 0.30) * 19);
    else if (p >= 0.05) displayScore = 25 + Math.round(((p - 0.05) / 0.45) * 24);
    else displayScore = 15;
    return { ...item, score: Math.min(100, Math.max(15, Math.round(displayScore))) };
  });
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
    id: "mock-software-intern",
    title: "Software Engineering Intern",
    company: "TechFlow",
    location: "Austin, TX",
    snippet:
      "Contribute to backend services and APIs. Experience with Python or Node.js preferred.",
    type: "Internship",
  },
  {
    id: "mock-ux-intern",
    title: "UX Design Intern",
    company: "Pixel Labs",
    location: "New York, NY",
    snippet:
      "Help design user flows and prototypes. Figma experience a plus.",
    type: "Internship",
  },
  {
    id: "mock-devops-intern",
    title: "DevOps Intern",
    company: "CloudNine",
    location: "Denver, CO",
    snippet:
      "Support CI/CD pipelines and cloud infrastructure. AWS or GCP exposure helpful.",
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
  {
    id: "mock-entry-level-be",
    title: "Entry-level Backend Engineer",
    company: "DataDrive",
    location: "Boston, MA",
    snippet:
      "Develop APIs and data pipelines. Python or Java experience preferred.",
    type: "Full-time",
  },
];

/** In-memory cache for Jooble responses to stay under ~500 req/day rate limit. TTL 15 min. */
const JOOBLE_CACHE_TTL_MS = 15 * 60 * 1000;
const joobleCache = new Map<string, { body: string; expires: number }>();

/** Cache for Gemini-scored results. 1h TTL to minimize AI calls. */
const GEMINI_SCORE_CACHE_TTL_MS = 60 * 60 * 1000;
const geminiScoreCache = new Map<string, { scores: Map<string, number>; expires: number }>();

function geminiCacheKey(
  interests: string[],
  strengths: string[],
  major: string | undefined,
  jobIds: string[],
): string {
  const payload = [
    interests.slice().sort().join(","),
    strengths.slice().sort().join(","),
    major ?? "",
    jobIds.slice().sort().join(","),
  ].join("::");
  return createHash("sha256").update(payload).digest("hex").slice(0, 32);
}

/**
 * Use Gemini to personalize fit scores. Only ~5% of jobs get 85+.
 * Cached aggressively to reduce AI calls.
 */
async function scoreWithGemini(
  items: MatchedListing[],
  interests: string[],
  strengths: string[],
  major?: string,
): Promise<Map<string, number> | null> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim();
  if (!apiKey || items.length === 0) return null;

  const cacheKey = geminiCacheKey(
    interests,
    strengths,
    major,
    items.map((i) => i.id),
  );
  const now = Date.now();
  const cached = geminiScoreCache.get(cacheKey);
  if (cached && cached.expires > now) {
    return cached.scores;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const profile = [
      interests.length ? `Interests: ${interests.join(", ")}` : "",
      strengths.length ? `Strengths: ${strengths.join(", ")}` : "",
      major ? `Major: ${major}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const jobList = items
      .slice(0, 50)
      .map(
        (j, i) =>
          `${i + 1}. [${j.id}] ${j.title} @ ${j.company} | ${(j.snippet ?? "").slice(0, 120)}`,
      )
      .join("\n");

    const prompt = `You are scoring job fit for a student. Profile:
${profile || "No profile yet."}

Jobs to score (id, title, company, snippet):
${jobList}

For each job, assign a fit score 1-100. IMPORTANT: Only give 85+ to roughly 5% of jobs (the best fits). Most jobs should be 25-70. Return ONLY valid JSON:
{"scores": {"job_id": score, ...}}

Use the exact job IDs from the list.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text) return null;

    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned) as { scores?: Record<string, number> };
    const scores = parsed.scores ?? {};
    const scoreMap = new Map<string, number>();
    for (const [id, s] of Object.entries(scores)) {
      const n = Number(s);
      if (Number.isFinite(n)) scoreMap.set(id, Math.min(100, Math.max(1, Math.round(n))));
    }

    geminiScoreCache.set(cacheKey, {
      scores: scoreMap,
      expires: now + GEMINI_SCORE_CACHE_TTL_MS,
    });
    return scoreMap;
  } catch (e) {
    console.warn("[UncookedAura] Gemini scoring failed", e);
    return null;
  }
}

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
  const minScore = Number.parseInt(searchParams.get("minScore") ?? "30", 10);
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
      const rawScore = computeRawScore(job, interests, major, strengths);
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
        score: rawScore,
      } satisfies MatchedListing;
    })
    .sort((a, b) => b.score - a.score);

  const geminiScores = await scoreWithGemini(matched, interests, strengths, major);
  if (geminiScores && geminiScores.size > 0) {
    matched = matched
      .map((item) => {
        const geminiScore = geminiScores.get(item.id);
        const score = geminiScore != null ? geminiScore : item.score;
        return { ...item, score };
      })
      .sort((a, b) => b.score - a.score);
  }

  matched = normalizeScoresByPercentile(matched);
  matched = matched.filter((item) => item.score >= minScore);

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

