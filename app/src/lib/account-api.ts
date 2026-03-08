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

/** Passkeys require self-hosted API. Returns base URL or empty if not configured. */
function getPasskeyApiBase(): string {
  if (env.useSelfHostedApi) return env.selfHostedApiUrl;
  return "";
}

export interface PasskeyInfo {
  id: string;
  deviceName: string;
  createdAt: string;
}

/** GET /api/account/passkeys – list passkeys. Self-hosted only. */
export async function getPasskeys(token: string): Promise<PasskeyInfo[]> {
  const base = getPasskeyApiBase();
  if (!base) throw new Error("Passkeys require self-hosted API");
  const url = `${base}/api/account/passkeys`;
  const res = await fetch(url, {
    method: "GET",
    headers: authHeaders(token),
  });
  await checkRes(res);
  const data = (await res.json()) as { passkeys?: PasskeyInfo[] };
  return Array.isArray(data.passkeys) ? data.passkeys : [];
}

/** DELETE /api/account/passkeys/:id – remove passkey. Self-hosted only. */
export async function deletePasskey(token: string, id: string): Promise<void> {
  const base = getPasskeyApiBase();
  if (!base) throw new Error("Passkeys require self-hosted API");
  const url = `${base}/api/account/passkeys/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  await checkRes(res);
}

/** POST /api/passkey/register/options – get WebAuthn registration options. Self-hosted only. */
export async function getPasskeyRegisterOptions(token: string): Promise<Record<string, unknown>> {
  const base = getPasskeyApiBase();
  if (!base) throw new Error("Passkeys require self-hosted API");
  const url = `${base}/api/passkey/register/options`;
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(token),
  });
  await checkRes(res);
  return (await res.json()) as Record<string, unknown>;
}

/** POST /api/passkey/authenticate/options – get WebAuthn auth options. No auth. */
export async function getPasskeyAuthOptions(baseUrl: string, email?: string): Promise<Record<string, unknown>> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/passkey/authenticate/options`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(email?.trim() ? { email: email.trim() } : {}),
  });
  await checkRes(res);
  return (await res.json()) as Record<string, unknown>;
}

/** POST /api/passkey/authenticate/finish – verify assertion, returns token. No auth. */
export async function finishPasskeyAuth(
  baseUrl: string,
  credential: Record<string, unknown>
): Promise<{ token: string; userId: string; email?: string; name?: string }> {
  const url = `${baseUrl.replace(/\/$/, "")}/api/passkey/authenticate/finish`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(credential),
  });
  await checkRes(res);
  return (await res.json()) as { token: string; userId: string; email?: string; name?: string };
}

/** POST /api/passkey/register/finish – verify and store passkey. Self-hosted only. */
export async function finishPasskeyRegistration(
  token: string,
  credential: Record<string, unknown>,
  deviceName?: string
): Promise<{ verified: boolean }> {
  const base = getPasskeyApiBase();
  if (!base) throw new Error("Passkeys require self-hosted API");
  const url = `${base}/api/passkey/register/finish`;
  const body: Record<string, unknown> = { ...credential };
  if (deviceName?.trim()) body.device_name = deviceName.trim();
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  await checkRes(res);
  return (await res.json()) as { verified: boolean };
}
