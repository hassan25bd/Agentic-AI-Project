import clsx from "clsx";

export function Badge({
  children,
  tone = "brand",
  className,
}: {
  children: React.ReactNode;
  tone?: "brand" | "accent" | "neutral";
  className?: string;
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
    accent: "bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-200",
    neutral: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
