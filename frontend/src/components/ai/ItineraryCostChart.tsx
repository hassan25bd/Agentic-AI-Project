"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ItineraryDay } from "@/lib/types";

const BAR_COLOR = "#108a72";

export function ItineraryCostChart({ plan }: { plan: ItineraryDay[] }) {
  const data = plan.map((d) => ({ day: `Day ${d.day}`, cost: d.estimatedCost }));

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-ink-600 dark:text-ink-300">
        Estimated cost per day
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-ink-100)" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "var(--color-ink-500)" }}
            axisLine={{ stroke: "var(--color-ink-200)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--color-ink-500)" }}
            axisLine={false}
            tickLine={false}
            width={36}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            cursor={{ fill: "var(--color-ink-50)" }}
            formatter={(value) => [`$${value}`, "Estimated cost"]}
            contentStyle={{ borderRadius: 12, border: "1px solid var(--color-ink-100)", fontSize: 12 }}
          />
          <Bar dataKey="cost" name="Estimated cost" fill={BAR_COLOR} radius={[4, 4, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
