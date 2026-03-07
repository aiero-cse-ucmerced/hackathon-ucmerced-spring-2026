import Link from "next/link";

const PRODUCT_LINKS = [
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Changelog", href: "#" },
  { label: "Roadmap", href: "#" },
];

const RESOURCES_LINKS = [
  { label: "Documentation", href: "#" },
  { label: "Guides", href: "#" },
  { label: "Templates", href: "#" },
  { label: "Blog", href: "#" },
];

const COMPANY_LINKS = [
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Support", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Top: brand + three nav columns (even gaps between Product, Resources, Company) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-12">
          {/* Company info */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="Uncooked home"
            >
              <span
                className="h-8 w-8 shrink-0 rounded-lg bg-[#171717]"
                aria-hidden
              />
              <span className="text-xl font-bold tracking-tight text-zinc-900">
                Uncooked
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              The complete platform to
            </p>
          </div>

          {/* Product, Resources, Company — same gap between each */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 lg:col-span-3 lg:gap-12">
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
            <nav aria-label="Resources">
              <h3 className="text-sm font-bold tracking-tight text-zinc-900">
                Resources
              </h3>
              <ul className="mt-4 space-y-3">
                {RESOURCES_LINKS.map(({ label, href }) => (
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
            <Link
              href="/privacy-policy"
              className="text-sm text-zinc-500 hover:text-zinc-900"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-zinc-500 hover:text-zinc-900"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
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
