import Link from "next/link";
import { AllToolsSection } from "@/components/AllToolsSection";
import { Button } from "@/components/Button";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JobListingsMarquee } from "@/components/JobListingsMarquee";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="bg-white px-6 pt-8">
        <div className="mx-auto max-w-6xl">
          <Logo />
        </div>
      </header>

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
            <Link href="/signup">
              <Button variant="primary" iconAfter="→" asChild={false}>
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" asChild={false}>
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Job Listings Marquee */}
      <JobListingsMarquee />

      {/* FAQ section */}
      <section className="border-t border-zinc-100 bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-zinc-500 md:text-base">
            Quick answers about how UncookedAura matches you to roles and how to
            get started.
          </p>
          <div className="mt-8">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* All the tools + brand names (static) */}
      <AllToolsSection />
    </div>
  );
}
