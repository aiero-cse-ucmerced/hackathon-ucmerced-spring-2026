/**
 * UncookedAura – Cloudflare-related environment variables.
 * All client-visible vars must be prefixed with NEXT_PUBLIC_.
 */

function getEnv(key: string): string {
  return (process.env[key] ?? "").trim();
}

export const env = {
  /** Cloudflare Workers API base URL (job search, R2-backed data). Empty = use mock data. */
  get workersApiUrl(): string {
    return getEnv("NEXT_PUBLIC_CF_WORKERS_API_URL").replace(/\/$/, "");
  },

  /** Cloudflare Pages app URL (canonical origin). */
  get pagesUrl(): string {
    return getEnv("NEXT_PUBLIC_CF_PAGES_URL").replace(/\/$/, "");
  },

  /** Optional public API key for Worker endpoints. */
  get apiKey(): string {
    return getEnv("NEXT_PUBLIC_CF_API_KEY");
  },

  /** True if we should call the Workers API for live job data. */
  get useWorkersApi(): boolean {
    return this.workersApiUrl.length > 0;
  },
} as const;
