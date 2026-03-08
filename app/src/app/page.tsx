import Link from "next/link";
import { AllToolsSection } from "@/components/AllToolsSection";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JobListingsMarquee } from "@/components/JobListingsMarquee";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHeroCTA } from "@/components/landing/LandingHeroCTA";

const VALUE_PROPS = [
  "Match by interests, not just job titles",
  "See a fit score for every listing",
  "No prior experience required",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <LandingHeader />

      {/* Hero — above the fold, focused on one goal */}
      <section className="relative overflow-hidden px-6 pb-16 pt-12 text-center md:pb-24 md:pt-20">
        {/* Subtle gradient to direct eye toward CTA */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-center">
            <span className="block text-3xl font-normal leading-tight tracking-tight text-zinc-600 md:text-4xl">
              Cook better than
            </span>
            <span className="mt-1 block pl-6 text-5xl font-bold leading-tight tracking-tight text-zinc-900 md:pl-10 md:text-6xl lg:text-7xl">
              everyone
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-500 md:text-lg">
            Find internships that match your potential—not just your resume.
          </p>
          {/* Value props — lean, scannable */}
          <ul className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-600 md:gap-x-8">
            {VALUE_PROPS.map((prop) => (
              <li key={prop} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
                {prop}
              </li>
            ))}
          </ul>
          {/* Primary CTA — bold, contrasting, above the fold */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <LandingHeroCTA />
            <Link
              href="/learn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 text-base font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            >
              Learn More
            </Link>
          </div>
          {/* Social proof — trust indicator */}
          <p className="mt-8 text-xs uppercase tracking-wider text-zinc-400 md:text-sm">
            For students in CS, engineering & related majors
          </p>
        </div>
      </section>

      {/* Job Listings Marquee — social proof: real roles at real companies */}
      <JobListingsMarquee />

      {/* Social proof — testimonial */}
      <section className="border-t border-zinc-100 bg-zinc-50/50 py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <blockquote className="text-lg leading-relaxed text-zinc-700 md:text-xl">
            &ldquo;I got my first internship without any prior experience. The fit scores helped me focus on roles that actually matched my interests.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm font-medium text-zinc-900">— Student, Computer Science</p>
        </div>
      </section>

      {/* FAQ section — lean, scannable, addresses objections */}
      <section className="border-t border-zinc-100 bg-white py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl lg:text-4xl">
            Questions?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-zinc-500 md:text-base">
            Quick answers to get you started.
          </p>
          <div className="mt-12">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* All the tools + brand names (static) */}
      <AllToolsSection />

      {/* Secondary CTA — replicate for visitors who scroll */}
      <section className="border-t border-zinc-100 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
            Ready to find your match?
          </h2>
          <p className="mt-3 text-sm text-zinc-500">
            Create a free profile and start browsing in minutes.
          </p>
          <div className="mt-8">
            <LandingHeroCTA />
          </div>
        </div>
      </section>
    </div>
  );
}
