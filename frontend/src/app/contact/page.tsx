"use client";

import { useState, FormEvent } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { apiFetch, ApiClientError } from "@/lib/api";
import { Button } from "@/components/ui/Button";

const inputClass =
  "w-full rounded-xl border border-ink-200 bg-transparent px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:border-ink-700";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/contact", { method: "POST", body: { name, email, subject, message }, auth: false });
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not send your message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-14">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
          Contact
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
          Get in touch
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Questions about a trip, hosting, or the AI features - we read every message.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          <ContactRow icon={<Mail size={16} />} label="Email" value="support@voyager-travel.app" />
          <ContactRow icon={<Phone size={16} />} label="Phone" value="+1 (415) 555-0138" />
          <ContactRow icon={<MapPin size={16} />} label="Office" value="148 Market Street, San Francisco, CA" />
          <div className="card p-4 text-sm text-ink-500">
            Hosting an experience? Mention it in your message and we&apos;ll help you get set up on
            Manage Listings.
          </div>
        </div>

        <form onSubmit={submit} className="card space-y-4 p-6">
          {sent ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <CheckCircle2 className="text-brand-600" size={32} />
              <p className="font-medium text-ink-800 dark:text-ink-100">Message sent</p>
              <p className="text-sm text-ink-500">We&apos;ll get back to you within 1-2 business days.</p>
              <Button variant="outline" size="sm" onClick={() => setSent(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-500">Name</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Your name" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink-500">Email</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-500">Subject</label>
                <input required value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass} placeholder="How can we help?" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-500">Message</label>
                <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} placeholder="Tell us more..." />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                <Send size={14} /> {loading ? "Sending..." : "Send message"}
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
        {icon}
      </div>
      <div>
        <p className="text-xs text-ink-500">{label}</p>
        <p className="text-sm font-medium text-ink-800 dark:text-ink-100">{value}</p>
      </div>
    </div>
  );
}
