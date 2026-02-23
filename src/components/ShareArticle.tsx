"use client";

// NOTE (parked): kept for future use, currently not wired into any page.
// Safe to keep in repo without affecting runtime.

import { useState } from "react";

export function ShareArticle({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [thanksShown, setThanksShown] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setThanksShown(true);
      setTimeout(() => {
        setCopied(false);
        setThanksShown(false);
      }, 2000);
    } catch {}
  }

  function handleShareClick() {
    setOpen((v) => !v);
    if (!open) {
      setThanksShown(true);
      setTimeout(() => setThanksShown(false), 2000);
    }
  }

  return (
    <div className="flex flex-col items-center relative mt-6">
      <button 
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-200" 
        aria-label="Share article" 
        aria-expanded={open}
        onClick={handleShareClick}
      >
        <span>Share</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {thanksShown && (
        <div className="mt-2 text-sm text-gray-400 animate-in fade-in duration-200">
          Thanks for sharing!
        </div>
      )}
      
      <div 
        className={`mt-4 flex justify-center gap-4 transition-all duration-300 origin-top overflow-hidden ${
          open 
            ? "scale-100 h-auto opacity-100 max-h-20" 
            : "scale-95 h-0 opacity-0 max-h-0 pointer-events-none"
        }`}
      >
        <button 
          className={`p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800/50 ${copied ? 'text-green-400' : ''}`} 
          aria-label="Copy link" 
          onClick={copy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <a 
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800/50" 
          aria-label="Share on X (Twitter)" 
          target="_blank" 
          rel="noopener noreferrer"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
        >
          X
        </a>
      </div>
    </div>
  );
}
