import Link from "next/link";
import { ViewTransitionLink } from "@/components/ViewTransitionLink";

const PRODUCT_LINKS = [
  { label: "Features", href: "/learn#features" },
  { label: "AI Personalization", href: "/learn#ai-personalization" },
  { label: "Roadmap", href: "/roadmap" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Top: brand + Product and Company nav columns */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-12">
          {/* Company info */}
          <div>
            <ViewTransitionLink
              href="/"
              className="flex items-center gap-2"
              aria-label="UncookedAura home"
            >
              <span
                className="h-8 w-8 shrink-0 rounded-lg bg-[#171717]"
                aria-hidden
              />
              <span className="text-xl font-bold tracking-tight text-zinc-900">
                UncookedAura
              </span>
            </ViewTransitionLink>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Match internships to your profile—no prior experience required.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:col-span-3 lg:gap-12">
            <nav aria-label="Product">
              <h3 className="text-sm font-bold tracking-tight text-zinc-900">
                Product
              </h3>
              <ul className="mt-4 space-y-3">
                {PRODUCT_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-zinc-600 hover:text-zinc-900"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Company">
              <h3 className="text-sm font-bold tracking-tight text-zinc-900">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {COMPANY_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-zinc-600 hover:text-zinc-900"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom: copyright + legal links */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 sm:flex-row">
          <span className="text-sm text-zinc-500">
            © 2025 Aeth Private. All rights reserved.
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <ViewTransitionLink
              href="/privacy-policy"
              className="text-sm text-zinc-500 hover:text-zinc-900"
            >
              Privacy Policy
            </ViewTransitionLink>
            <Link
              href="/tos"
              className="text-sm text-zinc-500 hover:text-zinc-900"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookie-policy"
              className="text-sm text-zinc-500 hover:text-zinc-900"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
