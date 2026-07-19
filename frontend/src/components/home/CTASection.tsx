import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="container-page pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 py-14 text-center sm:px-16">
        <div className="cloud-scene">
          <div className="cloud-blob cloud-blob-a -top-16 -left-10 h-72 w-96 bg-white/25" />
          <div className="cloud-blob cloud-blob-b top-1/3 -right-20 h-80 w-80 bg-accent-400/35" />
          <div className="cloud-blob cloud-blob-c -bottom-24 left-1/4 h-72 w-[28rem] bg-brand-300/30" />
          <div className="cloud-blob cloud-blob-b top-0 right-1/3 h-56 w-56 bg-white/15" />
        </div>
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
