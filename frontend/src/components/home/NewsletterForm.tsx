"use client";

import { useState, FormEvent } from "react";
import { Send } from "lucide-react";
import clsx from "clsx";
import { apiFetch, ApiClientError } from "@/lib/api";

export function NewsletterForm({ variant = "section" }: { variant?: "section" | "footer" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await apiFetch("/subscribers", { method: "POST", body: { email }, auth: false });
      setStatus("success");
      setMessage("You're on the list - we'll send trip ideas, not spam.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof ApiClientError ? err.message : "Something went wrong.");
    }
  };

  const isFooter = variant === "footer";

  return (
    <form onSubmit={submit} className="w-full">
      <label
        htmlFor="newsletter-email"
        className={clsx("mb-2 block text-sm font-semibold", isFooter ? "text-white" : "text-ink-900 dark:text-ink-50")}
      >
        Get new experiences in your inbox
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={clsx(
            "w-full flex-1 rounded-full border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500",
            isFooter
              ? "border-ink-700 bg-ink-900 text-white placeholder:text-ink-500"
              : "border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
          )}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
        >
          <Send size={15} />
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {message && (
        <p className={clsx("mt-2 text-xs", status === "error" ? "text-red-400" : "text-brand-400")}>
          {message}
        </p>
      )}
    </form>
  );
}
