"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, RefreshCw, Info } from "lucide-react";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { apiFetch } from "@/lib/api";
import { EXPERIENCE_CATEGORIES, Recommendation } from "@/lib/types";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { ExperienceCardSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:border-ink-700";

function Recommendations() {
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["recommendations", category, maxPrice, location],
    queryFn: () => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (location) params.set("location", location);
      return apiFetch<{ recommendations: Recommendation[] }>(
        `/ai/recommendations${params.toString() ? `?${params}` : ""}`
      );
    },
  });

  return (
    <div className="container-page py-10">
      <div className="mb-8 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          <Sparkles size={13} /> AI Recommendation Engine
        </div>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
          Picked for you
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Ranked against your interests, budget level, saved trips, and past reviews - refine below and
          the AI re-ranks Voyager&apos;s live catalog.
        </p>
      </div>

      <div className="card mb-8 flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium text-ink-500">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            <option value="">Any category</option>
            {EXPERIENCE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium text-ink-500">Max price (USD)</label>
          <input type="number" min={0} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={inputClass} placeholder="Any" />
        </div>
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-medium text-ink-500">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="City or country" />
        </div>
        <Button type="button" variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} /> Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ExperienceCardSkeleton key={i} />
          ))}
        </div>
      ) : data?.recommendations.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-12 text-center">
          <Info className="text-ink-300" size={28} />
          <p className="text-sm text-ink-500">
            No matches for these filters yet. Try widening the price range or clearing the category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.recommendations.map(({ experience, reason }) => (
            <div key={experience._id} className="flex flex-col gap-2">
              <ExperienceCard experience={experience} />
              <p className="rounded-xl bg-brand-50 px-3 py-2 text-xs text-brand-800 dark:bg-brand-900/30 dark:text-brand-200">
                <span className="font-semibold">Why: </span>
                {reason}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <RequireAuth>
      <Recommendations />
    </RequireAuth>
  );
}
