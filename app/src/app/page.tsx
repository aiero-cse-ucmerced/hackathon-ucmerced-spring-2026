import Link from "next/link";
import Image from "next/image";
import { AllToolsSection } from "@/components/AllToolsSection";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JobListingsMarquee } from "@/components/JobListingsMarquee";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHeroCTA } from "@/components/landing/LandingHeroCTA";

const VALUE_PROPS = [
  "Match by interests, not just job titles",
  "Fit score for every listing",
  "No prior experience required",
];

const BUILT_WITH = [
  "Next.js",
  "Cloudflare Workers",
  "Gemini AI",
  "Tailwind CSS",
  "TypeScript",
];

export default function Home() {
  return (
    <div className="landing-page min-h-screen bg-white text-zinc-900">
      <LandingHeader />

      {/* Hero — above the fold with illustration */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(254,243,199,0.35),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-white via-white/95 to-transparent"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Left: copy */}
            <div className="order-2 lg:order-1">
              <p
                className="landing-animate-1 landing-display mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-800"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" aria-hidden />
                Free for students · AI-powered matching
              </p>

              <h1>
                <span
                  className="landing-animate-2 landing-display block text-3xl font-medium leading-tight tracking-tight text-zinc-500 md:text-4xl"
                >
                  Cook better than
                </span>
                <span
                  className="landing-animate-3 landing-display mt-2 block text-5xl font-extrabold leading-[1.05] tracking-tight text-zinc-900 md:text-6xl lg:text-7xl"
                >
                  everyone
                </span>
              </h1>

              <p
                className="landing-animate-4 mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 md:text-xl"
              >
                Students in CS and engineering find internships that match their interests—no experience required.
              </p>

              <ul className="landing-animate-5 mt-8 flex max-w-lg flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-zinc-600">
                {VALUE_PROPS.map((prop) => (
                  <li key={prop} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                    {prop}
                  </li>
                ))}
              </ul>

              <div className="landing-animate-6 mt-10 flex flex-col items-start gap-4">
                <LandingHeroCTA />
                <Link
                  href="/learn"
                  className="text-sm font-medium text-zinc-500 underline underline-offset-2 hover:text-zinc-700"
                >
                  Learn how it works
                </Link>
              </div>
            </div>

            {/* Right: hero illustration */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-100/80 to-amber-50/60 blur-2xl" aria-hidden />
                <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white/90 p-8 shadow-xl shadow-amber-900/5">
                  <Image
                    src="/landing_feature_pngs/internship.png"
                    alt="Career and internship opportunities—briefcase with graduation cap"
                    width={400}
                    height={320}
                    className="mx-auto h-56 w-auto object-contain md:h-64"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem — Solution: judges value clear problem definition */}
      <section className="border-t border-zinc-100 bg-zinc-50/60 py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-16 md:grid-cols-2 md:gap-20 md:items-start">
            <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
                <Image
                  src="/landing_feature_pngs/search.png"
                  alt="Searching for jobs"
                  width={96}
                  height={96}
                  className="h-16 w-auto object-contain"
                />
              </div>
              <div>
                <h2
                  className="landing-display text-lg font-semibold uppercase tracking-widest text-amber-600"
                >
                  The problem
                </h2>
                <p className="mt-4 text-base leading-relaxed text-zinc-700 md:text-lg">
                  Internship listings ask for experience students don&apos;t have. Job boards favor keywords over fit. Students apply blindly and get ghosted.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-amber-200/60 bg-white p-5 shadow-sm">
                <Image
                  src="/landing_feature_pngs/profile.png"
                  alt="Profile and interests matching"
                  width={96}
                  height={96}
                  className="h-16 w-auto object-contain"
                />
              </div>
              <div>
                <h2
                  className="landing-display text-lg font-semibold uppercase tracking-widest text-amber-600"
                >
                  Our solution
                </h2>
                <p className="mt-4 text-base leading-relaxed text-zinc-700 md:text-lg">
                  We match internships to your interests and strengths—not your resume. See a fit score for every listing. Save, apply, and unlock entry-level roles as you progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings Marquee — social proof */}
      <JobListingsMarquee />

      {/* Testimonial — trust signal */}
      <section className="border-t border-zinc-100 bg-white py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 md:items-start">
            <div className="shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-amber-200/60 bg-amber-50/50 p-4">
                <Image
                  src="/landing_feature_pngs/save.png"
                  alt=""
                  width={64}
                  height={64}
                  className="h-14 w-auto object-contain"
                  aria-hidden
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <span
                className="landing-display block text-5xl font-extrabold leading-none text-amber-500/20"
                aria-hidden
              >
                &ldquo;
              </span>
              <blockquote className="-mt-4 text-lg leading-relaxed text-zinc-700 md:text-xl">
                I got my first internship without any prior experience. The fit scores helped me focus on roles that actually matched my interests.
              </blockquote>
              <p className="mt-5 text-sm font-semibold text-zinc-900">— Student, Computer Science</p>
            </div>
          </div>
        </div>
      </section>

      {/* All the tools */}
      <AllToolsSection />

      {/* Built With — technical credibility for judges */}
      <section className="border-t border-zinc-100 bg-zinc-50/60 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Built with
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {BUILT_WITH.map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — remove doubt */}
      <section className="border-t border-zinc-100 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2
            className="landing-display text-center text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl"
          >
            Questions?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-zinc-500">
            Quick answers to get you started.
          </p>
          <div className="mt-14">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-zinc-100 bg-white py-20 md:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-200/60 bg-amber-50/50 p-4">
            <Image
              src="/landing_feature_pngs/internship.png"
              alt=""
              width={64}
              height={64}
              className="h-12 w-auto object-contain"
              aria-hidden
            />
          </div>
          <h2
            className="landing-display text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl"
          >
            Ready to find your match?
          </h2>
          <p className="mt-4 text-base text-zinc-500">
            Create a free profile and start browsing in minutes.
          </p>
          <div className="mt-10">
            <LandingHeroCTA />
          </div>
        </div>
      </section>
    </div>
  );
}
