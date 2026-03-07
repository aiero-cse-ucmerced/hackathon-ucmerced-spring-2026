# UncookedAura – Cloudflare integration

Job search finder market (Comp Sci & Engineering and related majors) using **Cloudflare Pages**, **Workers**, and **R2**.

## Overview

- **Frontend (this app)**: Next.js deployed to Cloudflare Pages/Workers via OpenNext. Reads env from `.env` and calls the Workers API for job data.
- **Workers API** (separate Worker): Serves job listings; can use **R2** bindings to store/retrieve data. Point the frontend at its URL with `NEXT_PUBLIC_CF_WORKERS_API_URL`.
- **R2**: Used by the API Worker for job data (and optionally by this app for Next.js incremental cache).

## Environment variables

Copy `app/.env.example` to `app/.env` and set:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CF_WORKERS_API_URL` | Base URL of your job API Worker (e.g. `https://uncookedaura-api.<account>.workers.dev`). Leave empty to use mock data. |
| `NEXT_PUBLIC_CF_PAGES_URL` | Canonical app URL when on Pages (e.g. `https://uncookedaura.pages.dev`). |
| `NEXT_PUBLIC_CF_API_KEY` | Optional API key sent as `X-API-Key` to the Worker. |

For local Cloudflare preview, copy `.dev.vars.example` to `.dev.vars` and set `NEXTJS_ENV=development`.

## Deploy this frontend to Cloudflare

1. Install deps: `yarn` (or `npm install`).
2. Log in: `npx wrangler login`.
3. (Optional) Create R2 bucket for Next.js cache and uncomment `r2_buckets` in `wrangler.jsonc`:
   ```bash
   npx wrangler r2 bucket create uncookedaura-cache
   ```
4. Preview locally in Workers runtime: `yarn preview`.
5. Deploy: `yarn deploy`.

## Workers API contract

The frontend expects the Worker to expose job listings, e.g.:

- **GET** `{NEXT_PUBLIC_CF_WORKERS_API_URL}/api/jobs?limit=12&major=cs`
- **Response**: `{ "jobs": [ { "jobTitle": string, "company": string } ], "nextCursor"?: string }`
- Optional header: `X-API-Key` when `NEXT_PUBLIC_CF_API_KEY` is set.

Implement this Worker with an R2 binding to store/retrieve job data; the frontend is already wired to call it when `NEXT_PUBLIC_CF_WORKERS_API_URL` is set.
