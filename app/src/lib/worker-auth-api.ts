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
  /** Present for Google login: true when user was just created (redirect to onboarding). */
  isNewUser?: boolean;
}

/** GET /api/auth/check-email?email= – returns { exists: boolean }. For signup form validation. */
export async function workerCheckEmail(email: string): Promise<{ exists: boolean }> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return { exists: false };
  const url = `${env.workersApiUrl}/api/auth/check-email?email=${encodeURIComponent(trimmed)}`;
  const headers: Record<string, string> = {};
  if (env.apiKey) headers["X-API-Key"] = env.apiKey;
  const res = await fetch(url, { headers });
  if (res.status === 429) return { exists: false }; // Rate limited; treat as unknown
  if (!res.ok) return { exists: false };
  const data = (await res.json()) as { exists?: boolean };
  return { exists: !!data.exists };
}

/** POST /api/auth/login. Turnstile token required when backend has TURNSTILE_SECRET_KEY set (not used for Google SSO). */
export async function workerLogin(params: {
  email: string;
  password: string;
  turnstile_token?: string;
}): Promise<AuthResponse> {
  const url = `${env.workersApiUrl}/api/auth/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      email: params.email.trim(),
      password: params.password,
      turnstile_token: params.turnstile_token,
    }),
  });
  if (res.status === 429) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "Too many login attempts. Try again later.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || "Invalid email or password.");
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
  if (res.status === 429) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "Too many requests. Try again later.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || "Sign up failed");
  }
  return res.json() as Promise<AuthResponse>;
}

/** POST /api/auth/forgot-password – send 8-digit OTP to email via Brevo. Rate limited. */
export async function workerForgotPassword(params: {
  email: string;
  turnstile_token?: string;
}): Promise<void> {
  const url = `${env.workersApiUrl}/api/auth/forgot-password`;
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      email: params.email.trim().toLowerCase(),
      turnstile_token: params.turnstile_token,
    }),
  });
  if (res.status === 429) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "Too many requests. Try again later.");
  }
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "Failed to send reset email");
  }
}

/** POST /api/auth/reset-password – verify OTP and set new password. Rate limited. */
export async function workerResetPassword(params: {
  email: string;
  otp: string;
  new_password: string;
}): Promise<void> {
  const url = `${env.workersApiUrl}/api/auth/reset-password`;
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({
      email: params.email.trim().toLowerCase(),
      otp: params.otp.trim(),
      new_password: params.new_password,
    }),
  });
  if (res.status === 429) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "Too many requests. Try again later.");
  }
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "Invalid or expired code");
  }
}

/** POST /api/auth/google – body: { id_token }. Returns isNewUser: true when user was just created (redirect to onboarding). */
export async function workerGoogleLogin(idToken: string): Promise<AuthResponse> {
  const url = `${env.workersApiUrl}/api/auth/google`;
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ id_token: idToken }),
  });
  if (res.status === 429) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || "Too many requests. Try again later.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error || "Google sign-in failed");
  }
  const data = (await res.json()) as AuthResponse;
  return { token: data.token, userId: data.userId, isNewUser: data.isNewUser };
}
