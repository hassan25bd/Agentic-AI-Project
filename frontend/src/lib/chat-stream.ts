import { apiUrl, getStoredToken } from "./api";
import { ChatEvent } from "./types";

export async function* streamChat(
  sessionId: string,
  message: string
): AsyncGenerator<ChatEvent> {
  const token = getStoredToken();
  const res = await fetch(apiUrl("/ai/chat/stream"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ sessionId, message }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    let msg = res.statusText;
    try {
      msg = JSON.parse(text).message ?? msg;
    } catch {
      // ignore
    }
    yield { type: "error", message: msg };
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      const dataLine = chunk.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      try {
        const parsed = JSON.parse(dataLine.slice(5).trim()) as ChatEvent;
        yield parsed;
      } catch {
        // ignore malformed chunk
      }
    }
  }
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server";
  const key = "voyager_chat_session";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}
