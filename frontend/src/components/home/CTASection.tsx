import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="container-page pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-6 py-14 text-center sm:px-16">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-500/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent-500/30 blur-3xl" />
        <div className="relative">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Ready to plan a trip that actually fits you?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-brand-50">
            Create a free account, tell the AI what you like, and get a personalized itinerary in
            under a minute.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
            >
              Create free account <ArrowRight size={15} />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Browse experiences
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
