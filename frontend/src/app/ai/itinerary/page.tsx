"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Wand2, RefreshCw, MapPin, DollarSign, Sparkles, History } from "lucide-react";
import clsx from "clsx";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button } from "@/components/ui/Button";
import { apiFetch, ApiClientError } from "@/lib/api";
import { EXPERIENCE_CATEGORIES, Itinerary } from "@/lib/types";
import { ItineraryCostChart } from "@/components/ai/ItineraryCostChart";
import { Skeleton } from "@/components/ui/Skeleton";

const PACES = [
  { value: "relaxed", label: "Relaxed" },
  { value: "balanced", label: "Balanced" },
  { value: "packed", label: "Packed" },
] as const;

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:border-ink-700";

function ItineraryGenerator() {
  const queryClient = useQueryClient();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(4);
  const [budget, setBudget] = useState(800);
  const [pace, setPace] = useState<"relaxed" | "balanced" | "packed">("balanced");
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Itinerary | null>(null);

  const { data: history } = useQuery({
    queryKey: ["itineraries"],
    queryFn: () => apiFetch<{ itineraries: Itinerary[] }>("/ai/itinerary"),
  });

  const toggleInterest = (cat: string) => {
    setInterests((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  const generate = async (regenerate = false) => {
    if (!destination.trim()) {
      setError("Enter a destination first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { itinerary } = await apiFetch<{ itinerary: Itinerary }>("/ai/itinerary", {
        method: "POST",
        body: { destination: destination.trim(), days, budget, interests, pace, regenerate },
      });
      setResult(itinerary);
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "The AI planner could not generate an itinerary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10">
      <div className="mb-8 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          <Sparkles size={13} /> AI Itinerary Generator
        </div>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
          Plan a trip in one prompt
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Reasons through pacing, budget, and logistics to build a real day-by-day plan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generate(false);
          }}
          className="card h-fit space-y-4 p-5"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Destination</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2.5 dark:border-ink-700">
              <MapPin size={15} className="text-ink-400" />
              <input
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kyoto, Japan"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-500">Days (1-14)</label>
              <input
                type="number"
                min={1}
                max={14}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-500">Budget (USD)</label>
              <div className="flex items-center gap-1.5 rounded-xl border border-ink-200 px-2.5 py-2.5 dark:border-ink-700">
                <DollarSign size={14} className="text-ink-400" />
                <input
                  type="number"
                  min={50}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Pace</label>
            <div className="flex gap-2">
              {PACES.map((p) => (
                <button
                  type="button"
                  key={p.value}
                  onClick={() => setPace(p.value)}
                  className={clsx(
                    "flex-1 rounded-xl border px-3 py-2 text-xs font-medium",
                    pace === p.value
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30"
                      : "border-ink-200 text-ink-600 dark:border-ink-700 dark:text-ink-300"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Interests</label>
            <div className="flex flex-wrap gap-1.5">
              {EXPERIENCE_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleInterest(cat)}
                  className={clsx(
                    "rounded-full border px-3 py-1.5 text-xs font-medium",
                    interests.includes(cat)
                      ? "border-brand-500 bg-brand-600 text-white"
                      : "border-ink-200 text-ink-600 dark:border-ink-700 dark:text-ink-300"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            <Wand2 size={15} />
            {loading ? "Planning..." : "Generate itinerary"}
          </Button>
        </form>

        <div className="space-y-6">
          {loading && (
            <div className="card space-y-3 p-6">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {!loading && result && (
            <div className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
                    {result.destination} · {result.days} days
                  </h2>
                  <p className="mt-1 text-sm text-ink-500">{result.summary}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => generate(true)} disabled={loading}>
                  <RefreshCw size={13} /> Regenerate
                </Button>
              </div>

              <div className="my-6">
                <ItineraryCostChart plan={result.plan} />
              </div>

              <div className="space-y-4">
                {result.plan.map((day) => (
                  <div key={day.day} className="rounded-2xl border border-ink-100 p-4 dark:border-ink-800">
                    <div className="flex items-center justify-between">
                      <p className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">
                        Day {day.day} · {day.title}
                      </p>
                      <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                        ${day.estimatedCost}
                      </span>
                    </div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-600 dark:text-ink-300">
                      {day.activities.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                    {day.tips && (
                      <p className="mt-2 text-xs text-ink-500">
                        <span className="font-medium">Tip:</span> {day.tips}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="card flex flex-col items-center gap-2 p-12 text-center">
              <Wand2 className="text-ink-300" size={28} />
              <p className="text-sm text-ink-500">Fill in the form to generate your first AI itinerary.</p>
            </div>
          )}

          {history && history.itineraries.length > 0 && (
            <div>
              <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink-700 dark:text-ink-200">
                <History size={14} /> Past itineraries
              </p>
              <div className="flex flex-wrap gap-2">
                {history.itineraries.map((it) => (
                  <button
                    key={it._id}
                    onClick={() => setResult(it)}
                    className="rounded-full border border-ink-200 px-3.5 py-1.5 text-xs font-medium text-ink-600 hover:border-brand-400 hover:text-brand-700 dark:border-ink-700 dark:text-ink-300"
                  >
                    {it.destination} · {it.days}d
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  return (
    <RequireAuth>
      <ItineraryGenerator />
    </RequireAuth>
  );
}
