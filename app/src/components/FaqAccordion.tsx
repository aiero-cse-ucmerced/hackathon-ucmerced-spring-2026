"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is UncookedAura?",
    answer:
      "UncookedAura is a job search experience that focuses on your profile and potential, not just your past job titles.",
  },
  {
    question: "How does job matching work?",
    answer:
      "We look at your skills, interests, and goals so you see roles that fit you, even if the title doesn’t exactly match your resume.",
  },
  {
    question: "Is UncookedAura free to use?",
    answer:
      "Yes. Creating a profile and using the core job search is free. We may add optional premium features later.",
  },
  {
    question: "Which jobs or companies are included?",
    answer:
      "We aggregate roles from multiple sources, with coverage that varies by region, company, and field.",
  },
  {
    question: "How do I get started?",
    answer:
      "Sign up, complete a short profile about your background and preferences, then browse and save the matches that stand out.",
  },
];

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronUp({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-zinc-200">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div key={item.question}>
            <button
              id={buttonId}
              type="button"
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() =>
                setOpenIndex((current) =>
                  current === index ? null : index,
                )
              }
            >
              <span className="text-sm font-semibold text-zinc-900 md:text-base">
                {item.question}
              </span>
              <span className="shrink-0 text-zinc-500">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`overflow-hidden text-sm leading-relaxed text-zinc-500 md:text-base ${
                isOpen ? "block" : "hidden"
              }`}
            >
              <p className="pb-4 pl-0 pr-8">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

