"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

/**
 * Route-level error boundary. Minimal, typographic layout inspired by
 * Studio Dado (https://www.404s.design/sites/studio-dado). Includes a
 * collapsible "Developer details" section with error message and stack.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const hasStack = typeof error.stack === "string" && error.stack.length > 0;

  return (
    <div className="flex min-h-[60vh] w-full flex-1 flex-col items-center justify-center bg-white px-6 py-16 sm:min-h-[70vh]">
      <div className="mx-auto w-full max-w-md text-center">
        <p
          className="mx-auto font-bold tracking-tight text-[#171717]"
          style={{ fontSize: "clamp(4rem, 18vw, 12rem)", lineHeight: 0.9 }}
          aria-hidden
        >
          Error
        </p>
        <p className="mx-auto mt-10 w-full max-w-sm text-base leading-relaxed text-zinc-700 sm:mt-12">
          Something went wrong. You can try again or go back home.
        </p>
        <nav
          className="mx-auto mt-12 flex w-full flex-wrap items-center justify-center gap-6 sm:mt-14"
          aria-label="Actions"
        >
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 min-w-[140px] items-center justify-center rounded-lg bg-[#171717] px-6 text-base font-medium text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded text-sm font-medium text-zinc-700 underline decoration-zinc-400 underline-offset-2 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
          >
            Go home
          </Link>
        </nav>

        <div className="mx-auto mt-14 w-full max-w-lg text-left">
          <Collapsible defaultValue={false} className="rounded-lg border border-zinc-200 bg-zinc-50/50">
            <CollapsibleTrigger
              className={cn(
                "group flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-zinc-700",
                "hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-inset rounded-lg transition-colors"
              )}
            >
              <span>Developer details</span>
              <svg
                className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border-t border-zinc-200 px-4 py-3">
                <p className="text-sm font-medium text-zinc-900">{error.message}</p>
                {error.digest && (
                  <p className="mt-1 text-xs text-zinc-500">Digest: {error.digest}</p>
                )}
                {hasStack && (
                  <pre className="mt-3 max-h-48 overflow-auto rounded bg-zinc-100 p-3 text-xs text-zinc-700 whitespace-pre-wrap break-words">
                    <code>{error.stack}</code>
                  </pre>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
