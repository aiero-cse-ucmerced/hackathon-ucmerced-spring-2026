import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 text-zinc-900">
      {/* Subtle gradient mesh background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-amber-50/60 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-zinc-200/50 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-96 -translate-x-1/2 rounded-full bg-white/80 blur-3xl" />
      </div>
      <header className="border-b border-zinc-200/60 bg-white/80 px-6 py-6 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl">
          <Logo />
        </div>
      </header>
      <div className="px-6 pb-24 pt-14">
        <div className="mx-auto flex max-w-md flex-1 flex-col items-stretch justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

