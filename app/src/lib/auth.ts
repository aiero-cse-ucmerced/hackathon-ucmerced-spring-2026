/**
 * Auth helpers – reads user/session from storage.
 * Wire to your auth system (Workers, etc.) when available.
 *
 * Expected localStorage keys (set by your auth on login):
 * - uncookedaura_user: JSON { email, name?, avatarUrl? }
 * - uncookedaura_token: JWT or session token string
 */

const USER_KEYS = ["uncookedaura_user", "user", "auth_user", "session"];
const TOKEN_KEYS = ["uncookedaura_token", "token", "auth_token", "access_token"];

export interface AuthUser {
  email: string;
  name?: string;
  avatarUrl?: string | null;
}

function parseUser(data: unknown): AuthUser | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const email = typeof obj.email === "string" ? obj.email : null;
  if (!email) return null;
  return {
    email,
    name: typeof obj.name === "string" ? obj.name : undefined,
    avatarUrl:
      typeof obj.avatarUrl === "string"
        ? obj.avatarUrl
        : obj.avatarUrl === null
          ? null
          : undefined,
  };
}

function extractUserFromObject(obj: Record<string, unknown>): AuthUser | null {
  const email =
    typeof obj.email === "string"
      ? obj.email
      : typeof (obj as { user?: { email?: string } }).user?.email === "string"
        ? (obj as { user: { email: string } }).user.email
        : null;
  if (!email) return null;
  const u = (obj.user ?? obj) as Record<string, unknown>;
  return {
    email,
    name: typeof u.name === "string" ? u.name : undefined,
    avatarUrl:
      typeof u.avatarUrl === "string"
        ? u.avatarUrl
        : typeof u.avatar_url === "string"
          ? u.avatar_url
          : typeof u.image === "string"
            ? u.image
            : null,
  };
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  for (const key of USER_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const data = JSON.parse(raw) as unknown;
      const parsed =
        data && typeof data === "object"
          ? parseUser(data) ?? extractUserFromObject(data as Record<string, unknown>)
          : null;
      if (parsed) return parsed;
    } catch {
      continue;
    }
  }
  return null;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  for (const key of TOKEN_KEYS) {
    const val = localStorage.getItem(key);
    if (val && typeof val === "string") return val;
  }
  return null;
}

export function isLoggedIn(): boolean {
  return !!(getStoredToken() || getStoredUser());
}
