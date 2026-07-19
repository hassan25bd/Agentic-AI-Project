import Link from "next/link";
import { Compass, Mail, Phone, MapPin } from "lucide-react";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { GithubIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/explore", label: "All experiences" },
      { href: "/explore?category=Adventure", label: "Adventure trips" },
      { href: "/explore?category=Culture", label: "Cultural tours" },
      { href: "/explore?category=Food%20%26%20Drink", label: "Food & drink" },
    ],
  },
  {
    title: "AI Tools",
    links: [
      { href: "/ai/itinerary", label: "Itinerary generator" },
      { href: "/ai/recommendations", label: "Smart recommendations" },
      { href: "/help", label: "How the AI works" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Voyager" },
      { href: "/contact", label: "Contact us" },
      { href: "/help", label: "Help & support" },
      { href: "/privacy", label: "Privacy & terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-ink-950 text-ink-200 dark:border-ink-800">
      <div className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white">
                <Compass size={18} />
              </span>
              Voyager
            </Link>
            <p className="mt-4 max-w-xs text-sm text-ink-400">
              An agentic AI travel platform: curated experiences from local hosts, planned
              with an AI concierge that reasons, remembers, and recommends.
            </p>
            <div className="mt-5 flex gap-3">
              <SocialIcon href="https://github.com/hassan25bd/Agentic-AI-Project" label="GitHub">
                <GithubIcon size={16} />
              </SocialIcon>
              <SocialIcon href="https://twitter.com" label="Twitter">
                <TwitterIcon size={16} />
              </SocialIcon>
              <SocialIcon href="https://instagram.com" label="Instagram">
                <InstagramIcon size={16} />
              </SocialIcon>
              <SocialIcon href="https://linkedin.com" label="LinkedIn">
                <LinkedinIcon size={16} />
              </SocialIcon>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-400 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 border-t border-ink-800 pt-8 sm:grid-cols-2 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-2 text-sm text-ink-400">
            <p className="flex items-center gap-2">
              <Mail size={15} /> support@voyager-travel.app
            </p>
            <p className="flex items-center gap-2">
              <Phone size={15} /> +1 (415) 555-0138
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={15} /> 148 Market Street, San Francisco, CA
            </p>
          </div>
          <NewsletterForm variant="footer" />
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-ink-800 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Voyager. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/privacy#terms" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-700 text-ink-300 hover:border-brand-400 hover:text-brand-300"
    >
      {children}
    </a>
  );
}
