import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton rounded-xl", className)} />;
}

export function ExperienceCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}
