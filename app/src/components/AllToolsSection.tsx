const BRAND_ROW_1 = [
  "Pinterest",
  "VAYNERMEDIA",
  "Disney",
  "facebook",
  "VISA",
  "Booking.com",
];
const BRAND_ROW_2 = [
  "Google",
  "Meta",
  "BBC",
  "Spotify",
  "PELOTON",
  "xero",
  "NI",
];

export function AllToolsSection() {
  return (
    <>
      {/* Brand names - static, two rows */}
      <section className="border-t border-zinc-100 bg-white py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8 px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {BRAND_ROW_1.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold uppercase tracking-wider text-zinc-500"
              >
                {name}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {BRAND_ROW_2.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold uppercase tracking-wider text-zinc-500"
              >
                {name}
              </span>
            ))}
          </div>
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
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
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
            Sit elit feugiat turpis sed integer integer accumsan turpis. Sed
            suspendisse nec lorem mauris.
          </p>
          <p className="mx-auto mt-2 text-base leading-relaxed text-zinc-700 md:text-lg">
            Pharetra, eu imperdiet ipsum ultrices amet, dui sit suspendisse.
          </p>

          <div className="mt-14 flex justify-center">
            <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
              <div className="flex items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-sm text-zinc-500">uteach.com</span>
                <div className="flex gap-1 text-zinc-400">
                  <span aria-hidden>‹</span>
                  <span aria-hidden>›</span>
                </div>
              </div>
              <div className="relative aspect-video w-full overflow-hidden" aria-hidden>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-200 via-blue-100 to-zinc-100" />
                <svg
                  className="absolute bottom-4 right-8 h-24 w-32 opacity-40"
                  viewBox="0 0 100 80"
                  fill="none"
                  stroke="rgb(245 158 11)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                >
                  <path d="M10 60 Q40 20 70 50 T100 70" />
                  <path d="M20 50 Q50 30 80 60" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
