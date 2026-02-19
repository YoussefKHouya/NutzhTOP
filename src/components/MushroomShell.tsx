"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function MushroomShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [meowOff, setMeowOff] = useState(false);

  async function playMeowFx() {
    try {
      // primary: real wav sample
      const sample = new Audio("/sounds/meow.wav");
      sample.volume = 0.9;
      await sample.play();
      return;
    } catch {
      // fallback: synth beep
    }

    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      if (ctx.state === "suspended") await ctx.resume();
      const now = ctx.currentTime;

      const gain = ctx.createGain();
      gain.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(760, now);
      osc1.frequency.exponentialRampToValueAtTime(260, now + 0.11);
      osc1.frequency.exponentialRampToValueAtTime(430, now + 0.24);
      osc1.connect(gain);

      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(380, now);
      osc2.frequency.exponentialRampToValueAtTime(180, now + 0.2);
      osc2.connect(gain);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.29);
      osc2.stop(now + 0.29);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="mt-12 flex flex-col flex-grow">
      <nav className="text-gray-200 p-4 transition-all duration-300 w-full z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center relative">
          <button
            className="md:absolute md:right-16 absolute left-0 z-50 transition-all duration-300 group flex items-center gap-2"
            aria-label="Toggle Meow"
            type="button"
            onClick={() => {
              setMeowOff((v) => !v);
              playMeowFx();
            }}
          >
            <div className="relative flex items-center gap-2 opacity-100">
              <img
                alt="Meow Toggle"
                loading="lazy"
                width={32}
                height={32}
                decoding="async"
                className="image-rendering-pixelated w-6 h-6 md:w-8 md:h-8"
                style={{ color: "transparent", filter: "invert(1)" }}
                src="/mc/images/cat-pixel.png"
              />
              <div className="md:hidden">
                <img
                  alt="Sound On"
                  loading="lazy"
                  width={20}
                  height={20}
                  decoding="async"
                  style={{ color: "transparent", filter: "brightness(0) invert(1)" }}
                  src="/sounds/on.svg"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <span className="font-upheavtt text-2xl text-white hidden md:block">meow?</span>

              {/* slash */}
              <div className={"absolute inset-0 flex items-center pointer-events-none " + (meowOff ? "" : "hidden")}>
                <div className="w-full h-[2px] md:h-[3px] bg-red-600/80 rotate-[-15deg] shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
              </div>
            </div>
          </button>

          <button
            className="absolute right-0 z-50 w-12 h-12 flex flex-col justify-center items-center focus:outline-none"
            aria-label="Toggle Menu"
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <div className="relative w-5 h-4">
              <span className="absolute top-0 left-0 w-5 h-0.5 bg-white transition-all duration-300 ease-out " />
              <span className="absolute top-1/2 left-0 w-5 h-0.5 bg-white -translate-y-1/2 transition-all duration-300 ease-out opacity-100" />
              <span className="absolute bottom-0 left-0 w-5 h-0.5 bg-white transition-all duration-300 ease-out " />
            </div>
          </button>

          <div className="w-full flex flex-col items-center">
            <Link
              className="relative text-4xl font-bold text-white z-50 font-upheavtt hover:text-gray-300 transition-colors duration-300 px-6 py-2"
              href="/"
            >
              <span className="relative z-10 mr-2 inline-block">
                Nutzh
                <img alt="Nyan Cat" loading="lazy" width={70} height={20} decoding="async" className="animate-cat" style={{ color: "transparent" }} src="/mc/images/nyancat.gif" />
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* overlay menu */}
      <div
        className={
          "fixed inset-0 bg-black/40 backdrop-blur-md z-40 transition-all duration-300 " +
          (menuOpen ? "opacity-100" : "opacity-0 pointer-events-none")
        }
        onClick={(e) => {
          if (e.target === e.currentTarget) setMenuOpen(false);
        }}
      >
        <div className={"h-full flex items-center justify-center transition-all duration-300 " + (menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
          <ul className="mt-10 md:mt-0 space-y-4 md:space-y-8 text-center">
            <li className="transition-opacity duration-300 hover:opacity-70">
              <Link className="text-white text-3xl md:text-4xl font-bold block" href="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="transition-opacity duration-300 hover:opacity-70">
              <Link className="text-white text-3xl md:text-4xl font-bold block" href="/my-writeups" onClick={() => setMenuOpen(false)}>
                My Writeups
              </Link>
            </li>
            <li className="transition-opacity duration-300 hover:opacity-70">
              <Link className="text-white text-3xl md:text-4xl font-bold block" href="/projects" onClick={() => setMenuOpen(false)}>
                Projects
              </Link>
            </li>
            <li className="transition-opacity duration-300 hover:opacity-70">
              <Link className="text-white text-3xl md:text-4xl font-bold block" href="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </li>
            <li className="transition-opacity duration-300 hover:opacity-70">
              <Link className="text-white text-3xl md:text-4xl font-bold block" href="/resources" onClick={() => setMenuOpen(false)}>
                Resources
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {children}

      <footer className="h-16 flex items-center justify-center">
        <p className="text-sm text-gray-500">Copyright © {new Date().getFullYear()} Nutzh</p>
      </footer>
    </div>
  );
}
