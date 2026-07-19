"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { EXPERIENCE_CATEGORIES } from "@/lib/types";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/explore${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="relative flex min-h-[62vh] items-center overflow-hidden lg:h-[68vh] lg:min-h-0">
      <Image
        src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=80"
        alt="Lantern-lit street in Kyoto at dusk"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/55 to-ink-950/30" />

      <div className="container-page relative z-10 py-16">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur">
          <Sparkles size={13} className="text-accent-400" />
          Planned with an agentic AI concierge
        </div>

        <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
          Travel experiences, planned by AI that actually knows the catalog.
        </h1>
        <p className="mt-5 max-w-xl text-base text-ink-100 sm:text-lg">
          Voyager pairs curated trips from local hosts with an AI planner that reasons through
          logistics, remembers your preferences, and recommends what fits you best.
        </p>

        <form
          onSubmit={submit}
          className="mt-8 flex w-full max-w-xl flex-col gap-2 rounded-2xl bg-white/95 p-2 shadow-xl backdrop-blur sm:flex-row dark:bg-ink-900/95"
        >
          <div className="flex flex-1 items-center gap-2 px-3 py-2">
            <Search size={18} className="text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a destination, e.g. 'Kyoto' or 'safari'"
              className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:text-ink-50"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Explore trips <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          {EXPERIENCE_CATEGORIES.slice(0, 5).map((cat) => (
            <a
              key={cat}
              href={`/explore?category=${encodeURIComponent(cat)}`}
              className="rounded-full border border-white/25 px-3.5 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
            >
              {cat}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
