import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-3xl py-14">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
          <ShieldCheck size={18} />
          <p className="text-sm font-semibold uppercase tracking-wide">Privacy & Terms</p>
        </div>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-ink-500">Last updated July 2026</p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            What we collect
          </h2>
          <p>
            When you create an account we store your name, email address, and (for email/password
            accounts) a bcrypt-hashed password - we never store plaintext passwords. If you sign in
            with Google, we store the name, email, and profile photo Google shares with us, and
            nothing else from your Google account.
          </p>
          <p className="mt-2">
            As you use Voyager, we store the experiences you save, the reviews you write, the AI
            itineraries you generate, and your conversation history with the Voyager Concierge chat
            (scoped to a session) - all of this exists to make the product work, particularly the AI
            recommendation engine, which reads your saved experiences and reviews to personalize
            results.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            How AI features use your data
          </h2>
          <p>
            The itinerary generator, recommendation engine, and concierge chat send relevant
            context (your prompt, stated preferences, and/or matching listing data) to Google&apos;s
            Gemini API to generate a response. We do not sell this data or use it to train models
            beyond what the AI provider does under its own terms. Chat and itinerary history is kept
            so features like &quot;regenerate&quot; and follow-up questions work, and can be cleared
            by contacting us.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            Cookies & sessions
          </h2>
          <p>
            We use a single HTTP-only session cookie (and a matching bearer token in local storage)
            to keep you signed in. We don&apos;t use third-party advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            Your choices
          </h2>
          <p>
            You can update your interests and budget level anytime from your Dashboard, remove
            saved experiences, and delete listings you host from Manage Listings. To request full
            account deletion, contact us and we&apos;ll process it within a reasonable timeframe.
          </p>
        </section>

        <section id="terms">
          <h2 className="mb-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            Terms of Service
          </h2>
          <p>
            Voyager connects travelers with independent local hosts. Hosts are responsible for the
            accuracy of their own listings; Voyager is not a party to the experience itself. AI-
            generated content (itineraries, recommendations, chat responses) is provided as planning
            assistance and should be verified against official sources before you travel - prices,
            availability, and travel requirements can change.
          </p>
          <p className="mt-2">
            By creating an account you agree not to misuse the platform (fraudulent listings, spam,
            scraping) and to keep your login credentials secure. Continued use of Voyager after
            changes to these terms constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            Contact
          </h2>
          <p>
            Questions about this policy can be sent to support@voyager-travel.app or via the{" "}
            <a href="/contact" className="font-medium text-brand-700 hover:underline dark:text-brand-300">
              Contact page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
