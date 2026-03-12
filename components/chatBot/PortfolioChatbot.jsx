"use client";

import { useState } from "react";

export default function FloatingPortfolioChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    const userMessage = { role: "user", content: question };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/restaurent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          history: nextMessages,
        }),
      });

      const data = await res.json();
      const replyText =
        data.reply ||
        data.error ||
        "Sorry, something went wrong. Please try again in a moment.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: replyText },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't reach the server. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      {/* <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-600 to-slate-700 text-white shadow-lg shadow-slate-500/30 hover:scale-105 hover:shadow-xl active:scale-95 transition-transform"
      >
        <div className="relative">
          <div className="h-7 w-7 rounded-[10px] border border-white/30 bg-white/10 backdrop-blur flex items-center justify-center">
            <span className="flex gap-[3px]">
              <span className="h-[4px] w-[4px] rounded-full bg-white/80" />
              <span className="h-[4px] w-[4px] rounded-full bg-white/80" />
              <span className="h-[4px] w-[4px] rounded-full bg-white/80" />
            </span>
          </div>

          <div className="absolute -bottom-[4px] right-[6px] h-3 w-3 rotate-45 border-r border-b border-white/30 bg-white/10" />
        </div>

        {!open && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
        )}
      </button> */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed -bottom-1 -right-5 z-40 flex h-40 w-40 items-center justify-center hover:scale-105  active:scale-95 transition-transform"
      >
        <img
          src="/chatbotAnimation.gif"
          alt="Chatbot"
          className="h-28 w-28 rounded-full object-cover"
        />

        {!open && (
          <span className="absolute top-10 right-18 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
        )}
      </button>

      {/* Chat popup */}
      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[340px] max-w-[90vw] rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-400 text-xs font-semibold text-white">
                AI
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Ask about our restaurant
                </p>
                <p className="text-[11px] text-slate-500">
                  Location · Menu · Reservations · Contact
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex h-80 flex-col px-3 py-2 text-sm">
            <div className="mb-2 space-y-2 overflow-y-auto pr-1">
              {messages.length === 0 && (
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
                  You can ask things like:
                  <ul className="mt-1 list-disc pl-4">
                    <li>“What are today’s special dishes?”</li>
                    <li>“Do you offer vegetarian or vegan options?”</li>
                    <li>“Can I reserve a table for tonight?”</li>
                    <li>“Do you provide catering services?”</li>
                    <li>“What are your opening hours?”</li>
                  </ul>
                </div>
              )}

              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-snug ${
                      m.role === "user"
                        ? "bg-slate-700 text-white"
                        : "bg-slate-200 text-slate-900"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl bg-slate-100 px-3 py-2 text-[13px] text-slate-500">
                    Thinking…
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="mt-auto flex gap-2 pt-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about my restaurent…"
                className="h-9 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-[13px] outline-none ring-0 focus:border-slate-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-9 rounded-xl bg-slate-900 px-3 text-[13px] font-medium text-white disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
