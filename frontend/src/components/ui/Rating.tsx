import { Star } from "lucide-react";
import clsx from "clsx";

export function Rating({
  value,
  count,
  size = 14,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={clsx("inline-flex items-center gap-1 text-sm", className)}>
      <Star size={size} className="fill-accent-500 text-accent-500" />
      <span className="font-medium text-ink-800 dark:text-ink-100">
        {value > 0 ? value.toFixed(1) : "New"}
      </span>
      {typeof count === "number" && (
        <span className="text-ink-400">({count})</span>
      )}
    </span>
  );
}
