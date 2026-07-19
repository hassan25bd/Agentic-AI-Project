"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Globe2, Star, Compass, Sparkles } from "lucide-react";
import { useExperiences } from "@/lib/hooks/useExperiences";
import { Skeleton } from "@/components/ui/Skeleton";

const BAR_COLOR = "#108a72";

export function StatsSection() {
  const { data, isLoading } = useExperiences({ limit: 24, sort: "newest" });

  const stats = useMemo(() => {
    if (!data) return null;
    const countries = new Set(data.items.map((e) => e.location.country));
    const avgRating =
      data.items.reduce((sum, e) => sum + e.rating, 0) / (data.items.length || 1);
    const byCategory = new Map<string, number>();
    data.items.forEach((e) => {
      byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + 1);
    });
    return {
      total: data.total,
      countries: countries.size,
      avgRating,
      chart: Array.from(byCategory.entries()).map(([category, count]) => ({
        category: category.replace(" & ", " &\n"),
        count,
      })),
    };
  }, [data]);

  return (
    <section className="container-page py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
          Voyager by the numbers
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
          A growing catalog of vetted, local-hosted experiences
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          <StatTile icon={<Compass size={18} />} label="Experiences listed" value={stats?.total} loading={isLoading} />
          <StatTile icon={<Globe2 size={18} />} label="Countries covered" value={stats?.countries} loading={isLoading} />
          <StatTile
            icon={<Star size={18} />}
            label="Average rating"
            value={stats ? stats.avgRating.toFixed(1) : undefined}
            loading={isLoading}
          />
          <StatTile icon={<Sparkles size={18} />} label="AI-planned itineraries" value="Unlimited" loading={false} />
        </div>

        <div className="card p-5">
          <p className="mb-4 text-sm font-medium text-ink-600 dark:text-ink-300">
            Experiences by category
          </p>
          {isLoading || !stats ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.chart} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-ink-100)" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 11, fill: "var(--color-ink-500)" }}
                  axisLine={{ stroke: "var(--color-ink-200)" }}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "var(--color-ink-500)" }}
                  axisLine={false}
                  tickLine={false}
                  width={24}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-ink-50)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-ink-100)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" name="Experiences" fill={BAR_COLOR} radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}

function StatTile({
  icon,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
  loading: boolean;
}) {
  return (
    <div className="card p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
        {icon}
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-7 w-16" />
      ) : (
        <p className="mt-3 font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">{value}</p>
      )}
      <p className="mt-1 text-xs text-ink-500">{label}</p>
    </div>
  );
}
