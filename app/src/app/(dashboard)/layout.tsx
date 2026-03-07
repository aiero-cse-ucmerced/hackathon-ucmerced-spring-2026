"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/components/AuthProvider";
import { AuthCardSkeleton } from "@/components/skeleton/AuthCardSkeleton";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!loading && !user) {
    router.replace("/unauthorized");
  }

  const inDashboard = pathname?.startsWith("/dashboard") ?? false;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo />
          </Link>
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
      <main className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {loading ? <AuthCardSkeleton /> : children}
        </div>
      </main>
    </div>
  );
}

