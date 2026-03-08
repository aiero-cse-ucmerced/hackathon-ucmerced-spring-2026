"use client";

import { type ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/components/AuthProvider";
import { AuthCardSkeleton } from "@/components/skeleton/AuthCardSkeleton";
import { isOnboardingComplete } from "@/lib/internships-api";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/unauthorized");
      return;
    }
    if (!loading && user && !isOnboardingComplete() && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [loading, user, pathname, router]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <Logo href="/dashboard" />
          <nav className="flex items-center gap-5 text-sm font-medium text-zinc-700">
            <Link
              href="/dashboard"
              className={
                pathname === "/dashboard"
                  ? "text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900"
              }
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/jobs"
              className={
                pathname === "/dashboard/jobs"
                  ? "text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900"
              }
            >
              Jobs
            </Link>
            <Link
              href="/dashboard/saved"
              className={
                pathname === "/dashboard/saved"
                  ? "text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900"
              }
            >
              Saved
            </Link>
            <Link
              href="/dashboard/connections"
              className={
                pathname?.startsWith("/dashboard/connections")
                  ? "text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900"
              }
            >
              Connections
            </Link>
          </nav>
          <UserMenu showName className="shrink-0" />
        </div>
      </header>
      <div className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {loading ? <AuthCardSkeleton /> : children}
        </div>
      </div>
    </div>
  );
}

