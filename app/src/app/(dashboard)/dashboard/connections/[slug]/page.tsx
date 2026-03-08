"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

const CONNECTIONS: Record<
  string,
  {
    title: string;
    description: string;
    paragraphs: string[];
  }
> = {
  "career-center": {
    title: "Career center",
    description: "Book a session with your campus career advisor.",
    paragraphs: [
      "Your career center isn’t just a place to print resumes. It’s a hub of people who’ve seen hundreds of students land internships and full-time roles—and they’re paid to help you do the same. Advisors can spot gaps in your materials, run mock interviews, and point you toward opportunities you didn’t know existed.",
      "Walk-in hours are ideal when you need quick feedback or a sanity check. For deeper work—resume overhauls, career path exploration, or targeted prep—book a dedicated slot. Come prepared with specific questions and a rough draft. The more you bring, the more you’ll get back.",
      "Pro tip: many centers offer industry-specific advisors or alumni panels. Ask what’s available beyond the general desk. A 30-minute chat with someone who’s been in your target field can be worth more than a semester of guessing.",
    ],
  },
  "alumni-network": {
    title: "Alumni network",
    description: "Connect with graduates in your field.",
    paragraphs: [
      "Your school’s alumni have already crossed the bridge you’re standing on. They’ve navigated the same job market, made the same mistakes, and figured out what actually works. Most are surprisingly willing to share—informational interviews, coffee chats, and referrals are how many of them got their own breaks.",
      "Search by industry, company, or role. When you reach out, be specific: mention what drew you to their path, ask one or two focused questions, and keep it short. A “Hey, can you tell me about your job?” lands differently than “I’m exploring product roles and would love 15 minutes to hear how you transitioned from engineering.”",
      "Don’t treat it as a one-way ask. Share what you’re learning, follow up when you land something, and pay it forward when you’re the one with experience. The network compounds when people actually use it.",
    ],
  },
  mentorship: {
    title: "Mentorship",
    description: "Find a mentor for your internship search.",
    paragraphs: [
      "A mentor isn’t a magic shortcut—they’re a sounding board who’s been through the grind. They can help you prioritize applications, decode offer letters, and decide when to push back versus when to accept. The best ones ask questions that make you think, instead of handing you a script.",
      "Matching programs typically pair you with someone in your target industry or role. Expect monthly or biweekly check-ins. Come with updates, blockers, and decisions you’re weighing. The more you share, the more useful the relationship becomes.",
      "Mentorship works both ways. Respect their time, show up prepared, and follow through on what you discuss. A mentor who sees you act on their advice is far more likely to go the extra mile—intros, referrals, or a nudge when an opening appears.",
    ],
  },
  workshops: {
    title: "Workshops",
    description: "Upcoming resume and interview workshops.",
    paragraphs: [
      "Workshops are where theory meets practice. Resume clinics, LinkedIn deep-dives, behavioral interview prep, and technical mock sessions—they’re all designed to compress months of trial-and-error into a few focused hours. The facilitators have seen what works and what doesn’t, and they’ll call it out.",
      "Drop-in sessions are low commitment: show up, get feedback, leave. Structured series often build on each other, so if you’re serious about leveling up, commit to the full run. Bring your actual materials. Generic examples don’t get the same quality of critique.",
      "Check the events calendar regularly. New workshops pop up around recruiting seasons, and the best ones fill quickly. If you can’t make it live, ask if recordings or slides are available—many are.",
    ],
  },
  "employer-events": {
    title: "Employer events",
    description: "Info sessions and meet-and-greets.",
    paragraphs: [
      "Employer events are your chance to move from “just another application” to “the person I met at the info session.” Recruiters and hiring managers show up specifically to meet candidates. A strong conversation can lead to a direct referral, a fast-tracked interview, or at minimum, a name to drop in your cover letter.",
      "Info sessions cover company culture, roles, and what they look for. Meet-and-greets are more informal—bring questions, be curious, and follow up with a LinkedIn connection or thank-you note. Mention something specific from the conversation so they remember you.",
      "Virtual events are easier to attend but harder to stand out. Turn your camera on, ask a thoughtful question in the chat or Q&A, and reach out afterward. In-person events are gold: dress appropriately, arrive early, and stay for the networking portion. The people who linger often get the best conversations.",
    ],
  },
};

export default function ConnectionDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ? decodeURIComponent(params.slug) : "";
  const connection = slug ? CONNECTIONS[slug] : null;

  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (!connection) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 rounded-md"
            aria-label="Back to dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to dashboard
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
            {connection.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600">
            {connection.description}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="shrink-0 inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
          aria-label="Close and return to dashboard"
        >
          Close
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-900">Overview</h2>
        <div className="mt-4 space-y-4">
          {connection.paragraphs.map((para, i) => (
            <p key={i} className="text-sm leading-relaxed text-zinc-700">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
