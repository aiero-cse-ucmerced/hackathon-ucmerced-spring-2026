import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="bg-white px-6 pt-8">
        <div className="mx-auto max-w-6xl">
          <Logo />
        </div>
      </header>
      <div className="px-6 pb-20 pt-12">
        <div className="mx-auto flex max-w-md flex-1 flex-col items-stretch justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

