"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiClientError } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export function ReviewForm({
  experienceId,
  alreadyReviewed,
  onSubmitted,
}: {
  experienceId: string;
  alreadyReviewed: boolean;
  onSubmitted: () => void;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="card flex flex-col items-start gap-2 p-4 text-sm">
        <p className="text-ink-600 dark:text-ink-300">Log in to leave a review of this experience.</p>
        <Button size="sm" onClick={() => router.push(`/login?next=/experiences/${experienceId}`)}>
          Log in
        </Button>
      </div>
    );
  }

  if (alreadyReviewed) {
    return (
      <div className="card p-4 text-sm text-ink-500">
        You&apos;ve already reviewed this experience - thanks for the feedback!
      </div>
    );
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 3) {
      setError("Please write a few words about your experience.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiFetch(`/experiences/${experienceId}/reviews`, {
        method: "POST",
        body: { rating, comment: comment.trim() },
      });
      setComment("");
      setRating(5);
      onSubmitted();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-3 p-4">
      <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">Leave a review</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(n)}
            aria-label={`${n} stars`}
          >
            <Star
              size={22}
              className={clsx(
                (hoverRating || rating) >= n ? "fill-accent-500 text-accent-500" : "text-ink-300"
              )}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What stood out about this experience?"
        rows={3}
        className="w-full rounded-xl border border-ink-200 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:border-ink-700"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? "Submitting..." : "Submit review"}
      </Button>
    </form>
  );
}
