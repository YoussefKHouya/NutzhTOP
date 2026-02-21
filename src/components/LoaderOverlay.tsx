"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function LoaderOverlay() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0);
  const progressRef = useRef<number | null>(null);
  const hideRef = useRef<number | null>(null);

  useEffect(() => {
    let i = 0;
    setPct(0);
    setVisible(true);

    progressRef.current = window.setInterval(() => {
      i += Math.floor(Math.random() * 12) + 8;
      if (i >= 100) {
        i = 100;
        setPct(100);
        if (progressRef.current) window.clearInterval(progressRef.current);
        hideRef.current = window.setTimeout(() => setVisible(false), 180);
        return;
      }
      setPct(i);
    }, 45);

    return () => {
      if (progressRef.current) window.clearInterval(progressRef.current);
      if (hideRef.current) window.clearTimeout(hideRef.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      id="mc_loader"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md transition-opacity duration-300 opacity-100"
    >
      <div className="transition-opacity duration-300">
        <div className="relative text-8xl font-bold text-white hover:text-gray-300 transition-colors duration-300 px-6 py-2 flex flex-col items-center sm:text-6xl">
          <img
            alt="Dog"
            loading="lazy"
            width={200}
            height={200}
            decoding="async"
            className="sm:w-48 sm:h-48 w-32 h-32 rounded-full object-cover"
            style={{ color: "transparent" }}
            src="/mc/images/dog.gif"
          />
          <span className="relative z-10 font-upheavtt sm:text-4xl text-3xl" id="mc_loader_pct">
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}