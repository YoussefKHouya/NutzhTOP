"use client";

import React, { useState } from "react";
import { usePinnedCode } from "@/components/PinnedCodeProvider";

export function CodeBlock({ code, lang, className }: { code: string; lang?: string; className?: string }) {
  const { pin } = usePinnedCode();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function handlePin() {
    pin({ code, lang, title: lang ? `Pinned ${lang} code` : "Pinned code" });
  }

  // Preserve the original className for syntax highlighting, or construct it from lang
  const codeClassName = className || (lang ? `language-${lang}` : undefined);

  return (
    <div className="code-block-shell my-4 overflow-hidden rounded-lg border border-zinc-700/50 bg-[#111111]" data-code-lang={lang || "code"}>
      {/* Header */}
      <div className="code-block-header flex items-center justify-between gap-2 border-b border-zinc-700/50 px-3 py-2">
        <span className="text-xs text-zinc-400 font-mono">{lang || "code"}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-md border border-white/20 bg-black/40 px-2.5 py-1 text-xs text-white/90 hover:bg-white/10 transition-colors active:scale-95"
            aria-label="Copy code"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            type="button"
            onClick={handlePin}
            className="rounded-md border border-white/20 bg-black/40 px-2.5 py-1 text-xs text-white/90 hover:bg-white/10 transition-colors active:scale-95"
            aria-label="Pin code"
          >
            Pin
          </button>
        </div>
      </div>

      {/* Body */}
      <pre
        className={(codeClassName || "") + " !m-0 rounded-none border-0 overflow-x-auto"}
        style={{ whiteSpace: "pre", wordBreak: "normal", overflowWrap: "normal" }}
      >
        <code
          className={codeClassName}
          style={{ whiteSpace: "pre", wordBreak: "normal", overflowWrap: "normal", display: "block" }}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}
