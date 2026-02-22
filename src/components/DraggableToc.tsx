"use client";

import { useEffect, useRef, useState } from "react";
import { TableOfContents } from "@/components/TableOfContents";

export function DraggableToc() {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const target = useRef({ x: 56, y: 112 });
  const current = useRef({ x: 56, y: 112 });
  const [renderPos, setRenderPos] = useState({ x: 56, y: 112 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      target.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    };

    const onUp = () => setDragging(false);

    if (dragging) {
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
    } else {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, offset.x, offset.y]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const ease = dragging ? 0.25 : 0.12;
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;

      setRenderPos({ x: current.current.x, y: current.current.y });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dragging]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
    setOffset({ x: e.clientX - current.current.x, y: e.clientY - current.current.y });
    target.current = { x: current.current.x, y: current.current.y };
  };

  return (
    <div
      className={`hidden md:block fixed z-40 cursor-${dragging ? "grabbing" : "grab"}`}
      style={{ left: renderPos.x, top: renderPos.y }}
      onMouseDown={onMouseDown}
    >
      <TableOfContents draggable />
    </div>
  );
}
