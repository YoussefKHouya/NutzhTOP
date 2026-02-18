"use client";

import { useEffect, useRef, useState } from "react";

export function LoaderOverlay() {
  const [hidden, setHidden] = useState(false);
  const [pct, setPct] = useState(0);
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    let i = 0;

    // safety timeout
    const safety = window.setTimeout(() => setHidden(true), 4500);

    tRef.current = window.setInterval(() => {
      i += Math.floor(Math.random() * 9) + 3;
      if (i >= 100) {
        i = 100;
        setPct(100);
        if (tRef.current) window.clearInterval(tRef.current);
        window.setTimeout(() => setHidden(true), 250);
        return;
      }
      setPct(i);
    }, 60);

    return () => {
      window.clearTimeout(safety);
      if (tRef.current) window.clearInterval(tRef.current);
    };
  }, []);

  return (
    <div
      id="mc_loader"
      className={
        "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md transition-opacity duration-1000 " +
        (hidden ? "opacity-0 pointer-events-none" : "opacity-100")
      }
    >
      <div className="transition-opacity duration-1000">
        <div className="relative text-8xl font-bold text-white hover:text-gray-300 transition-colors duration-300 px-6 py-2 flex flex-col items-center sm:text-6xl">
          <img
            alt="Party Cat"
            loading="lazy"
            width={200}
            height={200}
            decoding="async"
            className="sm:w-48 sm:h-48 w-32 h-32"
            style={{ color: "transparent" }}
            src="/mc/images/partycat.webp"
          />
          <span className="relative z-10 font-upheavtt sm:text-4xl text-3xl" id="mc_loader_pct">
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}
