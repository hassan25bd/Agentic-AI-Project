import Link from "next/link";
import { Mountain, Landmark, UtensilsCrossed, Trees, Waves, Building2 } from "lucide-react";
import { ExperienceCategory } from "@/lib/types";

const CATEGORIES: { name: ExperienceCategory; icon: React.ElementType; blurb: string }[] = [
  { name: "Adventure", icon: Mountain, blurb: "Treks, deserts, and alpine routes" },
  { name: "Culture", icon: Landmark, blurb: "Temples, heritage walks, history" },
  { name: "Food & Drink", icon: UtensilsCrossed, blurb: "Cooking classes, tastings, markets" },
  { name: "Nature", icon: Trees, blurb: "Safaris, lakes, highland hikes" },
  { name: "Relaxation", icon: Waves, blurb: "Coastlines, islands, slow travel" },
  { name: "City Life", icon: Building2, blurb: "Old towns, trams, night markets" },
];

export function CategoriesSection() {
  return (
    <section className="container-page py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
          Browse by interest
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
          Six categories, one consistent standard
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            href={`/explore?category=${encodeURIComponent(cat.name)}`}
            className="card group flex flex-col items-start gap-3 p-4 transition-shadow hover:shadow-lg"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-900/40 dark:text-brand-300">
              <cat.icon size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">{cat.name}</p>
              <p className="mt-0.5 text-xs text-ink-500">{cat.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
