"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type PinnedCode = {
  code: string;
  lang?: string;
  title?: string;
};

type Ctx = {
  pinned: PinnedCode | null;
  pin: (p: PinnedCode) => void;
  clear: () => void;
};

const PinnedCodeContext = createContext<Ctx | null>(null);

export function usePinnedCode() {
  const ctx = useContext(PinnedCodeContext);
  if (!ctx) throw new Error("usePinnedCode must be used within PinnedCodeProvider");
  return ctx;
}

export function PinnedCodeProvider({ children }: { children: React.ReactNode }) {
  const [pinned, setPinned] = useState<PinnedCode | null>(null);

  const value = useMemo<Ctx>(
    () => ({
      pinned,
      pin: (p) => setPinned(p),
      clear: () => setPinned(null),
    }),
    [pinned]
  );

  return (
    <PinnedCodeContext.Provider value={value}>
      {children}
      <PinnedCodePanel />
    </PinnedCodeContext.Provider>
  );
}

function PinnedCodePanel() {
  const { pinned, clear } = usePinnedCode();
  const [copied, setCopied] = useState(false);

  if (!pinned) return null;

  async function copy() {
    if (!pinned) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(pinned.code);
      } else {
        const ta = document.createElement("textarea");
        ta.value = pinned.code;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="fixed right-4 top-24 z-[9999] w-[min(520px,calc(100vw-32px))] max-h-[calc(100vh-140px)]">
      <div className="pinned-code-shell overflow-hidden rounded-[14px] border border-white/10 bg-[#111111]/90 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-md" data-pin-lang={pinned.lang || "code"}>
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2 font-mono text-xs text-white/85">
          <div className="truncate">{pinned.title ?? "Pinned code"}{pinned.lang ? ` · ${pinned.lang}` : ""}</div>
          <div className="flex items-center gap-2">
            <button onClick={copy} className="rounded-[10px] border border-white/15 bg-black/20 px-2.5 py-1.5 text-xs hover:bg-white/5">
              {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={clear} className="rounded-[10px] border border-white/15 bg-black/20 px-2.5 py-1.5 text-xs hover:bg-white/5">
              Close
            </button>
          </div>
        </div>
        <div className="max-h-[calc(100vh-220px)] overflow-auto p-3">
          <pre className="m-0 overflow-auto whitespace-pre bg-[#1e1e1e] rounded-lg p-4">
            <code className={pinned.lang ? `language-${pinned.lang}` : undefined}>{pinned.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}







