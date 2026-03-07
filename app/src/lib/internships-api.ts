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
 */
export async function patchProfile(
  payload: Partial<Pick<UserProfile, "interests" | "strengths" | "pastExperiences">>,
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
      interests: payload.interests ?? existing?.interests ?? [],
      strengths: payload.strengths ?? existing?.strengths ?? [],
      pastExperiences: payload.pastExperiences ?? existing?.pastExperiences ?? [],
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
