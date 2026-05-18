"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ClickToZoomImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export function ClickToZoomImage({ className, alt, fallbackSrc, ...props }: ClickToZoomImageProps) {
  const propSrc = typeof props.src === "string" ? props.src : undefined;
  const [open, setOpen] = useState(false);
  const [fallbackForSrc, setFallbackForSrc] = useState<string | undefined>();
  const currentSrc = fallbackForSrc === propSrc && fallbackSrc ? fallbackSrc : propSrc;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [open]);

  const useFallback = () => {
    if (!fallbackSrc || fallbackForSrc === propSrc) return;
    setFallbackForSrc(propSrc);
  };

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
          onError={useFallback}
        />
      </button>

      {typeof document !== "undefined" && open
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
                onError={useFallback}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
