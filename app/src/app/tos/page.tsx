import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Terms of Service – UncookedAura",
  description:
    "Terms of Service for using UncookedAura's internship matching platform.",
};

export default function TermsOfServicePage() {
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
          Terms of Service
        </h1>
        <p className="mt-2 text-zinc-500">
          Last updated: March 2025
        </p>

        <div className="mt-12 space-y-10 text-zinc-700">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Agreement to Terms
            </h2>
            <p className="mt-3 leading-relaxed">
              By accessing or using UncookedAura (&quot;the Service&quot;), operated by
              Aeth Private (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be
              bound by these Terms of Service. If you do not agree to these
              terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Description of Service
            </h2>
            <p className="mt-3 leading-relaxed">
              UncookedAura is an internship and entry-level job matching platform
              that helps users discover opportunities based on their interests,
              strengths, and profile. The Service provides matching, search,
              saving, and application features. We reserve the right to modify,
              suspend, or discontinue any part of the Service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Account and Eligibility
            </h2>
            <p className="mt-3 leading-relaxed">
              You must be at least 13 years of age to use the Service. By
              creating an account, you represent that you meet this requirement
              and that the information you provide is accurate and complete. You
              are responsible for maintaining the confidentiality of your
              account credentials and for all activity under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Acceptable Use
            </h2>
            <p className="mt-3 leading-relaxed">
              You agree to use the Service only for lawful purposes and in
              accordance with these Terms. You will not:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-700">
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Attempt to gain unauthorized access to the Service or related systems</li>
              <li>Use the Service to transmit malware, spam, or harmful content</li>
              <li>Interfere with or disrupt the Service or its infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Intellectual Property
            </h2>
            <p className="mt-3 leading-relaxed">
              The Service, including its design, content, and software, is owned
              by Aeth Private and protected by intellectual property laws. You
              may not copy, modify, distribute, or create derivative works
              without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Disclaimer of Warranties
            </h2>
            <p className="mt-3 leading-relaxed">
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without
              warranties of any kind, either express or implied. We do not
              guarantee the accuracy, completeness, or usefulness of any
              internship listings or matching results. Your use of the Service
              is at your sole risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Limitation of Liability
            </h2>
            <p className="mt-3 leading-relaxed">
              To the maximum extent permitted by law, Aeth Private and its
              affiliates shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of profits
              or data, arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Changes to Terms
            </h2>
            <p className="mt-3 leading-relaxed">
              We may update these Terms from time to time. We will notify you of
              material changes by posting the updated Terms on this page and
              updating the &quot;Last updated&quot; date. Your continued use of the
              Service after such changes constitutes acceptance of the revised
              Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Contact
            </h2>
            <p className="mt-3 leading-relaxed">
              For questions about these Terms of Service, please contact us via
              our{" "}
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
