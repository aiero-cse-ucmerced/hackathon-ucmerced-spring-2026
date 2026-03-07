"use client";

const LOGOS = [
  "Pinterest",
  "Amazon",
  "eBay",
  "facebook",
  "VISA",
  "Booking.com",
  "Google",
  "Meta",
  "BBC",
  "Spotify",
  "Bloomberg",
  "Zalando",
];

export function Marquee() {
  const duplicated = [...LOGOS, ...LOGOS];

  return (
    <section className="relative overflow-hidden border-t border-zinc-200 bg-white py-10">
      <div className="flex w-max animate-[marquee_30s_linear_infinite] items-center gap-16 whitespace-nowrap">
        {duplicated.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="text-base font-semibold uppercase tracking-wider text-zinc-600"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
