---
name: Auth framework with shadcn and Turnstile
overview: Add login, sign up, and forgot-password pages using shadcn/ui components, a shared auth shell matching the home page, call-to-action copy, and Cloudflare Turnstile (sign up and forgot-password). Frontend sends auth data to Cloudflare Workers for processing and R2 storage; backend API will live in backend/ later. Workers enforce auth checks, password verification, and reject injection attacks (log4j, SQL, etc.). Cache components and offline support for auth pages with reusable skeleton components.
todos: []
isProject: false
---

# Authentication framework (login + sign up + forgot password)

## Current state

- **Home** ([app/src/app/page.tsx](app/src/app/page.tsx)): White background (`bg-white`), header with [Logo](app/src/components/Logo.tsx) only in `max-w-6xl`, no nav buttons. Root layout wraps all pages with `<main>` + [Footer](app/src/components/Footer.tsx).
- **No shadcn/ui components yet**: Only the `shadcn` CLI package is in [package.json](app/package.json). No `components.json` or `src/components/ui/`; Tailwind v4 with `@theme inline` in [globals.css](app/src/app/globals.css).
- **Env**: [.env.example](app/.env.example) has Cloudflare vars only; Turnstile keys will be added.

## 1. shadcn/ui setup

- Run `**npx shadcn@latest init`** in `app/`. Choose style and base color that match the app (e.g. neutral/zinc). The CLI will add `components.json` and `src/lib/utils.ts`. If the CLI prompts to overwrite or merge CSS, **merge** so existing `:root` and `@theme inline` in [app/src/app/globals.css](app/src/app/globals.css) are kept and shadcn theme variables are added (or add shadcn vars manually per [Tailwind v4 – shadcn/ui](https://ui.shadcn.com/docs/tailwind-v4)).
- Add auth-related components: **button**, **input**, **card**, **label**, **select** (`npx shadcn@latest add button input card label select`). These will live under `src/components/ui/` and be used by the login, sign up, and forgot-password forms.

## 2. Shared auth shell (background + header)

- **Background**: Same as home — `bg-white` and same overall page background so auth pages feel part of the same app.
- **Header**: Reuse the same header as home: white bar, `max-w-6xl`, [Logo](app/src/components/Logo.tsx) only — **no** “Get Started” / “Learn More” or other nav buttons.
- **Implementation**: Add a small **auth layout** or shared component so login and forgot-password don’t duplicate the shell.
  - **Option A (recommended)**: Create a route group `app/(auth)/` with a layout that renders the shared header + `{children}`. Put `login/page.tsx`, `signup/page.tsx`, and `login/forgot-password/page.tsx` under `(auth)` so routes stay `/login`, `/signup`, and `/login/forgot-password`. The layout reads: same header as home (Logo only), full-width white background, centered content area below.
  - **Option B**: Create an `<AuthShell>` component (header + wrapper) and use it in both `app/login/page.tsx` and `app/login/forgot-password/page.tsx`. No route group.

Use **Option A** so the header and background live in one place: `app/(auth)/layout.tsx` with the same header markup as in [page.tsx](app/src/app/page.tsx) (only the `<header>` block with Logo).

## 3. Login page

- **Route**: `/login` (e.g. `app/(auth)/login/page.tsx` if using the auth layout).
- **UI**: One centered **Card** (shadcn) containing:
  - Title: e.g. “Sign in with email”.
  - **Call-to-action intro**: Replace generic “Make a new doc…”-style copy with a short line that prompts the user to enter credentials in the context of UncookedAura (e.g. “Sign in to discover jobs that match your profile” or “Enter your details to access your job matches and saved listings.”). Keep it one or two lines, centered.
  - **Form**: Email and password **Input**s with **Label**s; password with a visibility toggle (optional, or use type="password" only). Use shadcn **Button** for the primary submit (e.g. “Sign in” or “Get started”).
  - **Link**: “Forgot password?” linking to `/login/forgot-password`.
- **Behavior**: Form is a client component; submit handler sends credentials to the Cloudflare Workers auth API (see Section 8). No Turnstile on the login page.
- **Link**: “Don’t have an account? Sign up” linking to `/signup`.

## 4. Sign up page

- **Route**: `/signup` (e.g. `app/(auth)/signup/page.tsx`).
- **UI**: One centered **Card** (shadcn) containing:
  - Title: e.g. “Create your account”.
  - **Call-to-action intro**: Short line prompting the user to enter their details (e.g. “Join UncookedAura to find jobs that match your major and profile.”).
  - **Form fields** (in order):
    1. **Name** — text Input + Label.
    2. **Email** — email Input + Label.
    3. **Password** — password Input + Label (with visibility toggle).
    4. **Confirm password** — password Input + Label; client-side validation must match password.
    5. **Major** — **Select** (shadcn) with limited options: **CSE**, **CS**, **Applied Math**, **Others**. Use a dropdown; “Others” as the catch-all.
  - **Cloudflare Turnstile** widget — placed **after** the form fields, **before** the submit button. The user fills the form and confirms; Turnstile runs to verify they are not a bot. Form is only submitted after Turnstile succeeds.
  - **Button**: “Sign up” (submit). On submit: validate all fields + confirm password match; ensure Turnstile token is present; then POST the payload (name, email, password hash or plaintext per backend contract, major, turnstile_token) to the Cloudflare Workers auth API. Do not accept the form without a valid Turnstile token.
- **Flow**: User fills form → clicks “Sign up” → Turnstile verifies (if not yet done) → on success, frontend sends data to Workers → Workers validate, verify Turnstile server-side, process, and store in R2 (see Section 8).
- **Link**: “Already have an account? Sign in” linking to `/login`.

## 5. Forgot-password sub-page

- **Route**: `/login/forgot-password` (e.g. `app/(auth)/login/forgot-password/page.tsx`).
- **UI**: Same auth shell (background + header). One centered **Card** with:
  - Title: e.g. “Reset password”.
  - Short line: e.g. “Enter your email and we’ll send you a reset link.”
  - **Email** **Input** + **Label**.
  - **Cloudflare Turnstile** widget below the email field (managed mode). Use the widget in a client component so the script loads in the browser; render the Turnstile div (or use a small wrapper) and pass the site key from `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
  - **Button**: “Send reset link” (submit). On submit, read the Turnstile token (via callback or ref), include it with the email in the request body when you later call a backend/Worker. For now, submit can be a placeholder that validates email + presence of Turnstile token and then shows success/error state.
- **Turnstile script**: Load the Turnstile script on this page (or in a layout that only wraps auth pages) via `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />` in a Next.js `Script` component. The widget is rendered with `data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}` (and optionally `data-callback` to capture the token for submit).

## 6. Environment variables

- In `**.env.example`** (and in docs), add:
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key (public, for the widget).
- Optional: document that the secret key is for the backend only (not in the frontend). No need to add a secret key to the frontend app.

## 7. Optional: Redirect “Get Started” to sign up / login

- On the [home page](app/src/app/page.tsx), the primary “Get Started” button can link to `/signup` (or `/login`). Consider offering both: “Get Started” → `/signup`, “Sign in” → `/login` if a secondary link is added.
- On the [home page](app/src/app/page.tsx), the primary “Get Started” button can link to `/login` (e.g. wrap in `<Link href="/login">` or use the existing [Button](app/src/components/Button.tsx) with `asChild` + `Link` if supported). This ties the CTA to the new auth flow.

## File and route summary


| Item                              | Path / route                                                           |
| --------------------------------- | ---------------------------------------------------------------------- |
| Auth layout (header + background) | `app/(auth)/layout.tsx`                                                |
| Login page                        | `app/(auth)/login/page.tsx` → `/login`                                 |
| Forgot password page              | `app/(auth)/login/forgot-password/page.tsx` → `/login/forgot-password` |
| shadcn components                 | `app/src/components/ui/`* (button, input, card, label, skeleton)       |
| Env                               | `.env.example` + `.env` (NEXT_PUBLIC_TURNSTILE_SITE_KEY)               |
| Auth card skeleton                | `app/src/components/skeleton/AuthCardSkeleton.tsx`                     |
| Service worker (offline cache)    | next-pwa or custom Workbox; cache auth routes only                     |


## Order of implementation

1. shadcn init and add button, input, card, label; reconcile globals.css if needed.
2. Add `(auth)` layout with home-matching header and background.
3. Build login page with Card, CTA copy, form, and “Forgot password?” link.
4. Add Turnstile env var and script; build forgot-password page with email + Turnstile + submit.
5. Optionally wire home “Get Started” to `/login`.
6. Add cache components and offline support (Section 7).

## 7. Cache components and offline support (skeleton)

**Goal**: When the user goes offline, they can still see and use most of the site. Auth pages are cached so they work offline; job data is not prefetched for offline — jobs will show skeleton (or "connect to internet") until online. Reusable skeleton components will be used on the auth page now and later on the dashboard.

### 7.1 Reusable skeleton components

- Add **shadcn Skeleton** (`npx shadcn@latest add skeleton`) so the app has a standard placeholder primitive.
- Introduce a small set of **cacheable / skeleton-aware building blocks** in `src/components/` (or `src/components/skeleton/`):
  - **Auth card skeleton**: Skeleton that mirrors the login/forgot-password card layout (title bar, 2–3 lines for form fields, button area). Use as the loading state for the auth page (e.g. while the auth layout or form is hydrating, or when returning from cache). Reuse this pattern later for dashboard cards.
  - Optional: **Page shell skeleton** for dashboard (header + content placeholder); for auth focus, the auth card skeleton is enough.
- Use these skeletons for loading and cached-shell states so the UI stays consistent and the site feels usable offline.

### 7.2 Offline caching for auth pages

- **What to cache**: Auth routes (`/login`, `/login/forgot-password`) and their static assets (layout, JS/CSS chunks, fonts, shadcn UI) so the user can open login and forgot-password when offline.
- **What not to cache for offline**: Prefetched or live job listings. Job data stays network-dependent; when offline, the jobs section shows skeleton or "You’re offline" until the user reconnects (handled later with dashboard/job list).
- **Implementation**:
  - Use a **service worker** to cache the auth app shell and auth routes. Options: **next-pwa** or **@ducanh2912/next-pwa** (Next 14+), or a **custom Workbox** service worker. Configure to precache or runtime-cache `/login`, `/login/forgot-password`, and their static assets; exclude API or job-fetch requests so job data is never served from cache offline.
  - Register the service worker from the root layout or a client component so it’s active site-wide but only caches per the strategy above.
- **Auth page when offline**: Cached HTML/JS for auth routes are served from cache. Form submit fails until online — show "You’re offline" and disable submit when `navigator.onLine === false`, or show skeleton until back online.

### 7.3 Auth page + skeleton integration (current focus)

- On the **auth layout** or **login / forgot-password pages**: Optionally show the **auth card skeleton** briefly while the auth form is loading (e.g. hydration) or when the page is restored from cache, then reveal the real form. This establishes the "skeleton first" pattern for the dashboard later.
- When the user is offline on `/login` or `/login/forgot-password`, the cached page renders; disable submit and show "Connect to the internet to sign in."
- **Dashboard (later)**: Reuse the same skeleton components for loading and offline; job list shows skeletons when offline or loading, not prefetched job data.

### 7.4 File and implementation summary (cache + skeleton)


| Item                    | Path / approach                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| Skeleton primitive      | shadcn `skeleton` → `src/components/ui/skeleton.tsx`                                                      |
| Auth card skeleton      | `src/components/skeleton/AuthCardSkeleton.tsx` (or similar)                                               |
| Service worker          | next-pwa or custom Workbox; cache `/login`, `/login/forgot-password`, static assets; do not cache job API |
| Offline submit handling | Client-side: check `navigator.onLine`, disable submit and show message when offline                       |


