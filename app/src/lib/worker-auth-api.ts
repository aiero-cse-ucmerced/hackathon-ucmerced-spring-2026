/**
 * Cloudflare Worker auth API – login, signup. Returns token for use as Bearer / REST API key.
 */

import { env } from "./env";

const JSON_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

function buildHeaders(): Record<string, string> {
  const h = { ...JSON_HEADERS };
  if (env.apiKey) h["X-API-Key"] = env.apiKey;
  return h;
}

export interface AuthResponse {
  token: string;
  userId: string;
}

/** POST /api/auth/login */
export async function workerLogin(email: string, password: string): Promise<AuthResponse> {
  const url = `${env.workersApiUrl}/api/auth/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ email: email.trim(), password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || "Login failed");
  }
  return res.json() as Promise<AuthResponse>;
}

/** POST /api/auth/signup */
export async function workerSignup(params: {
  email: string;
  name: string;
  password: string;
  major?: string;
  turnstile_token?: string;
}): Promise<AuthResponse> {
  const url = `${env.workersApiUrl}/api/auth/signup`;
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      email: params.email.trim(),
      name: params.name.trim(),
      password: params.password,
      major: params.major || undefined,
      turnstile_token: params.turnstile_token,
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || "Sign up failed");
  }
  return res.json() as Promise<AuthResponse>;
}

/** POST /api/auth/google – body: { id_token } */
export async function workerGoogleLogin(idToken: string): Promise<AuthResponse> {
  const url = `${env.workersApiUrl}/api/auth/google`;
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ id_token: idToken }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || "Google sign-in failed");
  }
  return res.json() as Promise<AuthResponse>;
}
