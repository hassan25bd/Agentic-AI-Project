import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Users, Compass } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

const VALUES = [
  {
    icon: Sparkles,
    title: "AI that reasons, not autocompletes",
    body: "Every AI feature - itinerary planning, recommendations, the concierge chat - is grounded in tool calls against real listing data, not free-floating text generation.",
  },
  {
    icon: Users,
    title: "Local hosts, not a faceless catalog",
    body: "Every experience on Voyager is run by a named host you can see reviews for. We don't resell inventory from third-party wholesalers.",
  },
  {
    icon: ShieldCheck,
    title: "Straightforward about data",
    body: "We collect what's needed to run the product - your account, saved trips, chat history for context - and nothing beyond that. See our Privacy Policy for specifics.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative flex min-h-[42vh] items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=1920&q=80"
          alt="Coastal village at sunset"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink-950/70" />
        <div className="container-page relative z-10 py-16 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-300">About Voyager</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold sm:text-5xl">
            We built the travel planner we wished existed.
          </h1>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
              Why Voyager exists
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              Most trip planning tools are either a static listings site with no intelligence, or an
              AI chatbot with no real inventory behind it - it makes up prices and availability that
              don&apos;t exist. Voyager pairs the two: a curated catalog of experiences from real
              local hosts, and an agentic AI layer that actually queries that catalog before it
              answers you.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              The itinerary generator reasons through pacing and budget instead of returning generic
              &quot;Day 1: explore the city&quot; filler. The recommendation engine reads your saved
              trips and reviews, not just a form you filled out once. The concierge chat calls tools
              against live listings, so it can tell you what&apos;s actually included and how much it
              actually costs.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-5">
                <v.icon className="text-brand-600 dark:text-brand-400" size={22} />
                <h3 className="mt-3 font-display text-base font-semibold text-ink-900 dark:text-ink-50">
                  {v.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink-500">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-50 py-16 dark:bg-ink-900/40">
        <div className="container-page flex flex-col items-center gap-4 text-center">
          <Compass className="text-brand-600" size={28} />
          <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50 sm:text-3xl">
            Curious how it works under the hood?
          </h2>
          <p className="max-w-lg text-sm text-ink-500">
            Read our FAQ for a breakdown of the AI features, or reach out directly if you have
            questions about hosting or a specific trip.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <LinkButton href="/help">Visit Help Center</LinkButton>
            <LinkButton href="/contact" variant="outline">
              Contact us
            </LinkButton>
          </div>
        </div>
      </section>

      <section className="container-page py-16 text-center">
        <p className="text-sm text-ink-500">
          Built as a full-stack agentic AI project.{" "}
          <Link href="/explore" className="font-medium text-brand-700 hover:underline dark:text-brand-300">
            Browse experiences
          </Link>{" "}
          to see it in action.
        </p>
      </section>
    </div>
  );
}
