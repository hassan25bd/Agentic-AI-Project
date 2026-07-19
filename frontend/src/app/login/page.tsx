"use client";

import { Suspense, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Sparkles, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiClientError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { GoogleButton } from "@/components/auth/GoogleButton";

const DEMO_EMAIL = "demo@voyager.app";
const DEMO_PASSWORD = "DemoPass123!";

function LoginPageInner() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent, overrideEmail?: string, overridePassword?: string) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(overrideEmail ?? email, overridePassword ?? password);
      router.push(next);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (e: FormEvent) => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    submit(e, DEMO_EMAIL, DEMO_PASSWORD);
  };

  return (
    <div className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">Log in to plan and save your trips.</p>
        </div>

        <button
          onClick={handleDemoLogin}
          disabled={loading}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent-50 px-4 py-3 text-sm font-semibold text-accent-700 hover:bg-accent-100 disabled:opacity-60 dark:bg-accent-900/30 dark:text-accent-200"
        >
          <Sparkles size={15} />
          Try the demo account
        </button>

        <div className="mb-5 flex items-center gap-3 text-xs text-ink-400">
          <span className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
          or continue with email
          <span className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2.5 dark:border-ink-700">
              <Mail size={16} className="text-ink-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2.5 dark:border-ink-700">
              <Lock size={16} className="text-ink-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility">
                {showPassword ? <EyeOff size={16} className="text-ink-400" /> : <Eye size={16} className="text-ink-400" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
          <span className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
          or
          <span className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
        </div>

        <GoogleButton next={next} />

        <p className="mt-6 text-center text-sm text-ink-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}
