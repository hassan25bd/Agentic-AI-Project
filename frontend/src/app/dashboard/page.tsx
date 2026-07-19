"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Settings, Wand2, Sparkles, MapPin } from "lucide-react";
import clsx from "clsx";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { EXPERIENCE_CATEGORIES, Experience, BudgetLevel } from "@/lib/types";
import { ExperienceCard } from "@/components/experiences/ExperienceCard";
import { ExperienceCardSkeleton } from "@/components/ui/Skeleton";
import { Button, LinkButton } from "@/components/ui/Button";

const BUDGET_LEVELS: BudgetLevel[] = ["budget", "mid-range", "luxury"];

function Dashboard() {
  const { user, updateLocalUser } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["saved-experiences"],
    queryFn: () => apiFetch<{ items: Experience[] }>("/users/me/saved"),
  });

  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>(user?.budgetLevel ?? "mid-range");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleInterest = (cat: string) => {
    setInterests((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
    setSaved(false);
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const { user: updated } = await apiFetch<{ user: typeof user }>("/users/me", {
        method: "PATCH",
        body: { interests, budgetLevel },
      });
      if (updated) updateLocalUser(updated);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">
        My trips
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Saved experiences and the preferences that power your AI recommendations.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Heart size={16} className="text-accent-500" />
            <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
              Saved experiences
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <ExperienceCardSkeleton key={i} />
              ))}
            </div>
          ) : data?.items.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 p-10 text-center">
              <MapPin className="text-ink-300" size={26} />
              <p className="text-sm text-ink-500">
                Nothing saved yet - tap the heart on any experience to keep it here.
              </p>
              <LinkButton href="/explore" size="sm">
                Explore experiences
              </LinkButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {data?.items.map((exp) => (
                <ExperienceCard key={exp._id} experience={exp} />
              ))}
            </div>
          )}

          <div className="mt-10 rounded-3xl bg-ink-950 p-6 text-white">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-accent-400" />
              <p className="font-display text-lg font-semibold">Ready for your next trip?</p>
            </div>
            <p className="mt-1.5 text-sm text-ink-300">
              Generate a fresh itinerary or refresh your personalized recommendations.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <LinkButton href="/ai/itinerary" variant="accent" size="sm">
                <Wand2 size={13} /> Plan a trip
              </LinkButton>
              <LinkButton href="/ai/recommendations" variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                See recommendations
              </LinkButton>
            </div>
          </div>
        </section>

        <aside className="h-fit">
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Settings size={15} className="text-ink-500" />
              <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">
                Preferences that guide the AI
              </p>
            </div>

            <p className="mb-2 text-xs font-medium text-ink-500">Interests</p>
            <div className="flex flex-wrap gap-1.5">
              {EXPERIENCE_CATEGORIES.map((cat) => (
                <button
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

            <p className="mb-2 mt-4 text-xs font-medium text-ink-500">Budget level</p>
            <div className="flex gap-2">
              {BUDGET_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setBudgetLevel(level);
                    setSaved(false);
                  }}
                  className={clsx(
                    "flex-1 rounded-xl border px-2 py-2 text-xs font-medium capitalize",
                    budgetLevel === level
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30"
                      : "border-ink-200 text-ink-600 dark:border-ink-700 dark:text-ink-300"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>

            <Button onClick={savePreferences} disabled={saving} className="mt-5 w-full" size="sm">
              {saving ? "Saving..." : saved ? "Saved" : "Save preferences"}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}
