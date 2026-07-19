import Image from "next/image";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Grace Lin",
    trip: "Kyoto Temple & Geisha District Walk",
    quote:
      "I asked the AI planner for a slow, food-focused 4 days and it actually respected the pacing - no 6-activities-a-day nonsense. Booked the Kyoto walk it recommended and it was the highlight of the trip.",
    seed: "Grace Lin",
  },
  {
    name: "Tom Becker",
    trip: "Wadi Rum & Petra Desert Expedition",
    quote:
      "The recommendation engine picked up on two desert trips I'd saved and started surfacing hosts I wouldn't have found searching myself. The Wadi Rum camp specifically was worth every dollar.",
    seed: "Tom Becker",
  },
  {
    name: "Sofia Alvarez",
    trip: "Machu Picchu Trek via the Sacred Valley",
    quote:
      "Chatted with the concierge at 1am with logistics questions and it pulled real pricing and availability instead of giving generic advice. Felt less like a chatbot, more like a travel agent who'd actually read the listings.",
    seed: "Sofia Alvarez",
  },
];

export function TestimonialsSection() {
  return (
    <section className="container-page py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
          Traveler stories
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
          What travelers say about planning with Voyager
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className="card flex flex-col gap-4 p-6">
            <Quote className="text-brand-300 dark:text-brand-700" size={26} />
            <blockquote className="flex-1 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
              {t.quote}
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-ink-100 pt-4 dark:border-ink-800">
              <Image
                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(t.seed)}`}
                alt={t.name}
                width={36}
                height={36}
                unoptimized
                className="rounded-full bg-ink-100"
              />
              <div>
                <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">{t.name}</p>
                <p className="text-xs text-ink-500">Booked: {t.trip}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
