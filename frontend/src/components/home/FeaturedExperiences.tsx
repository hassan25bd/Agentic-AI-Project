"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useFeaturedExperiences } from "@/lib/hooks/useExperiences";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { ExperienceCardSkeleton } from "@/components/ui/Skeleton";

export function FeaturedExperiences() {
  const { data, isLoading } = useFeaturedExperiences();

  return (
    <section className="container-page py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            Top rated
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
            Featured experiences
          </h2>
        </div>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300"
        >
          View all experiences <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ExperienceCardSkeleton key={i} />)
          : data?.items
              .slice(0, 4)
              .map((exp) => <ExperienceCard key={exp._id} experience={exp} />)}
      </div>
    </section>
  );
}
