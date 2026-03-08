import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Cookie Policy – UncookedAura",
  description:
    "How UncookedAura uses cookies for authentication, security, and service delivery.",
};

export default function CookiePolicyPage() {
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
          Cookie Policy
        </h1>
        <p className="mt-2 text-zinc-500">
          Last updated: March 2025
        </p>

        <div className="mt-12 space-y-10 text-zinc-700">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Introduction
            </h2>
            <p className="mt-3 leading-relaxed">
              UncookedAura (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) uses cookies and
              similar technologies to provide and secure our service. This policy
              explains what cookies we use, why we use them, and how you can
              manage your preferences. For how we collect and use your personal
              data more broadly, see our{" "}
              <Link
                href="/privacy-policy"
                className="font-medium text-zinc-900 underline hover:no-underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Cookies We Use
            </h2>
            <p className="mt-3 leading-relaxed">
              The table below lists the cookies we use and their purposes.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse border border-zinc-200">
                <thead>
                  <tr className="bg-zinc-50">
                    <th className="border border-zinc-200 px-4 py-3 text-left text-sm font-semibold text-zinc-900">
                      Cookie
                    </th>
                    <th className="border border-zinc-200 px-4 py-3 text-left text-sm font-semibold text-zinc-900">
                      Purpose
                    </th>
                    <th className="border border-zinc-200 px-4 py-3 text-left text-sm font-semibold text-zinc-900">
                      Duration
                    </th>
                    <th className="border border-zinc-200 px-4 py-3 text-left text-sm font-semibold text-zinc-900">
                      Security
                    </th>
                    <th className="border border-zinc-200 px-4 py-3 text-left text-sm font-semibold text-zinc-900">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5">ua_rest_api_key</code>
                    </td>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      Authenticate API requests; enforce rate limits (5000/hr
                      authenticated vs 60/hr unauthenticated)
                    </td>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      Session or configurable
                    </td>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      Secure, HttpOnly, SameSite=Strict
                    </td>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      Strictly necessary
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5">cf_clearance</code>
                    </td>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      Cloudflare Turnstile bot detection on signup
                    </td>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      Varies
                    </td>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      Managed by Cloudflare
                    </td>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      Strictly necessary
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      Next.js / framework cookies
                    </td>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      Routing, session handling
                    </td>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      Session
                    </td>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      Secure, HttpOnly where applicable
                    </td>
                    <td className="border border-zinc-200 px-4 py-3 text-sm">
                      Strictly necessary
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Authentication Cookies
            </h2>
            <p className="mt-3 leading-relaxed">
              When you sign in, our backend may set a session cookie to securely
              authenticate your requests to our API. This cookie is used to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-700">
              <li>Identify you as a logged-in user</li>
              <li>Apply rate limits (5,000 requests per hour for authenticated users vs 60 per hour for unauthenticated visitors)</li>
              <li>Protect your account and our systems from abuse</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              Our auth cookie (<code className="rounded bg-zinc-100 px-1.5 py-0.5">ua_rest_api_key</code>) is set with security best practices:
              <strong> Secure</strong> (HTTPS only), <strong>HttpOnly</strong> (not accessible to JavaScript, reducing XSS risk),
              and <strong>SameSite=Strict</strong> (mitigates CSRF). We do not set a Domain attribute so only the exact host can read it.
              Today, some parts of our app may also use browser storage (e.g. localStorage) for auth tokens; we are moving toward
              HTTP-only cookies for session management where appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Cloudflare Turnstile
            </h2>
            <p className="mt-3 leading-relaxed">
              We use Cloudflare Turnstile on our signup page to detect and block
              automated bots. Turnstile may set a <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">cf_clearance</code> cookie
              when pre-clearance is enabled, or it may use one-time tokens. This
              helps keep our service secure and prevents abuse. Cloudflare&apos;s
              use of cookies is governed by their own privacy and cookie
              policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Your Choices
            </h2>
            <p className="mt-3 leading-relaxed">
              You can control cookies through your browser settings. Most
              browsers allow you to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-700">
              <li>View and delete cookies stored on your device</li>
              <li>Block all cookies or only third-party cookies</li>
              <li>Allow cookies only for specific sites</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              If you disable or block strictly necessary cookies, some features
              of our service may not work correctly. For example, you may not
              be able to sign in, complete signup (if Turnstile is blocked), or
              access certain protected areas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Updates
            </h2>
            <p className="mt-3 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or applicable law. We will post the
              updated policy on this page and update the &quot;Last updated&quot; date.
              We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Contact Us
            </h2>
            <p className="mt-3 leading-relaxed">
              If you have questions about this Cookie Policy or our use of
              cookies, please contact us at privacy@uncookedaura.com.
            </p>
          </section>
        </div>

      </article>
    </div>
  );
}
