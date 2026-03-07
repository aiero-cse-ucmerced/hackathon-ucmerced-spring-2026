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

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div
            key={item.question}
            className="rounded-lg border border-zinc-200 bg-white shadow-sm"
          >
            <button
              id={buttonId}
              type="button"
              className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() =>
                setOpenIndex((current) =>
                  current === index ? null : index,
                )
              }
            >
              <span className="text-sm font-medium text-zinc-900 md:text-base">
                {item.question}
              </span>
              <span
                aria-hidden
                className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 text-xs text-zinc-600"
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`px-4 pb-3 text-sm leading-relaxed text-zinc-600 md:text-base ${
                isOpen ? "block" : "hidden"
              }`}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}

