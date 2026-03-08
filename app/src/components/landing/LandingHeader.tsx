"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/components/AuthProvider";

export function LandingHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-100/80 bg-white/95 px-6 py-5 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          {!loading &&
            (user ? (
              <UserMenu showName />
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  Sign up
                </Link>
              </>
            ))}
        </nav>
      </div>
    </header>
  );
}
