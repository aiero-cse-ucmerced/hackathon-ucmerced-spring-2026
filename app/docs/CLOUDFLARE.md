# UncookedAura – Cloudflare integration

Job search finder market (Comp Sci & Engineering and related majors) using **Cloudflare Pages**, **Workers**, **R2**, and a **self-hosted API** for account settings and passkeys.

## Overview

- **Frontend (this app)**: Next.js deployed to Cloudflare Pages/Workers via OpenNext. Reads env from `.env` and calls both backends.
- **Dual backend**:
  - **Cloudflare Workers API** (`backend/`): Profile (GET/PATCH), avatar upload, social-events (Eventbrite + Gemini), geocode, auth (sign-up, login). Deploy with `wrangler`. Set `NEXT_PUBLIC_CF_WORKERS_API_URL`.
  - **Self-hosted Express 5 API** (`self-hosted/`): Account settings (change email, password, sign out), passkeys (WebAuthn). Deploy with Docker Compose. Set `NEXT_PUBLIC_SELF_HOSTED_API_URL`.
- **R2**: Used by the Worker for avatar storage.

## Environment variables

Copy `app/.env.example` to `app/.env` and set:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CF_WORKERS_API_URL` | Base URL of your Workers API (profile, social-events, geocode, auth). Leave empty to use mock data. |
| `NEXT_PUBLIC_SELF_HOSTED_API_URL` | Base URL of your self-hosted API (account settings, passkeys). |
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

The frontend calls the Worker for:

- **GET/PATCH** `/api/profile` — Bearer token required.
- **POST** `/api/profile/avatar` — Multipart upload; Bearer required.
- **GET** `/api/social-events?lat=&lng=&age=&radius=` — Eventbrite + Gemini personalization.
- **GET** `/api/geocode?q=...` or `?lat=&lng=` — Nominatim proxy with KV cache.
- **POST** `/api/auth/signup`, **POST** `/api/auth/login` — Auth; optional `X-API-Key`.

The Worker is implemented in the `backend/` folder; deploy with `wrangler`. The self-hosted API is in `self-hosted/`; deploy with Docker Compose.
