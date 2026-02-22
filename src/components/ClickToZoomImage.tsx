"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ClickToZoomImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export function ClickToZoomImage({ className, alt, fallbackSrc, ...props }: ClickToZoomImageProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(typeof props.src === "string" ? props.src : undefined);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setCurrentSrc(typeof props.src === "string" ? props.src : undefined);
  }, [props.src]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="block w-full cursor-zoom-in"
        onClick={() => setOpen(true)}
        aria-label={`Open image${alt ? `: ${alt}` : ""}`}
      >
        <img
          alt={alt ?? ""}
          className={className}
          {...props}
          src={currentSrc}
          onError={() => {
            if (!fallbackSrc || currentSrc === fallbackSrc) return;
            setCurrentSrc(fallbackSrc);
          }}
        />
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center"
              onClick={() => setOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label={alt ? `Zoomed image: ${alt}` : "Zoomed image"}
            >
              <img
                alt={alt ?? ""}
                src={currentSrc}
                className="max-w-full max-h-[92vh] object-contain rounded"
                onClick={(e) => e.stopPropagation()}
                onError={() => {
                  if (!fallbackSrc || currentSrc === fallbackSrc) return;
                  setCurrentSrc(fallbackSrc);
                }}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
