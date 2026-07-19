"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";

export function SaveButton({ experienceId, className }: { experienceId: string; className?: string }) {
  const { user, updateLocalUser } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const saved = user?.savedExperiences.includes(experienceId) ?? false;

  const toggle = async () => {
    if (!user) {
      router.push(`/login?next=/experiences/${experienceId}`);
      return;
    }
    setPending(true);
    try {
      const data = await apiFetch<{ saved: boolean; savedExperiences: string[] }>(
        `/experiences/${experienceId}/save`,
        { method: "POST" }
      );
      updateLocalUser({ savedExperiences: data.savedExperiences });
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60",
        saved
          ? "border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-900/30"
          : "border-ink-200 text-ink-700 hover:border-accent-400 dark:border-ink-700 dark:text-ink-200",
        className
      )}
    >
      <Heart size={16} className={saved ? "fill-accent-500 text-accent-500" : ""} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
