"use client";

import { useState, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
      className="h-[3.75em] w-auto object-contain"
      onError={onError}
    />
  );
}

export function AllToolsSection() {
  return (
    <>
      {/* Brand logos — social proof: companies students land at */}
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

      {/* All the tools that you need - headline, description, browser mockup */}
      <section className="relative overflow-hidden bg-zinc-100 px-6 py-20 md:py-28">
        {/* Decorative: orange + and dots, yellow blob from right */}
        <div
          className="pointer-events-none absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-amber-300/50 blur-3xl"
          aria-hidden
        />
        <span className="absolute left-[10%] top-[28%] text-lg text-amber-500/60" aria-hidden>+</span>
        <span className="absolute left-[14%] top-[58%] block h-1.5 w-1.5 rounded-full bg-amber-500/50" aria-hidden />
        <span className="absolute right-[22%] top-[22%] text-amber-500/50" aria-hidden>+</span>
        <span className="absolute right-[28%] top-[68%] block h-2 w-2 rounded-full bg-amber-500/40" aria-hidden />
        <span className="absolute bottom-[28%] left-[18%] block h-1 w-1 rounded-full bg-amber-500/40" aria-hidden />

        <div className="relative mx-auto max-w-3xl text-center">
          <h2
            className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl"
            style={{ fontFamily: "var(--font-syne), var(--font-poppins), sans-serif" }}
          >
            All the tools{" "}
            <span className="relative inline-block">
              <span className="relative z-10">that</span>
              <span
                className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"
                aria-hidden
              />
            </span>{" "}
            you need
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-700 md:text-lg">
            Match to internships and entry-level roles using your interests and
            strengths, not just past job titles. See a fit score for every
            listing and filter by minimum match.
          </p>

          <div className="mt-14 flex justify-center">
            <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
              <div className="flex items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-sm text-zinc-500">app.uncookedaura.com</span>
                <div className="flex gap-1 text-zinc-400">
                  <span aria-hidden>‹</span>
                  <span aria-hidden>›</span>
                </div>
              </div>
              <div
                className="relative aspect-video w-full overflow-hidden"
                aria-label="Feature overview"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-100/80 via-amber-50/60 to-zinc-100" />
                <Carousel
                  opts={{ loop: true }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <CarouselContent className="ml-0 h-full w-full">
                    <CarouselItem className="flex items-center justify-center pl-0">
                      <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
                        <h3 className="text-[1.5rem] font-semibold text-zinc-800 md:text-[1.75rem]">
                          Matched internships
                        </h3>
                        <div className="rounded-lg bg-white px-4 py-2">
                          <img
                            src="/landing_feature_pngs/internship.png"
                            alt="Matched internships"
                            className="h-40 w-auto object-contain md:h-52"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem className="flex items-center justify-center pl-0">
                      <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
                        <h3 className="text-[1.5rem] font-semibold text-zinc-800 md:text-[1.75rem]">
                          Save for later
                        </h3>
                        <div className="rounded-lg bg-white px-4 py-2">
                          <img
                            src="/landing_feature_pngs/save.png"
                            alt="Save for later"
                            className="h-40 w-auto object-contain md:h-52"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem className="flex items-center justify-center pl-0">
                      <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
                        <h3 className="text-[1.5rem] font-semibold text-zinc-800 md:text-[1.75rem]">
                          Search by keyword
                        </h3>
                        <div className="rounded-lg bg-white px-4 py-2">
                          <img
                            src="/landing_feature_pngs/search.png"
                            alt="Search by keyword"
                            className="h-40 w-auto object-contain md:h-52"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem className="flex items-center justify-center pl-0">
                      <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
                        <h3 className="text-[1.5rem] font-semibold text-zinc-800 md:text-[1.75rem]">
                          Profile & strengths
                        </h3>
                        <div className="rounded-lg bg-white px-4 py-2">
                          <img
                            src="/landing_feature_pngs/profile.png"
                            alt="Profile & strengths"
                            className="h-40 w-auto object-contain md:h-52"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="left-2 border-zinc-300 bg-white/90 hover:bg-white md:left-4" />
                  <CarouselNext className="right-2 border-zinc-300 bg-white/90 hover:bg-white md:right-4" />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
