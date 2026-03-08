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
| `GOOGLE_GENERATIVE_AI_API_KEY` | Server-side only. Gemini API key for resume extraction (past experiences, tips). Get from [Google AI Studio](https://aistudio.google.com/app/apikey). |

For local Cloudflare preview, copy `.dev.vars.example` to `.dev.vars` and set `NEXTJS_ENV=development`.

## Deploy this frontend to Cloudflare

**Public deployments (Cloudflare Build):** Use **npm** and the exact commands below. You must use `npm run` (not `npm`) to run scripts.

- **Build command:** `npm run build:cloudflare`  
  (If you type `npm build:cloudflare` without `run`, npm will fail with "Unknown command".)
- **Deploy command:** `npx wrangler deploy`

OpenNext runs the repo’s `build` script internally (e.g. `npm run build` → Next.js). Use **Root directory** `app` if the app lives in the `app` folder.

**Local / CLI:**
1. Install deps: `npm install` (or `yarn`).
2. Log in: `npx wrangler login`.
3. (Optional) Create R2 bucket for Next.js cache and uncomment `r2_buckets` in `wrangler.jsonc`:
   ```bash
   npx wrangler r2 bucket create uncookedaura-cache
   ```
4. Preview locally in Workers runtime: `npm run preview`.
5. Deploy from CLI: `npm run deploy`.

## Workers API contract

The frontend calls the Worker for:

- **GET/PATCH** `/api/profile` — Bearer token required. Profile & preferences (name, email, major, age, interests, strengths, pastExperiences, etc.) are persisted via REST API.
- **PATCH** `/api/account/email`, **PATCH** `/api/account/password`, **POST** `/api/account/signout` — Account settings (also available from self-hosted when configured).
- **POST** `/api/profile/avatar` — Multipart upload; Bearer required.
- **GET** `/api/social-events?lat=&lng=&age=&radius=` — Eventbrite + Gemini personalization.
- **POST** `/api/resume/extract` — Resume AI extraction (Next.js API route, not Worker). Body: `{ base64, mimeType }`. Returns `{ pastExperiences, tips }` for profile prefill. Requires `GOOGLE_GENERATIVE_AI_API_KEY` in app env.
- **GET** `/api/geocode?q=...` or `?lat=&lng=` — Nominatim proxy with KV cache.
- **GET** `/api/auth/check-email?email=` — Returns `{ exists: boolean }`. For signup form validation (email already registered). Optional `X-API-Key`.
- **POST** `/api/auth/signup` — Body: `{ email, name, password, major? }`. Optional `X-API-Key`.
- **POST** `/api/auth/login` — Body: `{ email, password }`. Optional `X-API-Key`.
- **POST** `/api/auth/google` — Body: `{ id_token }` (Google Sign-In credential). Optional `X-API-Key`.

On success, auth endpoints return `{ token, userId }` and set a **user cookie** `ua_rest_api_key` with the same token. Use this token as **REST API key** for the self-hosted API: send `Authorization: Bearer <token>` on requests to account and passkey endpoints. The Worker profile routes accept the token from either the `Authorization` header or the `ua_rest_api_key` cookie.

### Cookie security (Workers)

When setting `ua_rest_api_key`, the Worker should use `backend/src/cookie-utils.ts` to apply [cookie security best practices](https://medium.com/@iason.tzortzis/cookie-security-best-practices-d19800ad0b4b):

- **Secure**: Only sent over HTTPS
- **HttpOnly**: Not accessible to JavaScript (XSS protection)
- **SameSite=Strict**: Mitigates CSRF; use Lax if cookies must work on top-level navigation from external links
- **No Domain**: Leave unset so only the exact host can read it (HostOnly)
- **Session or short max-age**: Prefer session cookie; if persistent, use strict expiry (e.g. 7 days)

See `backend/README.md` for usage examples.

**Frontend**: When the API uses HTTP-only cookies for auth, ensure fetch requests to the Workers API use `credentials: "include"` so cookies are sent. The API must respond with `Access-Control-Allow-Credentials: true` and a specific `Access-Control-Allow-Origin` (not `*`).

The Worker is implemented in the `backend/` folder; deploy with `wrangler`. The self-hosted API is in `self-hosted/`; deploy with Docker Compose.
