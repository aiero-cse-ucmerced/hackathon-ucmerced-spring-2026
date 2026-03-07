---
name: Landing FAQ Accordion
overview: Add an FAQ accordion section below the job cards on the landing page with brief answers about the UncookedAura job market finder app. Use a simple, accessible accordion that matches the existing zinc/white design.
todos: []
isProject: false
---

# Landing Page FAQ Accordion

## Current structure

- **Landing page:** [app/src/app/page.tsx](app/src/app/page.tsx) — Hero → **JobListingsMarquee** (job cards) → AllToolsSection.
- **Job block:** [app/src/components/JobListingsMarquee.tsx](app/src/components/JobListingsMarquee.tsx) renders the scrolling job cards; the FAQ section will be a new section directly after it.
- No accordion exists yet. The app uses custom components (e.g. [Button](app/src/components/Button.tsx), [JobCard](app/src/components/JobCard.tsx)) and has `shadcn` in package.json but no `components.json` or `ui/` folder, so the plan uses a **custom accordion** to stay consistent and avoid new tooling.

## Implementation

### 1. FAQ content (brief copy)

Add a small data set of 4–5 FAQs about UncookedAura as a job market finder, for example:


| Question                              | Brief answer (concept)                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------ |
| What is UncookedAura?                 | Job search that matches your profile and potential, not just past job titles.        |
| How does job matching work?           | We use your skills and goals so you see roles that fit even without the exact title. |
| Is UncookedAura free to use?          | Core search and profile are free; premium features may be offered later.             |
| Which jobs or companies are included? | We aggregate roles from multiple sources; coverage varies by region and field.       |
| How do I get started?                 | Sign up, complete your profile, then browse and save matching jobs.                  |


You can trim or reword these when implementing; the accordion will just consume an array of `{ question, answer }`.

### 2. Accordion component

- **Location:** `app/src/components/FaqAccordion.tsx` (or `LandingFaq.tsx`).
- **Behavior:** One item open at a time (or allow multiple—your choice). Use either:
  - **Native `<details>` / `<summary>`** for simplicity and zero JS for expand/collapse, or
  - **Controlled state** (e.g. `openIndex`) with click handlers for "single open" and optional animation.
- **Styling:** Reuse the existing look: `border border-zinc-200/80`, `rounded-lg`, `bg-white`, `shadow-sm`, `text-zinc-900` / `text-zinc-500`, spacing consistent with [JobCard](app/src/components/JobCard.tsx) and [AllToolsSection](app/src/components/AllToolsSection.tsx).
- **Accessibility:** Use `<button>` for the trigger (if not using `<summary>`), `aria-expanded`, and optionally `aria-controls` / `id` for the content panel.

### 3. Landing page integration

- In [app/src/app/page.tsx](app/src/app/page.tsx), insert a new section **between** `<JobListingsMarquee />` and `<AllToolsSection />`:
  - Wrapper: e.g. `section` with `className` similar to the marquee (e.g. `bg-white py-16` or `py-12`) and a constrained width (e.g. `max-w-3xl mx-auto px-6`).
  - Optional heading above the accordion, e.g. "Frequently asked questions" or "FAQs".
  - Render the new accordion component and pass the FAQ array (or import a constant from the same file as the component).

### 4. File changes summary

- **New:** `app/src/components/FaqAccordion.tsx` — accordion UI + FAQ data (or FAQ data in a small `faq-data.ts` if you prefer).
- **Edit:** [app/src/app/page.tsx](app/src/app/page.tsx) — add the FAQ section and `<FaqAccordion />` below the job cards.

## Optional: shadcn Accordion

If you later standardize on shadcn UI, you can run `npx shadcn@latest add accordion` (and set up `components.json` if prompted), then replace the custom accordion with the shadcn `Accordion` and keep the same FAQ data and section placement.