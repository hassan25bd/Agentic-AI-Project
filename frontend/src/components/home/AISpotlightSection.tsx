import Link from "next/link";
import { Wand2, MapPin, Sparkles, ArrowRight } from "lucide-react";

export function AISpotlightSection() {
  return (
    <section className="bg-ink-950 py-20 text-white">
      <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium">
            <Sparkles size={13} className="text-accent-400" /> Agentic AI, not a chatbot wrapper
          </div>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            The AI plans, searches, and reasons - it doesn&apos;t just autocomplete.
          </h2>
          <p className="mt-4 max-w-lg text-ink-300">
            Voyager&apos;s concierge calls real tools against the live catalog before it answers,
            the itinerary generator reasons through day-by-day logistics and budget, and the
            recommendation engine adapts to what you save and review. Nothing is hard-coded copy.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/ai/itinerary"
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-3 text-sm font-semibold text-white hover:bg-accent-600"
            >
              Plan a trip with AI <ArrowRight size={15} />
            </Link>
            <Link
              href="/ai/recommendations"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              See recommendations
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500">
              <Wand2 size={15} />
            </span>
            <p className="text-sm font-semibold">Itinerary Generator</p>
          </div>
          <div className="space-y-3 py-4 text-sm text-ink-200">
            <p className="rounded-2xl bg-white/10 px-3.5 py-2.5">
              4 days in Kyoto, mid-range budget, interested in temples and food.
            </p>
            <div className="space-y-2 rounded-2xl bg-brand-500/15 px-3.5 py-3">
              <p className="flex items-center gap-1.5 font-medium text-white">
                <MapPin size={13} /> Day 1 - Higashiyama & Gion
              </p>
              <p className="text-xs text-ink-300">
                Kiyomizu-dera at sunrise, Sannenzaka lanes, matcha tasting, evening Gion walk.
                Est. $85.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl bg-white/10 px-3.5 py-3">
              <p className="flex items-center gap-1.5 font-medium text-white">
                <MapPin size={13} /> Day 2 - Arashiyama & Food Crawl
              </p>
              <p className="text-xs text-ink-300">
                Bamboo grove, riverside lunch, Nishiki Market tasting crawl. Est. $70.
              </p>
            </div>
          </div>
          <p className="text-xs text-ink-400">Generated live from your inputs - regenerate anytime.</p>
        </div>
      </div>
    </section>
  );
}
