"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

const FAQS = [
  {
    q: "How does the AI itinerary generator actually work?",
    a: "You give it a destination, trip length, budget, and interests. It reasons through pacing, travel time, and budget allocation, then returns a structured day-by-day plan. You can regenerate for a different take on the same inputs at any time.",
  },
  {
    q: "Is the recommendation engine based on real behavior?",
    a: "Yes. It reads your saved experiences, past reviews, and stated interests/budget level, then re-ranks Voyager's live catalog against that profile - it changes as you save and review more trips.",
  },
  {
    q: "What can the Voyager Concierge chat actually do?",
    a: "It's connected to Voyager's real listing data through tool calls, so it can search experiences by category/price/location and pull up full details rather than guessing. It also remembers the conversation within a session.",
  },
  {
    q: "Do I need an account to browse experiences?",
    a: "No - browsing, searching, and viewing experience details are all public. You'll need an account to save experiences, book, leave reviews, or use the AI itinerary and recommendation tools.",
  },
  {
    q: "How do I list my own experience as a host?",
    a: "Create an account, then go to Add Experience from your account menu. You'll need a title, descriptions, pricing, location, and at least one image URL. You can edit or remove listings anytime from Manage Listings.",
  },
  {
    q: "Is there a demo account I can try?",
    a: "Yes - use the \"Try the demo account\" button on the login page to sign in instantly with a pre-populated traveler profile, saved experiences, and review history.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-ink-50 py-16 dark:bg-ink-900/40">
      <div className="container-page max-w-3xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            FAQ
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
            Common questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="card overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-ink-900 dark:text-ink-50">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={clsx(
                      "shrink-0 text-ink-400 transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
