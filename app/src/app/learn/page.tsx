import Link from "next/link";
import { LandingHeader } from "@/components/landing/LandingHeader";

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <LandingHeader />

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        {/* Value proposition */}
        <section className="border-b border-zinc-100 pb-12">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
            Why UncookedAura
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 md:text-lg">
            UncookedAura matches you to internships and entry-level roles using
            your interests and strengths—not just past job titles. See a fit
            score for every listing, filter by minimum match, and save roles for
            later.
          </p>
        </section>

        {/* How it works */}
        <section className="border-b border-zinc-100 py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
            How it works
          </h2>
          <ul className="mt-6 space-y-8">
            <li>
              <h3 className="text-lg font-medium text-zinc-900">
                Sign up and set your interests
              </h3>
              <p className="mt-2 text-base leading-relaxed text-zinc-600">
                Create an account and tell us your interests and optionally your
                strengths. We use these to find roles that fit you.
              </p>
            </li>
            <li>
              <h3 className="text-lg font-medium text-zinc-900">
                Get matched with a fit score
              </h3>
              <p className="mt-2 text-base leading-relaxed text-zinc-600">
                We match you to internships and entry-level roles and show a fit
                score for each listing so you can focus on the best matches.
              </p>
            </li>
            <li>
              <h3 className="text-lg font-medium text-zinc-900">
                Save and complete to unlock more
              </h3>
              <p className="mt-2 text-base leading-relaxed text-zinc-600">
                Save listings for later and mark internships as completed. As you
                progress, you unlock more opportunities.
              </p>
            </li>
            <li>
              <h3 className="text-lg font-medium text-zinc-900">
                Search by keyword and location
              </h3>
              <p className="mt-2 text-base leading-relaxed text-zinc-600">
                Use the Jobs page to search by keyword and location anytime.
              </p>
            </li>
          </ul>
        </section>

        {/* Features */}
        <section id="features" className="py-12 scroll-mt-24">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
            Features
          </h2>
          <ul className="mt-6 list-inside list-disc space-y-3 text-base leading-relaxed text-zinc-600">
            <li>Matched internships with fit score and min-score filter</li>
            <li>Save for later and mark as completed</li>
            <li>Search by keyword and location (Jobs page)</li>
            <li>Profile and strengths to improve matching</li>
          </ul>
        </section>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/signup"
            className="inline-flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-lg bg-[#171717] px-6 text-base font-medium text-white transition-colors hover:bg-[#2a2a2a] focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            Get started
          </Link>
        </div>
      </main>
    </div>
  );
}
