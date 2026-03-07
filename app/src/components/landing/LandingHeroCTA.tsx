"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function LandingHeroCTA() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <span className="inline-flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-lg border border-transparent bg-zinc-200 px-6 text-base font-medium text-zinc-500">
        Loading…
      </span>
    );
  }

  if (isLoggedIn) {
    return (
      <Link
        href="/dashboard"
        className="inline-flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-lg border border-transparent bg-[#171717] px-6 text-base font-medium text-white transition-colors hover:bg-[#2a2a2a] focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
      >
        Dashboard →
      </Link>
    );
  }

  return (
    <Link
      href="/signup"
      className="inline-flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-lg border border-transparent bg-[#171717] px-6 text-base font-medium text-white transition-colors hover:bg-[#2a2a2a] focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
    >
      Get Started →
    </Link>
  );
}
