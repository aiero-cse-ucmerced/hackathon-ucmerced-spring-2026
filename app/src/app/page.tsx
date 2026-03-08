import Link from "next/link";
import { AllToolsSection } from "@/components/AllToolsSection";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JobListingsMarquee } from "@/components/JobListingsMarquee";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHeroCTA } from "@/components/landing/LandingHeroCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <LandingHeader />

      {/* Hero */}
      <section className="px-6 pb-20 pt-16 text-center md:pb-28 md:pt-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-center">
            <span className="block text-3xl font-normal leading-tight tracking-tight text-zinc-600 md:text-4xl">
              Cook better than
            </span>
            <span className="mt-1 block pl-6 text-5xl font-bold leading-tight tracking-tight text-zinc-900 md:pl-10 md:text-6xl lg:text-7xl">
              everyone
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-zinc-500 md:text-lg">
            A job market search that perfectly matches your profile regardless
            your prior experiences.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <LandingHeroCTA />
            <Link
              href="/learn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-lg border border-[#171717] bg-white px-6 text-base font-medium text-[#171717] transition-colors hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Job Listings Marquee */}
      <JobListingsMarquee />

      {/* FAQ section */}
      <section className="border-t border-zinc-100 bg-white py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl lg:text-4xl">
            Not Sure Where To Start?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-zinc-500 md:text-base">
            Explore our most commonly asked questions and find the information
            you need.
          </p>
          <div className="mt-12">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* All the tools + brand names (static) */}
      <AllToolsSection />
    </div>
  );
}
