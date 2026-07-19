"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiClientError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { GoogleButton } from "@/components/auth/GoogleButton";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Save experiences, get AI itineraries, and personalized recommendations.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Full name</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2.5 dark:border-ink-700">
              <User size={16} className="text-ink-400" />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>
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
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Confirm password</label>
            <div className="flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2.5 dark:border-ink-700">
              <Lock size={16} className="text-ink-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
          <span className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
          or
          <span className="h-px flex-1 bg-ink-100 dark:bg-ink-800" />
        </div>

        <GoogleButton />

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
