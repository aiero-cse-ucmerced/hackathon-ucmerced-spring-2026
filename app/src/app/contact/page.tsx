import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "Contact – UncookedAura",
  description:
    "Get in touch with UncookedAura. We're here to help with questions about internships and our platform.",
};

const SUPPORT_EMAIL = "uncookedaura-support@alphr.one";

export default function ContactPage() {
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
          Contact us
        </h1>
        <p className="mt-2 text-zinc-500">
          We’d love to hear from you.
        </p>

        <div className="mt-12 space-y-8 text-zinc-700">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Email
            </h2>
            <p className="mt-3 leading-relaxed">
              For support, questions about your account, or general inquiries, reach us at:
            </p>
            <p className="mt-2">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
