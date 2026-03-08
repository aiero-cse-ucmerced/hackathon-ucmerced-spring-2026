import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Roadmap – UncookedAura",
  description:
    "Product roadmap and development status for UncookedAura. Progress and future direction are subject to change.",
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="border-b border-zinc-100 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Back to home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
          Roadmap
        </h1>
        <p className="mt-2 text-zinc-500">
          Last updated: March 2025
        </p>

        <div className="mt-12 space-y-10 text-zinc-700">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Development Status
            </h2>
            <p className="mt-3 leading-relaxed">
              UncookedAura is currently in active development. However, please
              note that <strong>future progress and product direction remain
              TBD (to be determined)</strong>. The lead developer may or may not
              continue the project depending on availability, priorities, and
              other factors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Product Direction
            </h2>
            <p className="mt-3 leading-relaxed">
              It is not certain where the product heads from here. Roadmap items,
              feature timelines, and long-term plans are subject to change
              without notice. We encourage you to use the service as it exists
              today and to check back periodically for updates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Questions?
            </h2>
            <p className="mt-3 leading-relaxed">
              If you have feedback or questions about the product, please reach
              out via our{" "}
              <Link href="/contact" className="font-medium text-zinc-900 underline hover:no-underline">
                Contact
              </Link>{" "}
              page.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
