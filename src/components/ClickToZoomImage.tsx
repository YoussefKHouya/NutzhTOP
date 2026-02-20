"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ClickToZoomImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ClickToZoomImage({ className, alt, ...props }: ClickToZoomImageProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
        <img alt={alt ?? ""} className={className} {...props} />
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center"
              onClick={() => setOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label={alt ? `Zoomed image: ${alt}` : "Zoomed image"}
            >
              <img
                alt={alt ?? ""}
                src={typeof props.src === "string" ? props.src : undefined}
                className="max-w-full max-h-[92vh] object-contain rounded"
              />
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
