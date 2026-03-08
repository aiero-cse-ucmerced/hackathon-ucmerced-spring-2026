"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export function LandingHeroCTA() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <span className="inline-flex h-14 min-w-[180px] items-center justify-center gap-2 rounded-xl bg-zinc-200 px-8 text-base font-medium text-zinc-500">
        Loading…
      </span>
    );
  }

  if (user) {
    return (
      <Link
        href="/dashboard"
        className="inline-flex h-14 min-w-[180px] items-center justify-center gap-2 rounded-xl bg-[#171717] px-8 text-base font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-[#2a2a2a] hover:shadow-xl hover:shadow-zinc-900/25 focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
      >
        Dashboard →
      </Link>
    );
  }

  return (
    <Link
      href="/signup"
      className="inline-flex h-14 min-w-[180px] items-center justify-center gap-2 rounded-xl bg-[#171717] px-8 text-base font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-[#2a2a2a] hover:shadow-xl hover:shadow-zinc-900/25 focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2"
    >
      Get Started →
    </Link>
  );
}
