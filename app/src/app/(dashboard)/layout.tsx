"use client";

import { type ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/components/AuthProvider";
import { AuthCardSkeleton } from "@/components/skeleton/AuthCardSkeleton";
import { isOnboardingComplete } from "@/lib/internships-api";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
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

  const inDashboard = pathname?.startsWith("/dashboard") ?? false;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <Logo href="/dashboard" />
          <nav className="flex items-center gap-4 text-sm font-medium text-zinc-700">
            <Link
              href="/dashboard"
              className={
                inDashboard
                  ? "text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900"
              }
            >
              Dashboard
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
              href="/dashboard/events"
              className={
                pathname === "/dashboard/events"
                  ? "text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900"
              }
            >
              Events
            </Link>
            <Link
              href="/dashboard/profile"
              className={
                pathname === "/dashboard/profile"
                  ? "text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900"
              }
            >
              Profile
            </Link>
            <button
              type="button"
              onClick={() => {
                signOut();
                router.replace("/login");
              }}
              className="text-zinc-600 hover:text-zinc-900"
            >
              Sign out
            </button>
          </nav>
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

