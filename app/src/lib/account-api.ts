/**
 * Self-hosted account API client (change email, password, sign out).
 * Requires the user's API key (token from Worker auth) as Bearer.
 */

import { env } from "./env";

const JSON_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

function authHeaders(token: string): Record<string, string> {
  return {
    ...JSON_HEADERS,
    Authorization: `Bearer ${token}`,
  };
}

export interface AccountApiError {
  error: string;
  code?: string;
}

async function checkRes(res: Response): Promise<void> {
  if (res.ok) return;
  let body: AccountApiError = { error: "Request failed" };
  try {
    const data = await res.json();
    if (data && typeof data.error === "string") body = data as AccountApiError;
  } catch {
    // ignore
  }
  throw new Error(body.error || `HTTP ${res.status}`);
}

/** PATCH /api/account/email – update email (users + profile). */
export async function updateEmail(token: string, newEmail: string): Promise<void> {
  const url = `${env.selfHostedApiUrl}/api/account/email`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ email: newEmail.trim() }),
  });
  await checkRes(res);
}

/** PATCH /api/account/password – verify currentPassword, set newPassword. */
export async function updatePassword(
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const url = `${env.selfHostedApiUrl}/api/account/password`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
  await checkRes(res);
}

/** POST /api/account/signout – server acknowledges; client must clear token. */
export async function signOutApi(token: string): Promise<void> {
  const url = `${env.selfHostedApiUrl}/api/account/signout`;
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(token),
  });
  await checkRes(res);
}
