import { AllToolsSection } from "@/components/AllToolsSection";
import { Button } from "@/components/Button";
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
            <Button variant="primary" iconAfter="→">
              Get Started
            </Button>
            <Button variant="secondary">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Job Listings Marquee */}
      <JobListingsMarquee />

      {/* All the tools + brand names (static) */}
      <AllToolsSection />
    </div>
  );
}
