"use client";

import { useState } from "react";

export function PizzaWidget() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed bottom-0 left-16 z-50 group animate-peek">
      <button
        onClick={() => setOpen(false)}
        aria-label="Close pizza"
        className="absolute top-2 right-2 z-10 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <img
        alt="Pizza"
        loading="lazy"
        width={200}
        height={200}
        className="w-[120px] md:w-[200px]"
        src="/images/pi22a.png"
        style={{ color: "transparent" }}
      />
    </div>
  );
}