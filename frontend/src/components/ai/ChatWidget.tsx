"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Search, Loader2, Sparkles } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api";
import { streamChat, getOrCreateSessionId } from "@/lib/chat-stream";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([
    "Recommend experiences for a food lover",
    "Plan a 4-day trip to Kyoto on a mid-range budget",
    "What adventure trips do you offer?",
  ]);
  const [streaming, setStreaming] = useState(false);
  const [toolStatus, setToolStatus] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionIdRef.current = getOrCreateSessionId();
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (!open || historyLoaded || !user) return;
    setHistoryLoaded(true);
    apiFetch<{ messages: { _id: string; role: "user" | "assistant"; content: string }[] }>(
      `/ai/chat/${sessionIdRef.current}`
    )
      .then((data) => {
        setMessages(data.messages.map((m) => ({ id: m._id, role: m.role, content: m.content })));
      })
      .catch(() => {});
  }, [open, historyLoaded, user]);

  if (!user) return null;

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setInput("");
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", content: trimmed }]);
    setStreaming(true);
    setToolStatus(null);

    const assistantId = `a-${Date.now()}`;
    let assistantText = "";
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      for await (const event of streamChat(sessionIdRef.current, trimmed)) {
        if (event.type === "tool_call") {
          setToolStatus(
            event.tool === "search_experiences"
              ? "Searching Voyager listings..."
              : "Looking up experience details..."
          );
        } else if (event.type === "tool_result") {
          setToolStatus(null);
        } else if (event.type === "text_delta") {
          assistantText += event.text;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: assistantText } : m))
          );
        } else if (event.type === "done") {
          setSuggestions(event.suggestions);
          if (!assistantText) {
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: event.reply } : m))
            );
          }
        } else if (event.type === "error") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: `⚠️ ${event.message}` } : m
            )
          );
        }
      }
    } finally {
      setStreaming(false);
      setToolStatus(null);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[32rem] w-[92vw] max-w-sm flex-col overflow-hidden rounded-3xl border border-ink-100 bg-[var(--background)] shadow-2xl dark:border-ink-800">
          <div className="flex items-center justify-between bg-brand-600 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <div>
                <p className="text-sm font-semibold leading-tight">Voyager Concierge</p>
                <p className="text-xs text-brand-100">Ask about trips, prices, itineraries</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1 hover:bg-white/10">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="rounded-2xl bg-ink-50 p-3 text-sm text-ink-600 dark:bg-ink-900 dark:text-ink-300">
                Hi {user.name.split(" ")[0]}! I&apos;m your Voyager concierge - I can search real
                listings, explain what&apos;s included, and help you plan a trip. What are you
                thinking?
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={clsx("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={clsx(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm",
                    m.role === "user"
                      ? "bg-brand-600 text-white"
                      : "bg-ink-100 text-ink-800 dark:bg-ink-900 dark:text-ink-100"
                  )}
                >
                  {m.content || (streaming && <TypingDots />)}
                </div>
              </div>
            ))}
            {toolStatus && (
              <div className="flex items-center gap-2 text-xs text-ink-400">
                <Search size={13} className="animate-pulse" /> {toolStatus}
              </div>
            )}
          </div>

          {suggestions.length > 0 && !streaming && (
            <div className="flex flex-wrap gap-1.5 border-t border-ink-100 px-3 pt-2.5 pb-1 dark:border-ink-800">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-ink-200 px-2.5 py-1 text-xs text-ink-600 hover:border-brand-400 hover:text-brand-700 dark:border-ink-700 dark:text-ink-300"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-ink-100 p-3 dark:border-ink-800"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about destinations, prices..."
              className="flex-1 rounded-full border border-ink-200 bg-transparent px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:border-ink-700"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white disabled:opacity-50"
              aria-label="Send message"
            >
              {streaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-500 text-white shadow-lg transition-transform hover:scale-105"
        aria-label="Toggle Voyager Concierge chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400" />
    </span>
  );
}
