import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Privacy Policy – UncookedAura",
  description:
    "How UncookedAura collects, uses, and protects your data when you use our internship matching service.",
};

export default function PrivacyPolicyPage() {
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
          Privacy Policy
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
              UncookedAura (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to
              respecting your privacy. This policy explains how we collect, use,
              store, and share your personal data when you use our internship
              matching platform. We are transparent about our practices so you
              can make informed choices about your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Information We Collect
            </h2>
            <p className="mt-3 leading-relaxed">
              We collect information you provide directly, such as your name,
              email address, password, major, interests, strengths, past
              experiences, and contact preferences. When you apply for internships
              through our service, we may also collect your phone number and
              preferences for communication (email, phone, or online meetings
              such as Zoom).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              How We Use Your Data
            </h2>
            <p className="mt-3 leading-relaxed">
              We use your data to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-700">
              <li>Match you with internships based on your profile and interests</li>
              <li>Personalize your experience and recommendations</li>
              <li>Send you relevant internship matches and updates (if you opt in)</li>
              <li>Communicate with you about your account and our service</li>
              <li>Improve our platform and develop new features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Sharing Data with Internship Companies
            </h2>
            <p className="mt-3 leading-relaxed">
              When you apply for internships through UncookedAura, we share
              relevant information with employers and internship providers to
              facilitate your application. This may include:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-700">
              <li>
                <strong>Email:</strong> Your email address is shared so employers
                can contact you about applications, interviews, and follow-ups.
              </li>
              <li>
                <strong>Phone number:</strong> If you provide a phone number, it
                may be shared so employers can reach you by call or text for
                interviews and updates.
              </li>
              <li>
                <strong>Online meetings (e.g., Zoom):</strong> When you schedule
                or join interviews via Zoom or similar platforms, we may share
                your name and contact details so employers can send meeting
                invitations and conduct interviews.
              </li>
              <li>
                <strong>Profile data:</strong> Your interests, strengths, and past
                experiences may be shared to help employers understand your
                background and suitability for roles.
              </li>
            </ul>
            <p className="mt-4 leading-relaxed">
              We only share data with companies you explicitly apply to or
              engage with. We do not sell your personal information to third
              parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Your Privacy Rights
            </h2>
            <p className="mt-3 leading-relaxed">
              You have the right to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-700">
              <li>Access and download a copy of your data</li>
              <li>Correct or update your information</li>
              <li>Manage your email and communication preferences</li>
              <li>Request deletion of your account and data</li>
            </ul>
            <p className="mt-4 leading-relaxed">
              You can exercise these rights in your{" "}
              <Link href="/settings" className="font-medium text-zinc-900 underline hover:no-underline">
                Account settings
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Deleting Your Data
            </h2>
            <p className="mt-3 leading-relaxed">
              You may request deletion of your account and all associated data at
              any time. Here is how it works:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-zinc-700">
              <li>
                Go to <strong>Account settings</strong> → <strong>Data privacy</strong> →{" "}
                <strong>Delete your data</strong>.
              </li>
              <li>
                Confirm by typing &quot;delete&quot; in the confirmation field. This
                ensures the action is intentional.
              </li>
              <li>
                Once confirmed, we will permanently delete your account, profile,
                saved internships, and preferences from our systems within 30
                days.
              </li>
              <li>
                Data already shared with employers (e.g., in applications you
                submitted) may be retained by those employers per their own
                policies. We cannot delete data held by third parties.
              </li>
              <li>
                Deletion is irreversible. You will need to create a new account
                if you wish to use UncookedAura again.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Data Security
            </h2>
            <p className="mt-3 leading-relaxed">
              We use industry-standard measures to protect your data, including
              encryption and secure storage. We do not store your password in
              plain text. Passwords are hashed and never shared.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Contact Us
            </h2>
            <p className="mt-3 leading-relaxed">
              If you have questions about this Privacy Policy or your data,
              please contact us at privacy@uncookedaura.com.
            </p>
          </section>
        </div>

      </article>
    </div>
  );
}
