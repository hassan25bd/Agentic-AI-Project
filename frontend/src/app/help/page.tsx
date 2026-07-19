"use client";

import { useState } from "react";
import { ChevronDown, LifeBuoy, Wand2, Sparkles, MessageCircle, User, ListChecks } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";

const TOPICS = [
  {
    icon: Wand2,
    title: "AI Itinerary Generator",
    items: [
      {
        q: "What inputs does it use?",
        a: "Destination, trip length (1-14 days), total budget, your selected interests, and a pace (relaxed / balanced / packed). It reasons through pacing and budget allocation before returning a day-by-day plan.",
      },
      {
        q: "Can I get a different plan for the same inputs?",
        a: "Yes - use Regenerate on a result to get a fresh take on the same destination, days, budget, and interests.",
      },
      {
        q: "Where can I see my past itineraries?",
        a: "They're listed at the bottom of the AI Itinerary page, and can be reopened by clicking them.",
      },
    ],
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    items: [
      {
        q: "What does the recommendation engine base its picks on?",
        a: "Your stated interests and budget level, the experiences you've saved, and the reviews you've written. It re-ranks Voyager's live catalog against that profile every time you refresh.",
      },
      {
        q: "Can I narrow the results?",
        a: "Yes - use the category, max price, and location filters above the results to refine what the AI considers.",
      },
    ],
  },
  {
    icon: MessageCircle,
    title: "Voyager Concierge (chat)",
    items: [
      {
        q: "Is the chat connected to real listings?",
        a: "Yes - it calls search and detail-lookup tools against the live database, so prices, ratings, and availability it mentions come from actual listings rather than generated guesses.",
      },
      {
        q: "Does it remember earlier messages?",
        a: "Within a session, yes. Conversation history is stored per session and used as context for follow-up questions.",
      },
    ],
  },
  {
    icon: User,
    title: "Account & hosting",
    items: [
      {
        q: "How do I list an experience?",
        a: "Create an account, then go to Add Experience (available in your account menu once logged in). You'll need a title, descriptions, category, location, price, duration, and at least one image URL.",
      },
      {
        q: "How do I remove a listing?",
        a: "Go to Manage Listings, find the experience, and use the Delete action.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="container-page py-14">
      <div className="mb-10 max-w-2xl">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
          <LifeBuoy size={18} />
          <p className="text-sm font-semibold uppercase tracking-wide">Help & Support</p>
        </div>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
          How can we help?
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Answers about the AI features and how the platform works. Can&apos;t find it here?{" "}
          <Link href="/contact" className="font-medium text-brand-700 hover:underline dark:text-brand-300">
            Contact us
          </Link>
          .
        </p>
      </div>

      <div className="space-y-10">
        {TOPICS.map((topic) => (
          <div key={topic.title}>
            <div className="mb-4 flex items-center gap-2">
              <topic.icon size={17} className="text-brand-600 dark:text-brand-400" />
              <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
                {topic.title}
              </h2>
            </div>
            <div className="space-y-2.5">
              {topic.items.map((item) => (
                <HelpItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-12 flex flex-col items-center gap-2 p-8 text-center">
        <ListChecks className="text-brand-600" size={24} />
        <p className="font-medium text-ink-800 dark:text-ink-100">Still stuck?</p>
        <p className="text-sm text-ink-500">Send us a message and we&apos;ll follow up directly.</p>
        <Link href="/contact" className="mt-2 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300">
          Go to Contact page
        </Link>
      </div>
    </div>
  );
}

function HelpItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-ink-800 dark:text-ink-100">{q}</span>
        <ChevronDown size={16} className={clsx("shrink-0 text-ink-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && <p className="px-4 pb-3.5 text-sm text-ink-500">{a}</p>}
    </div>
  );
}
