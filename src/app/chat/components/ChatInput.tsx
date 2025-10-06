"use client";
import { useState } from "react";

export default function ChatInput({
  onSend,
}: {
  onSend: (msg: string) => void;
}) {
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!value.trim()) return;
    setIsSending(true);
    onSend(value.trim());
    setValue("");
    // simulate send delay
    setTimeout(() => setIsSending(false), 400);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-3 items-end">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Send a message... (Shift+Enter for newline)"
          className="flex-1 min-h-[44px] max-h-44 resize-none p-3 rounded bg-[#0b1220] border border-white/6 outline-none text-slate-200"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSend}
            disabled={isSending}
            className="bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] px-4 py-2 rounded disabled:opacity-60 text-white"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-400">
        Tip: press Enter to send, Shift+Enter for newline.
      </div>
    </div>
  );
}
