import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Dashboard – UncookedAura",
  description: "Your matched internships and progress.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="border-b border-zinc-100 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-4">
            <Link
              href="/settings"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="mt-2 text-zinc-500">
          Your matched internships will appear here.
        </p>
      </div>
    </div>
  );
}
