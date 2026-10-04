"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";

const NAV_INTENT_KEY = "mc.loader.navIntentTs";
const LOADER_DELAY_MS = 450;

export function LoaderOverlay() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navigationKey = `${pathname}?${searchParams.toString()}`;
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0);
  const showDelayRef = useRef<number | null>(null);
  const progressRef = useRef<number | null>(null);
  const hideRef = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const firstLoadRef = useRef(true);

  const clearTimers = useCallback(() => {
    if (showDelayRef.current) window.clearTimeout(showDelayRef.current);
    if (progressRef.current) window.clearInterval(progressRef.current);
    if (hideRef.current) window.clearTimeout(hideRef.current);
    showDelayRef.current = null;
    progressRef.current = null;
    hideRef.current = null;
  }, []);

  const hideLoader = useCallback(() => {
    clearTimers();
    visibleRef.current = false;
    setVisible(false);
    setPct(0);
  }, [clearTimers]);

  const startLoaderNow = useCallback(() => {
    if (visibleRef.current) return;

    if (progressRef.current) window.clearInterval(progressRef.current);
    if (hideRef.current) window.clearTimeout(hideRef.current);
    progressRef.current = null;
    hideRef.current = null;

    let i = 0;
    visibleRef.current = true;
    setPct(0);
    setVisible(true);

    progressRef.current = window.setInterval(() => {
      i = Math.min(95, i + Math.floor(Math.random() * 9) + 4);
      setPct(i);
    }, 80);
  }, []);

  const scheduleLoader = useCallback(() => {
    clearTimers();
    showDelayRef.current = window.setTimeout(startLoaderNow, LOADER_DELAY_MS);
  }, [clearTimers, startLoaderNow]);

  const finishLoader = useCallback(() => {
    if (!visibleRef.current) {
      hideLoader();
      return;
    }

    if (showDelayRef.current) window.clearTimeout(showDelayRef.current);
    if (progressRef.current) window.clearInterval(progressRef.current);
    showDelayRef.current = null;
    progressRef.current = null;

    setPct(100);
    hideRef.current = window.setTimeout(() => {
      visibleRef.current = false;
      setVisible(false);
      setPct(0);
    }, 180);
  }, [hideLoader]);

  // Delayed loader: fast pages skip it, slow client navigations show it.
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const a = target.closest("a") as HTMLAnchorElement | null;
      if (!a) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;

      const href = a.getAttribute("href") || "";
      if (!href || href.startsWith("#")) return;

      const isInternal = href.startsWith("/") || href.startsWith(window.location.origin);
      if (!isInternal) return;

      const destination = new URL(href, window.location.href);
      if (destination.href === window.location.href) return;

      try {
        window.sessionStorage.setItem(NAV_INTENT_KEY, String(Date.now()));
      } catch {
        // ignore storage errors
      }

      scheduleLoader();
    };

    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, [scheduleLoader]);

  useEffect(() => {
    // On first hard load, do not cover already-rendered content.
    if (firstLoadRef.current) {
      firstLoadRef.current = false;
      clearTimers();
      return;
    }

    let hadRecentNavigationIntent = false;
    try {
      const ts = Number(window.sessionStorage.getItem(NAV_INTENT_KEY) || "0");
      window.sessionStorage.removeItem(NAV_INTENT_KEY);
      hadRecentNavigationIntent = Number.isFinite(ts) && ts > 0 && Date.now() - ts < 10000;
    } catch {
      hadRecentNavigationIntent = false;
    }

    if (hadRecentNavigationIntent) {
      const id = window.setTimeout(finishLoader, 0);
      return () => window.clearTimeout(id);
    }
  }, [navigationKey, finishLoader, clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  if (!visible) return null;

  return (
    <div
      id="mc_loader"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md transition-opacity duration-300 opacity-100"
    >
      <div className="transition-opacity duration-300">
        <div className="relative text-8xl font-bold text-white hover:text-gray-300 transition-colors duration-300 px-6 py-2 flex flex-col items-center sm:text-6xl">
          <Image
            alt="Dog"
            priority
            unoptimized
            width={200}
            height={200}
            className="sm:w-48 sm:h-48 w-32 h-32 rounded-full object-cover"
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
