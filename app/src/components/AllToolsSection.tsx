"use client";

import { useState, useCallback } from "react";
import { useInView } from "@/lib/use-in-view";

const BANNER_LOGOS: { filename: string; name: string }[] = [
  { filename: "Pinterest_logo.png", name: "Pinterest" },
  { filename: "Visa_logo.png", name: "Visa" },
  { filename: "Meta_logo.png", name: "Meta" },
  { filename: "Spotify_logo.png", name: "Spotify" },
  { filename: "BBC_logo.png", name: "BBC" },
  { filename: "Apple_logo.png", name: "Apple" },
  { filename: "Disney_logo.png", name: "Disney" },
];

function BrandLogo({ logo }: { logo: { filename: string; name: string } }) {
  const [failed, setFailed] = useState(false);
  const src = `/logos/${logo.filename}`;
  const onError = useCallback(() => setFailed(true), []);

  if (failed) {
    return (
      <span className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
        {logo.name}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={logo.name}
      className="h-[3.75em] w-auto object-contain opacity-70 transition-opacity hover:opacity-100"
      onError={onError}
    />
  );
}

/** Wrapper that reveals content when scrolled into view */
function ScrollReveal({
  children,
  className = "",
  variant = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "up" | "scale";
  delay?: number;
}) {
  const { ref, inView } = useInView({ threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
  const baseClass = variant === "scale" ? "scroll-reveal-scale" : "scroll-reveal";
  const style = delay > 0 ? { transitionDelay: inView ? `${delay}ms` : "0ms" } : undefined;
  return (
    <div
      ref={ref}
      className={`${baseClass} ${inView ? "is-visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

const VALUE_CARDS = [
  {
    problem: "You apply to dozens of jobs without knowing if you're a fit.",
    solution: "See a fit score for every listing—before you apply.",
    image: "/landing_feature_pngs/internship.png",
    imageAlt: "Matched internships with fit scores",
  },
  {
    problem: "Job boards filter by keywords. Your potential gets ignored.",
    solution: "We match by interests and strengths—not just past job titles.",
    image: "/landing_feature_pngs/profile.png",
    imageAlt: "Profile and interests",
  },
  {
    problem: "No experience? Most listings reject you before you start.",
    solution: "We surface roles for students. No prior experience required.",
    image: "/landing_feature_pngs/internship.png",
    imageAlt: "Internship opportunities",
  },
  {
    problem: "Applications get lost. You lose track of what you've applied to.",
    solution: "Save for later. Mark as completed. Unlock more entries as you go.",
    image: "/landing_feature_pngs/save.png",
    imageAlt: "Save and track applications",
  },
];

export function AllToolsSection() {
  return (
    <>
      {/* Brand logos — social proof */}
      <section className="border-t border-zinc-100 bg-white py-14 text-sm">
        <p className="mx-auto mb-8 max-w-2xl text-center text-xs uppercase tracking-wider text-zinc-400 md:text-sm">
          Roles at companies like these
        </p>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-6 px-6">
          {BANNER_LOGOS.map((logo) => (
            <BrandLogo key={logo.filename} logo={logo} />
          ))}
        </div>
      </section>

      {/* Why you need this — value-focused, scroll-animated */}
      <section className="relative overflow-hidden bg-zinc-100 px-6 py-24 md:py-32">
        <div
          className="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-amber-300/30 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-4xl">
          {/* Section headline */}
          <ScrollReveal variant="scale" className="text-center">
            <h2
              className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl"
              style={{ fontFamily: "var(--font-syne), var(--font-poppins), sans-serif" }}
            >
              Why you need this
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-600 md:text-lg">
              Stop applying blindly. Start applying smart.
            </p>
          </ScrollReveal>

          {/* Value cards — alternating layout, scroll-reveal */}
          <div className="mt-20 space-y-24 md:space-y-32">
            {VALUE_CARDS.map((card, i) => (
              <ScrollReveal
                key={i}
                delay={i * 80}
                className={`flex flex-col gap-8 md:gap-12 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                } md:items-center`}
              >
                <div className="flex-1 md:pr-12 md:pl-0">
                  <p className="text-sm font-medium italic text-zinc-500">{card.problem}</p>
                  <p
                    className="mt-4 text-xl font-semibold leading-snug text-zinc-900 md:text-2xl"
                    style={{ fontFamily: "var(--font-syne), var(--font-poppins), sans-serif" }}
                  >
                    {card.solution}
                  </p>
                </div>
                <div
                  className={`relative flex flex-1 justify-center ${
                    i % 2 === 1 ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-900/10 md:p-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent" />
                    <img
                      src={card.image}
                      alt={card.imageAlt}
                      className="relative z-10 h-48 w-auto object-contain md:h-56"
                    />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Bottom CTA */}
          <ScrollReveal className="mt-24 text-center">
            <p className="text-lg font-medium text-zinc-700">
              One profile. One dashboard. All the tools you need.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
