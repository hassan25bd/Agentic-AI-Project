"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Compass, Menu, X, Sparkles, LogOut, PlusCircle, LayoutGrid, MapPin } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";

const PUBLIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
];

const AUTHED_LINKS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/ai/itinerary", label: "AI Planner" },
  { href: "/ai/recommendations", label: "For You" },
  { href: "/dashboard", label: "My Trips" },
];

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const links = user ? AUTHED_LINKS : PUBLIC_LINKS;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-100 bg-[var(--background)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/75 dark:border-ink-800">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
            <Compass size={18} />
          </span>
          Voyager
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
                  : "text-ink-600 hover:bg-ink-50 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {loading ? null : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-ink-200 py-1 pl-1 pr-3 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-900"
              >
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                  unoptimized
                />
                <span className="text-sm font-medium text-ink-800 dark:text-ink-100">
                  {user.name.split(" ")[0]}
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-ink-100 bg-[var(--background)] p-1.5 shadow-lg dark:border-ink-800">
                  <Link href="/dashboard" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-900">
                    <MapPin size={16} /> My Trips
                  </Link>
                  <Link href="/items/add" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-900">
                    <PlusCircle size={16} /> Add Experience
                  </Link>
                  <Link href="/items/manage" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-900">
                    <LayoutGrid size={16} /> Manage Listings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <LinkButton href="/login" variant="ghost" />
              <LinkButton href="/register" variant="primary" />
            </>
          )}
        </div>

        <button
          className="rounded-full p-2 text-ink-700 lg:hidden dark:text-ink-200"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-100 px-4 pb-4 lg:hidden dark:border-ink-800">
          <nav className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-900"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link href="/items/add" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-900">
                  <Sparkles size={16} /> Add Experience
                </Link>
                <Link href="/items/manage" className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-900">
                  Manage Listings
                </Link>
              </>
            )}
          </nav>
          <div className="mt-3 flex gap-2 border-t border-ink-100 pt-3 dark:border-ink-800">
            {user ? (
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                Log out
              </Button>
            ) : (
              <>
                <LinkButton href="/login" variant="outline" className="flex-1" />
                <LinkButton href="/register" variant="primary" className="flex-1" />
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function LinkButton({
  href,
  variant,
  className,
}: {
  href: string;
  variant: "primary" | "outline" | "ghost";
  className?: string;
}) {
  const label = href === "/login" ? "Log in" : href === "/register" ? "Sign up" : href;
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
        variant === "primary" && "bg-brand-600 text-white hover:bg-brand-700",
        variant === "outline" && "border border-ink-200 text-ink-800 hover:bg-ink-50 dark:text-ink-100 dark:border-ink-700",
        variant === "ghost" && "text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-900",
        className
      )}
    >
      {label}
    </Link>
  );
}
