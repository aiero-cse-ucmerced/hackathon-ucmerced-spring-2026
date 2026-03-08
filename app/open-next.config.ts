import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext config for Cloudflare. Required so the build does not prompt for creation.
 * Add incrementalCache (e.g. r2IncrementalCache) in wrangler.jsonc and here when you enable R2.
 */
export default defineCloudflareConfig({});
