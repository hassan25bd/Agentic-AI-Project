"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ApiClientError } from "@/lib/api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleButton({ next = "/" }: { next?: string }) {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady || !CLIENT_ID || !buttonRef.current || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: async (response: { credential: string }) => {
        try {
          await loginWithGoogle(response.credential);
          router.push(next);
        } catch (err) {
          setError(err instanceof ApiClientError ? err.message : "Google sign-in failed.");
        }
      },
    });
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
      shape: "pill",
      text: "continue_with",
    });
  }, [scriptReady, loginWithGoogle, router, next]);

  if (!CLIENT_ID) {
    return (
      <div
        title="Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in frontend/.env.local to enable Google sign-in"
        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-ink-200 py-3 text-sm font-medium text-ink-400 dark:border-ink-700"
      >
        Continue with Google (not configured)
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={buttonRef} className="flex w-full justify-center" />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
