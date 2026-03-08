"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

type ConnectionResource = { label: string; href: string; description?: string };

const CONNECTIONS: Record<
  string,
  {
    title: string;
    description: string;
    paragraphs: string[];
    resources: ConnectionResource[];
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
    resources: [
      { label: "LinkedIn for Students", href: "https://students.linkedin.com/en-us", description: "Career advice, interview prep, and job search tips from LinkedIn." },
      { label: "LinkedIn Guide to Networking", href: "https://www.linkedin.com/showcase/linkedin-member-guide/", description: "Official guide to building your professional network." },
      { label: "NACE Career Resources", href: "https://careers.naceweb.org/jobseekers/resources/", description: "National Association of Colleges and Employers—resume, coaching, and career readiness tools." },
      { label: "Handshake", href: "https://joinhandshake.com", description: "Student job platform used by thousands of campuses—internships and entry-level roles." },
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
    resources: [
      { label: "LinkedIn Alumni Search", href: "https://www.linkedin.com/search/results/people/?keywords=alumni", description: "Find alumni by school, company, or industry on LinkedIn." },
      { label: "LinkedIn: Guide to Informational Interviews", href: "https://www.linkedin.com/business/learning/blog/career-success-tips/guide-to-informational-interviews", description: "How to request, prepare, and follow up after informational interviews." },
      { label: "HBR: How to Get the Most Out of an Informational Interview", href: "https://hbr.org/2016/02/how-to-get-the-most-out-of-an-informational-interview", description: "Harvard Business Review's practical tips for informational interviews." },
      { label: "LinkedIn Career Checklist for Students", href: "https://www.linkedin.com/blog/member/archive/career-checklist-for-students-support-network", description: "3 steps to build your support network as a student." },
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
    resources: [
      { label: "LinkedIn for Students", href: "https://students.linkedin.com/en-us", description: "Use LinkedIn to find and connect with potential mentors in your field." },
      { label: "LinkedIn Guide to Networking", href: "https://www.linkedin.com/showcase/linkedin-member-guide/", description: "Build relationships that can turn into mentorship." },
      { label: "LinkedIn: Guide to Informational Interviews", href: "https://www.linkedin.com/business/learning/blog/career-success-tips/guide-to-informational-interviews", description: "Informational interviews often lead to ongoing mentorship." },
      { label: "LinkedIn Career Checklist", href: "https://www.linkedin.com/blog/member/archive/career-checklist-for-students-support-network", description: "Steps to build your support network, including mentors." },
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
    resources: [
      { label: "LinkedIn for Students", href: "https://students.linkedin.com/en-us", description: "Interview prep, common questions, and resume tips." },
      { label: "LinkedIn Guide to Networking", href: "https://www.linkedin.com/showcase/linkedin-member-guide/", description: "Optimize your LinkedIn profile for recruiters." },
      { label: "NACE Career Resources", href: "https://careers.naceweb.org/jobseekers/resources/", description: "Resume writing, LinkedIn profile development, and coaching." },
      { label: "Handshake Events", href: "https://joinhandshake.com", description: "Find campus workshops and employer events on Handshake." },
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
    resources: [
      { label: "LinkedIn for Students", href: "https://students.linkedin.com/en-us", description: "How to network and follow up after events." },
      { label: "LinkedIn: How to Find Summer Internships", href: "https://www.linkedin.com/top-content/career/internships/how-to-find-summer-internships-on-linkedin/", description: "Use LinkedIn to discover internships and employer events." },
      { label: "Handshake", href: "https://joinhandshake.com", description: "Campus job platform—info sessions, career fairs, and employer events." },
      { label: "LinkedIn Guide to Networking", href: "https://www.linkedin.com/showcase/linkedin-member-guide/", description: "Connect with recruiters you meet at events." },
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

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-zinc-900">Resources & inspiration</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Trusted links to help you take action—LinkedIn, career associations, and more.
        </p>
        <ul className="mt-4 space-y-3">
          {connection.resources.map((r) => (
            <li key={r.href}>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-0.5 rounded-lg border border-zinc-200 p-3 text-left transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              >
                <span className="text-sm font-medium text-zinc-900 group-hover:text-zinc-700">
                  {r.label}
                  <span className="ml-1.5 inline-block text-zinc-400" aria-hidden>
                    ↗
                  </span>
                </span>
                {r.description && (
                  <span className="text-xs text-zinc-600">{r.description}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
