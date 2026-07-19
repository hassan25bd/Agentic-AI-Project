"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import clsx from "clsx";
import { EXPERIENCE_CATEGORIES } from "@/lib/types";
import { ExploreFilters } from "@/lib/hooks/useExperiences";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "rating_desc", label: "Highest rated" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "duration_asc", label: "Shortest trips first" },
];

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:border-ink-700";

export function FilterBar({
  filters,
  onChange,
}: {
  filters: ExploreFilters;
  onChange: (patch: Partial<ExploreFilters>) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search ?? "");

  const activeCount = [filters.category, filters.location, filters.minPrice, filters.maxPrice, filters.minRating].filter(
    Boolean
  ).length;

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <form
          className="flex flex-1 items-center gap-2 rounded-xl border border-ink-200 px-3 py-2 dark:border-ink-700"
          onSubmit={(e) => {
            e.preventDefault();
            onChange({ search: searchInput, page: 1 });
          }}
        >
          <Search size={16} className="text-ink-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search experiences, destinations, tags..."
            className="w-full bg-transparent text-sm outline-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onChange({ search: "", page: 1 });
              }}
              aria-label="Clear search"
            >
              <X size={15} className="text-ink-400" />
            </button>
          )}
        </form>

        <select
          value={filters.sort ?? "newest"}
          onChange={(e) => onChange({ sort: e.target.value, page: 1 })}
          className={clsx(inputClass, "sm:w-52")}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort: {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={clsx(
            "flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium sm:w-auto",
            showFilters
              ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30"
              : "border-ink-200 text-ink-700 dark:border-ink-700 dark:text-ink-200"
          )}
        >
          <SlidersHorizontal size={15} />
          Filters {activeCount > 0 && `(${activeCount})`}
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-ink-100 pt-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-ink-800">
          <Field label="Category">
            <select
              value={filters.category ?? ""}
              onChange={(e) => onChange({ category: e.target.value, page: 1 })}
              className={inputClass}
            >
              <option value="">All categories</option>
              {EXPERIENCE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Location">
            <input
              value={filters.location ?? ""}
              onChange={(e) => onChange({ location: e.target.value, page: 1 })}
              placeholder="City or country"
              className={inputClass}
            />
          </Field>

          <Field label="Min price (USD)">
            <input
              type="number"
              min={0}
              value={filters.minPrice ?? ""}
              onChange={(e) => onChange({ minPrice: e.target.value, page: 1 })}
              placeholder="0"
              className={inputClass}
            />
          </Field>

          <Field label="Max price (USD)">
            <input
              type="number"
              min={0}
              value={filters.maxPrice ?? ""}
              onChange={(e) => onChange({ maxPrice: e.target.value, page: 1 })}
              placeholder="Any"
              className={inputClass}
            />
          </Field>

          <Field label="Minimum rating">
            <select
              value={filters.minRating ?? ""}
              onChange={(e) => onChange({ minRating: e.target.value, page: 1 })}
              className={inputClass}
            >
              <option value="">Any rating</option>
              {[4.5, 4, 3.5, 3].map((r) => (
                <option key={r} value={r}>
                  {r}+ stars
                </option>
              ))}
            </select>
          </Field>

          {activeCount > 0 && (
            <div className="flex items-end">
              <button
                onClick={() =>
                  onChange({ category: "", location: "", minPrice: "", maxPrice: "", minRating: "", page: 1 })
                }
                className="text-sm font-medium text-accent-600 hover:text-accent-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-500">{label}</span>
      {children}
    </label>
  );
}
