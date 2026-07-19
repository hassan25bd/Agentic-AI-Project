"use client";

import { Suspense, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { useExperiences, ExploreFilters } from "@/lib/hooks/useExperiences";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { ExperienceCardSkeleton } from "@/components/ui/Skeleton";
import { FilterBar } from "@/components/experiences/FilterBar";
import { Pagination } from "@/components/experiences/Pagination";

function ExplorePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: ExploreFilters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      category: searchParams.get("category") ?? "",
      location: searchParams.get("location") ?? "",
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
      minRating: searchParams.get("minRating") ?? "",
      sort: searchParams.get("sort") ?? "newest",
      page: Number(searchParams.get("page") ?? 1),
      limit: 12,
    }),
    [searchParams]
  );

  const updateFilters = useCallback(
    (patch: Partial<ExploreFilters>) => {
      const next = { ...filters, ...patch };
      const params = new URLSearchParams();
      Object.entries(next).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && !(key === "page" && value === 1) && key !== "limit") {
          params.set(key, String(value));
        }
      });
      router.push(`/explore${params.toString() ? `?${params}` : ""}`);
    },
    [filters, router]
  );

  const { data, isLoading, isFetching } = useExperiences(filters);

  return (
    <div className="container-page py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
          Explore
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
          Find your next experience
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {isLoading ? "Loading..." : `${data?.total ?? 0} experiences match your search`}
        </p>
      </div>

      <FilterBar filters={filters} onChange={updateFilters} />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <ExperienceCardSkeleton key={i} />)
          : data?.items.map((exp) => <ExperienceCard key={exp._id} experience={exp} />)}
      </div>

      {!isLoading && data?.items.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <SearchX size={36} className="text-ink-300" />
          <p className="font-medium text-ink-700 dark:text-ink-200">No experiences match those filters</p>
          <p className="max-w-sm text-sm text-ink-500">
            Try widening your price range, clearing a filter, or searching a different destination.
          </p>
        </div>
      )}

      {data && (
        <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
          <Pagination page={data.page} pages={data.pages} onChange={(page) => updateFilters({ page })} />
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExplorePageInner />
    </Suspense>
  );
}
