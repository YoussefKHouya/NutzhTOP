"use client";

import { useEffect, useState } from "react";

export function ReadProgressFooter() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return setPct(0);
      setPct(Math.min(100, Math.max(0, (scrollTop / max) * 100)));
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[80] pointer-events-none">
      <div className="h-1 w-full bg-white/10">
        <div className="h-full bg-white/80 transition-[width] duration-100" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
