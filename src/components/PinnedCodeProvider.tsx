"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

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
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragOffset.current) return;
      const panelWidth = Math.min(520, window.innerWidth - 32);
      const nextX = Math.min(window.innerWidth - panelWidth - 8, Math.max(8, e.clientX - dragOffset.current.x));
      const nextY = Math.min(window.innerHeight - 120, Math.max(8, e.clientY - dragOffset.current.y));
      setPos({ x: nextX, y: nextY });
    }

    function onUp() {
      dragOffset.current = null;
      setIsDragging(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

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

  function startDrag(e: React.MouseEvent<HTMLDivElement>) {
    const rect = (e.currentTarget.parentElement?.parentElement as HTMLDivElement | null)?.getBoundingClientRect();
    if (!rect) return;
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setIsDragging(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  }

  return (
    <div
      className="fixed right-4 bottom-4 lg:bottom-auto lg:top-[360px] z-[70] w-[min(520px,calc(100vw-32px))] max-h-[calc(100vh-140px)]"
      style={pos ? { left: `${pos.x}px`, top: `${pos.y}px`, right: "auto", bottom: "auto" } : undefined}
    >
      <div className="pinned-code-shell overflow-hidden rounded-[14px] border border-white/10 bg-[#111111]/90 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-md" data-pin-lang={pinned.lang || "code"}>
        <div onMouseDown={startDrag} className={`flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2 font-mono text-xs text-white/85 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
          <div className="truncate">{pinned.title ?? "Pinned code"}{pinned.lang ? ` · ${pinned.lang}` : ""}</div>
          <div className="flex items-center gap-2">
            <button onMouseDown={(e) => e.stopPropagation()} onClick={copy} className="rounded-[10px] border border-white/15 bg-black/20 px-2.5 py-1.5 text-xs hover:bg-white/5">
              {copied ? "Copied" : "Copy"}
            </button>
            <button onMouseDown={(e) => e.stopPropagation()} onClick={clear} className="rounded-[10px] border border-white/15 bg-black/20 px-2.5 py-1.5 text-xs hover:bg-white/5">
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







