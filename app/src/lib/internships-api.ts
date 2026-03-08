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

export const MAJOR_OPTIONS = [
  "CSE",
  "CS",
  "Applied Math",
  "Engineering",
  "Data Science",
  "Business",
  "Others",
] as const;

export type MajorOption = (typeof MAJOR_OPTIONS)[number];

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
const PENDING_SYNC_KEY = "uncookedaura_profile_pending_sync";

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
 * Reads profile from localStorage only (sync, for offline-first).
 */
function getLocalProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
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
  return null;
}

/**
 * Fetches user profile. Offline-first: always returns localStorage data immediately when available.
 * When online, syncs from API and updates localStorage.
 */
export async function getProfile(token?: string): Promise<UserProfile | null> {
  const local = getLocalProfile();

  if (typeof window !== "undefined" && env.useWorkersApi && token && navigator.onLine) {
    try {
      const url = `${env.workersApiUrl}/api/profile`;
      const res = await fetch(url, { method: "GET", headers: buildHeaders(token) });
      if (res.ok) {
        const data = (await res.json()) as UserProfile;
        const profile: UserProfile = {
          ...data,
          interests: data.interests ?? [],
          strengths: data.strengths ?? [],
          pastExperiences: data.pastExperiences ?? [],
        };
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        return profile;
      }
    } catch (e) {
      console.warn("[UncookedAura] getProfile API failed:", e);
    }
  }

  return local;
}

/**
 * Updates user profile. Offline-first: always saves to localStorage immediately.
 * When online, syncs to Workers API.
 */
export async function patchProfile(
  payload: Partial<
    Pick<
      UserProfile,
      | "name"
      | "email"
      | "major"
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

  let merged: UserProfile;

  if (typeof window !== "undefined") {
    const existing = getLocalProfile();
    merged = {
      ...existing,
      ...next,
      name: payload.name ?? existing?.name,
      email: payload.email ?? existing?.email,
      major: payload.major ?? existing?.major,
      interests: payload.interests ?? existing?.interests ?? [],
      strengths: payload.strengths ?? existing?.strengths ?? [],
      pastExperiences: payload.pastExperiences ?? existing?.pastExperiences ?? [],
      completedIds: payload.completedIds ?? existing?.completedIds,
      savedIds: payload.savedIds ?? existing?.savedIds,
      minScore: payload.minScore ?? existing?.minScore,
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged));
    setOnboardingComplete();
  } else {
    merged = {
      ...next,
      interests: next.interests,
      strengths: next.strengths,
      pastExperiences: next.pastExperiences,
    };
  }

  if (typeof window !== "undefined" && env.useWorkersApi && token && navigator.onLine) {
    try {
      const url = `${env.workersApiUrl}/api/profile`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: buildHeaders(token),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = (await res.json()) as UserProfile;
        const synced: UserProfile = {
          ...data,
          interests: data.interests ?? [],
          strengths: data.strengths ?? [],
          pastExperiences: data.pastExperiences ?? [],
        };
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(synced));
        localStorage.removeItem(PENDING_SYNC_KEY);
        return synced;
      }
    } catch (e) {
      console.warn("[UncookedAura] patchProfile API failed:", e);
      localStorage.setItem(PENDING_SYNC_KEY, "true");
    }
  }

  return merged;
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
    localStorage.removeItem(PENDING_SYNC_KEY);
  }
}

/**
 * Syncs local profile to API when coming back online. Pushes offline changes, then refreshes from server.
 */
export async function syncProfileWhenOnline(
  token: string | undefined,
  onSynced?: (profile: UserProfile | null) => void
): Promise<void> {
  if (typeof window === "undefined" || !navigator.onLine || !token) return;
  if (localStorage.getItem(PENDING_SYNC_KEY)) {
    const local = getLocalProfile();
    if (local) {
      await patchProfile(
        {
          name: local.name,
          email: local.email,
          major: local.major,
          interests: local.interests,
          strengths: local.strengths,
          pastExperiences: local.pastExperiences,
          completedIds: local.completedIds,
          savedIds: local.savedIds,
          minScore: local.minScore,
        },
        token
      );
    }
  }
  const p = await getProfile(token);
  onSynced?.(p ?? null);
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
  minScore: number;
  page?: number;
}): Promise<{ items: MatchedListing[]; kind: InternshipKind }> {
  const search = new URLSearchParams();
  search.set("type", params.type);
  search.set("interests", params.interests.join(","));
  if (params.major) search.set("major", params.major);
  search.set("minScore", String(params.minScore));
  if (params.page != null) search.set("page", String(params.page));

  const url = `/api/internships?${search.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    return { items: [], kind: params.type };
  }
  const data = (await res.json()) as { items: MatchedListing[]; kind: InternshipKind };
  return { items: data.items ?? [], kind: data.kind ?? params.type };
}
