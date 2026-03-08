import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = {
  title: "About – UncookedAura",
  description:
    "Learn about UncookedAura and the team behind making internships and jobs accessible based on your interests.",
};

export default function AboutPage() {
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
          About UncookedAura
        </h1>
        <p className="mt-2 text-zinc-500">
          Making internships and jobs accessible to everyone.
        </p>

        <div className="mt-12 space-y-10 text-zinc-700">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Our story
            </h2>
            <p className="mt-3 leading-relaxed">
              UncookedAura was built by <strong>Vainavi C</strong> and <strong>Andre B</strong> with a simple idea: internships and jobs should be easy to find and match to your interests, not hidden behind experience requirements or opaque processes.
            </p>
            <p className="mt-3 leading-relaxed">
              Inspired by job recruitment platforms like Indeed and ZipRecruiter, we wanted to create a place where opportunities are surfaced based on what you care about. Whether you have a clear direction or are still exploring, uploading your resume—even with blank or minimal interests—helps fill in the gaps. Your profile and past experiences give you something concrete to show big companies, so you have something to look forward to and a way to stand out.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900">
              Our mission
            </h2>
            <p className="mt-3 leading-relaxed">
              We believe everyone deserves a fair shot at internships and early-career roles. By matching opportunities to your profile and interests, we help you discover roles that fit you—and help companies discover you—without requiring years of experience first.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
