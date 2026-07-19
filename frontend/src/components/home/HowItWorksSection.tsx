import { MessageSquareText, Wand2, Compass, PlaneTakeoff } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquareText,
    title: "Tell the concierge your style",
    body: "Set your interests, budget level, and travel style once. Voyager's AI uses it for every recommendation and itinerary from then on.",
  },
  {
    icon: Wand2,
    title: "Let the AI plan the logistics",
    body: "Give the itinerary generator a destination, days, and budget - it reasons through pacing and cost, then hands back a real day-by-day plan.",
  },
  {
    icon: Compass,
    title: "Browse AI-matched experiences",
    body: "The recommendation engine ranks Voyager's catalog against your saved trips and reviews, and re-ranks live as you refine filters.",
  },
  {
    icon: PlaneTakeoff,
    title: "Book with a local host",
    body: "Every experience is run by a real host, not a faceless agency. Read reviews, check what's included, and book with confidence.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-ink-50 py-16 dark:bg-ink-900/40">
      <div className="container-page">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            How it works
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
            From a vague idea to a bookable itinerary
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                {i + 1}
              </div>
              <step.icon className="mt-4 text-brand-600 dark:text-brand-400" size={22} />
              <h3 className="mt-3 font-display text-base font-semibold text-ink-900 dark:text-ink-50">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
