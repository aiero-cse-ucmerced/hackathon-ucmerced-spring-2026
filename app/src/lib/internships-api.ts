/**
 * UncookedAura – Profile & internships API client.
 * Used for onboarding and dashboard; calls Workers profile endpoints when available.
 */

import { env } from "./env";

export interface UserProfile {
  name?: string;
  email?: string;
  major?: string;
  avatarUrl?: string | null;
  interests: string[];
  strengths: string[];
  pastExperiences: string[];
  completedIds?: string[];
  savedIds?: string[];
  minScore?: number;
}

export const WORKING_FIELD_INTERESTS = [
  "Web Development",
  "Data Science & Analytics",
  "Software Engineering",
  "Product Management",
  "UX / Product Design",
  "Marketing & Growth",
  "Finance & Accounting",
  "Research & Lab",
  "Consulting",
  "Content & Writing",
  "DevOps & Cloud",
  "Mobile Development",
  "Cybersecurity",
  "HR & Recruiting",
  "Operations",
  "Sales & Business Dev",
] as const;

export type WorkingFieldInterest = (typeof WORKING_FIELD_INTERESTS)[number];

export const STRENGTH_OPTIONS = [
  "Problem solving",
  "Communication",
  "Leadership",
  "Technical skills",
  "Creativity",
  "Analytical thinking",
  "Collaboration",
  "Time management",
  "Adaptability",
  "Attention to detail",
  "Research",
  "Writing",
] as const;

const PROFILE_STORAGE_KEY = "uncookedaura_profile";
const ONBOARDING_DONE_KEY = "uncookedaura_onboarding_done";

function buildHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (env.apiKey) headers["X-API-Key"] = env.apiKey;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/**
 * Fetches user profile from Workers API. Falls back to localStorage when API is unavailable.
 */
export async function getProfile(token?: string): Promise<UserProfile | null> {
  if (env.useWorkersApi && token) {
    try {
      const url = `${env.workersApiUrl}/api/profile`;
      const res = await fetch(url, { method: "GET", headers: buildHeaders(token) });
      if (res.ok) {
        const data = (await res.json()) as UserProfile;
        return {
          ...data,
          interests: data.interests ?? [],
          strengths: data.strengths ?? [],
          pastExperiences: data.pastExperiences ?? [],
        };
      }
    } catch (e) {
      console.warn("[UncookedAura] getProfile failed:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as UserProfile;
        return {
          ...data,
          interests: data.interests ?? [],
          strengths: data.strengths ?? [],
          pastExperiences: data.pastExperiences ?? [],
        };
      }
    } catch {
      // ignore
    }
  }
  return null;
}

/**
 * Updates user profile (onboarding or profile edit). Persists to Workers when available, else localStorage.
 * Accepts name, email, major to seed from auth when completing onboarding.
 */
export async function patchProfile(
  payload: Partial<
    Pick<
      UserProfile,
      | "name"
      | "email"
      | "major"
      | "avatarUrl"
      | "interests"
      | "strengths"
      | "pastExperiences"
      | "completedIds"
      | "savedIds"
      | "minScore"
    >
  >,
  token?: string
): Promise<UserProfile> {
  const next: UserProfile = {
    interests: payload.interests ?? [],
    strengths: payload.strengths ?? [],
    pastExperiences: payload.pastExperiences ?? [],
  };

  if (env.useWorkersApi && token) {
    try {
      const url = `${env.workersApiUrl}/api/profile`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: buildHeaders(token),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = (await res.json()) as UserProfile;
        return { ...next, ...data };
      }
    } catch (e) {
      console.warn("[UncookedAura] patchProfile failed:", e);
    }
  }

  if (typeof window !== "undefined") {
    const existing = await getProfile(token);
    const merged: UserProfile = {
      ...existing,
      ...next,
      name: payload.name ?? existing?.name,
      email: payload.email ?? existing?.email,
      major: payload.major ?? existing?.major,
      avatarUrl: payload.avatarUrl !== undefined ? payload.avatarUrl : existing?.avatarUrl,
      interests: payload.interests ?? existing?.interests ?? [],
      strengths: payload.strengths ?? existing?.strengths ?? [],
      pastExperiences: payload.pastExperiences ?? existing?.pastExperiences ?? [],
      completedIds: payload.completedIds ?? existing?.completedIds,
      savedIds: payload.savedIds ?? existing?.savedIds,
      minScore: payload.minScore ?? existing?.minScore,
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged));
    setOnboardingComplete();
    return merged;
  }

  return next;
}

export function isOnboardingComplete(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDING_DONE_KEY) === "true";
}

export function setOnboardingComplete(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ONBOARDING_DONE_KEY, "true");
  }
}

export function clearOnboardingState(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ONBOARDING_DONE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  }
}

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
  score: number;
}

export async function fetchInternships(params: {
  type: InternshipKind;
  interests: string[];
  major?: string;
  strengths?: string[];
  minScore: number;
  page?: number;
  /** Free-form search keywords (e.g. from Jobs page search bar). */
  keywords?: string;
  /** Location for job search (e.g. city or zip). */
  location?: string;
}): Promise<{ items: MatchedListing[]; kind: InternshipKind }> {
  const search = new URLSearchParams();
  search.set("type", params.type);
  search.set("interests", params.interests.join(","));
  if (params.major) search.set("major", params.major);
  if (params.strengths?.length) search.set("strengths", params.strengths.join(","));
  search.set("minScore", String(params.minScore));
  if (params.page != null) search.set("page", String(params.page));
  if (params.keywords?.trim()) search.set("keywords", params.keywords.trim());
  if (params.location?.trim()) search.set("location", params.location.trim());

  const url = `/api/internships?${search.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    return { items: [], kind: params.type };
  }
  const data = (await res.json()) as { items: MatchedListing[]; kind: InternshipKind };
  return { items: data.items ?? [], kind: data.kind ?? params.type };
}
