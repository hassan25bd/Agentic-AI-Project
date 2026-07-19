import { NewsletterForm } from "./NewsletterForm";
import { Mail } from "lucide-react";

export function NewsletterSection() {
  return (
    <section className="container-page py-16">
      <div className="card flex flex-col items-center gap-5 p-8 text-center sm:p-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
          <Mail size={22} />
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50 sm:text-3xl">
          New experiences, sent monthly
        </h2>
        <p className="max-w-md text-sm text-ink-500 dark:text-ink-400">
          No spam - just newly listed experiences and the occasional AI travel-planning tip.
        </p>
        <div className="w-full max-w-sm">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
