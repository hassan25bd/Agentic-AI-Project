import Image from "next/image";
import { Star } from "lucide-react";
import { Review } from "@/lib/types";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-ink-500">
        No reviews yet - be the first to share how this experience went.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="card p-4">
          <div className="flex items-start gap-3">
            <Image
              src={review.user.avatarUrl}
              alt={review.user.name}
              width={36}
              height={36}
              unoptimized
              className="rounded-full bg-ink-100"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">{review.user.name}</p>
                <span className="text-xs text-ink-400">
                  {new Date(review.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="mt-1 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < review.rating ? "fill-accent-500 text-accent-500" : "text-ink-200"}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
