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
  age?: number;
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
const RESUME_STORAGE_KEY = "uncookedaura_resume";

export type StoredResume = {
  fileName: string;
  mimeType: string;
  base64: string;
  uploadedAt: string;
};

export function storeResume(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      if (!base64) {
        reject(new Error("Failed to read file"));
        return;
      }
      const data: StoredResume = {
        fileName: file.name,
        mimeType: file.type,
        base64,
        uploadedAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data));
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        resolve();
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function getStoredResume(): StoredResume | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RESUME_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredResume;
  } catch {
    return null;
  }
}

export function clearStoredResume(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(RESUME_STORAGE_KEY);
  }
}

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
        // Returning users: if profile has interests from API, consider onboarding complete
        if (profile.interests && profile.interests.length >= 3) {
          setOnboardingComplete();
        }
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
      | "age"
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
    age: payload.age,
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
      age: payload.age !== undefined ? payload.age : existing?.age,
      avatarUrl: payload.avatarUrl !== undefined ? payload.avatarUrl : existing?.avatarUrl,
      interests: payload.interests ?? existing?.interests ?? [],
      strengths: payload.strengths ?? existing?.strengths ?? [],
      pastExperiences: payload.pastExperiences ?? existing?.pastExperiences ?? [],
      completedIds: payload.completedIds ?? existing?.completedIds,
      savedIds: payload.savedIds ?? existing?.savedIds,
      minScore: payload.minScore ?? existing?.minScore,
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged));
    // Do NOT set onboarding complete here – only OnboardingFlow does that when user clicks Finish.
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
    localStorage.removeItem(RESUME_STORAGE_KEY);
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
          age: local.age,
          avatarUrl: local.avatarUrl ?? null,
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

  const query = search.toString();
  const fallbackUrl = `/api/internships?${query}`;

  if (env.useWorkersApi) {
    const workerUrl = `${env.workersApiUrl}/api/internships?${query}`;
    const headers: Record<string, string> = {};
    if (env.apiKey) headers["X-API-Key"] = env.apiKey;
    const res = await fetch(workerUrl, { headers });
    if (res.ok) {
      const data = (await res.json()) as { items: MatchedListing[]; kind: InternshipKind };
      return { items: data.items ?? [], kind: data.kind ?? params.type };
    }
  }

  const res = await fetch(fallbackUrl);
  if (!res.ok) {
    return { items: [], kind: params.type };
  }
  const data = (await res.json()) as { items: MatchedListing[]; kind: InternshipKind };
  return { items: data.items ?? [], kind: data.kind ?? params.type };
}
