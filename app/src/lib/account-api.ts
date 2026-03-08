/**
 * Account API client (change email, password, sign out).
 * Uses self-hosted API when configured, otherwise Workers API.
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

/** Base URL for account endpoints: self-hosted if set, else Workers API. */
function getAccountApiBase(): string {
  if (env.useSelfHostedApi) return env.selfHostedApiUrl;
  if (env.useWorkersApi) return env.workersApiUrl;
  return "";
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
  const base = getAccountApiBase();
  if (!base) throw new Error("No account API configured");
  const url = `${base}/api/account/email`;
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
  const base = getAccountApiBase();
  if (!base) throw new Error("No account API configured");
  const url = `${base}/api/account/password`;
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
  const base = getAccountApiBase();
  if (!base) throw new Error("No account API configured");
  const url = `${base}/api/account/signout`;
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(token),
  });
  await checkRes(res);
}
