"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

export function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}) {
  if (pages <= 1) return null;

  const nums = getPageNumbers(page, pages);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 text-ink-600 disabled:opacity-40 dark:border-ink-700 dark:text-ink-300"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {nums.map((n, i) =>
        n === "..." ? (
          <span key={`dots-${i}`} className="px-1.5 text-ink-400">
            ...
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n as number)}
            className={clsx(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium",
              n === page
                ? "bg-brand-600 text-white"
                : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-900"
            )}
          >
            {n}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === pages}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 text-ink-600 disabled:opacity-40 dark:border-ink-700 dark:text-ink-300"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

function getPageNumbers(page: number, pages: number): (number | "...")[] {
  const delta = 1;
  const range: (number | "...")[] = [];
  const rangeStart = Math.max(2, page - delta);
  const rangeEnd = Math.min(pages - 1, page + delta);

  range.push(1);
  if (rangeStart > 2) range.push("...");
  for (let i = rangeStart; i <= rangeEnd; i++) range.push(i);
  if (rangeEnd < pages - 1) range.push("...");
  if (pages > 1) range.push(pages);

  return range;
}
