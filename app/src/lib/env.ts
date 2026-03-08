/**
 * UncookedAura – Cloudflare and API environment variables.
 * All client-visible vars must be prefixed with NEXT_PUBLIC_.
 *
 * The frontend only communicates with the backend (Workers API).
 * The backend uses Hyperdrive for database access—the frontend never
 * talks to Hyperdrive directly.
 */

function getEnv(key: string): string {
  return (process.env[key] ?? "").trim();
}

export const env = {
  /** Cloudflare Workers API base URL (profile, auth, social-events, geocode). Empty = use mock data. */
  get workersApiUrl(): string {
    return getEnv("NEXT_PUBLIC_CF_WORKERS_API_URL").replace(/\/$/, "");
  },

  /** Self-hosted API base URL (account settings, passkeys). Used for change email, password, sign out. */
  get selfHostedApiUrl(): string {
    return getEnv("NEXT_PUBLIC_SELF_HOSTED_API_URL").replace(/\/$/, "");
  },

  /** Cloudflare Pages app URL (canonical origin). */
  get pagesUrl(): string {
    return getEnv("NEXT_PUBLIC_CF_PAGES_URL").replace(/\/$/, "");
  },

  /** Optional public API key for Worker endpoints. */
  get apiKey(): string {
    return getEnv("NEXT_PUBLIC_CF_API_KEY");
  },

  /** True if we should call the Workers API for live data. */
  get useWorkersApi(): boolean {
    return this.workersApiUrl.length > 0 || this.selfHostedApiUrl.length > 0;
  },

  /** Base URL for auth (login, signup, etc.): Workers if set, else self-hosted. */
  get authApiUrl(): string {
    if (this.workersApiUrl.length > 0) return this.workersApiUrl;
    return this.selfHostedApiUrl;
  },

  /** True if self-hosted API is configured (account settings). */
  get useSelfHostedApi(): boolean {
    return this.selfHostedApiUrl.length > 0;
  },

  /** Google OAuth 2.0 Web client ID for Sign in with Google (Google Identity Services). Same value as Worker secret UNCOOKEDAURA_GOOGLE_CLIENT_ID. */
  get googleClientId(): string {
    return getEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID");
  },
} as const;
