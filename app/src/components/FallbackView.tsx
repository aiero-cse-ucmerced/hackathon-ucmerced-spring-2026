"use client";

import Link from "next/link";

/**
 * Minimal, typographic fallback view inspired by Studio Dado (404s.design).
 * Use for 404 (route not found) or auth-required flows.
 */
export type FallbackVariant = "404" | "auth";

export interface FallbackViewProps {
  variant: FallbackVariant;
  /** Optional custom title (e.g. "404" or "Sign in required") */
  title?: string;
  /** Optional short line of copy below the title */
  description?: string;
  /** Primary action label */
  primaryLabel?: string;
  /** Primary action href (default: / for 404, / for auth) */
  primaryHref?: string;
  /** Secondary action: back link label */
  secondaryLabel?: string;
}

const defaults: Record<
  FallbackVariant,
  Pick<FallbackViewProps, "title" | "description" | "primaryLabel" | "primaryHref" | "secondaryLabel">
> = {
  "404": {
    title: "404",
    description: "This page doesn’t exist or has been moved.",
    primaryLabel: "Go home",
    primaryHref: "/",
    secondaryLabel: "Go back",
  },
  auth: {
    title: "Sign in",
    description: "Sign in to view this page.",
    primaryLabel: "Sign in",
    primaryHref: "/",
    secondaryLabel: "Go back",
  },
};

export function FallbackView({
  variant,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
}: FallbackViewProps) {
  const d = defaults[variant];
  const finalTitle = title ?? d.title;
  const finalDescription = description ?? d.description;
  const finalPrimaryLabel = primaryLabel ?? d.primaryLabel;
  const finalPrimaryHref = primaryHref ?? d.primaryHref ?? "/";
  const finalSecondaryLabel = secondaryLabel ?? d.secondaryLabel;

  return (
    <div className="flex min-h-[60vh] w-full flex-1 flex-col items-center justify-center bg-white px-6 py-16 sm:min-h-[70vh]">
      <div className="mx-auto w-full max-w-md text-center">
        <p
          className="mx-auto font-bold tracking-tight text-[#171717]"
          style={{ fontSize: "clamp(4rem, 18vw, 12rem)", lineHeight: 0.9 }}
          aria-hidden
        >
          {finalTitle}
        </p>
        <p className="mx-auto mt-10 w-full max-w-sm text-base leading-relaxed text-zinc-700 sm:mt-12">
          {finalDescription}
        </p>
        <nav
          className="mx-auto mt-12 flex w-full flex-wrap items-center justify-center gap-6 sm:mt-14"
          aria-label="Actions"
        >
          <Link
            href={finalPrimaryHref}
            className="inline-flex h-12 min-w-[140px] items-center justify-center rounded-lg bg-[#171717] px-6 text-base font-medium text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            {finalPrimaryLabel}
          </Link>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = "/";
              }
            }}
            className="rounded text-sm font-medium text-zinc-700 underline decoration-zinc-400 underline-offset-2 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
          >
            {finalSecondaryLabel}
          </button>
        </nav>
      </div>
    </div>
  );
}
