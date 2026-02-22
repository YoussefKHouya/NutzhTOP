"use client";

import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function TableOfContents({ draggable = false }: { draggable?: boolean } = {}) {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll(".prose h2, .prose h3")) as HTMLHeadingElement[];
    const used = new Set<string>();

    const next = headings
      .map((h) => {
        const text = (h.textContent || "").trim();
        if (!text) return null;

        let id = h.id || slugify(text) || "section";
        let unique = id;
        let i = 2;
        while (used.has(unique)) {
          unique = `${id}-${i++}`;
        }
        used.add(unique);
        h.id = unique;

        const level = h.tagName.toLowerCase() === "h3" ? 3 : 2;
        return { id: unique, text, level } as TocItem;
      })
      .filter(Boolean) as TocItem[];

    setItems(next);
  }, []);

  if (!items.length) return null;

  return (
    <aside className={draggable ? "" : "mt-8 lg:mt-0"}>
      <div className={`rounded-xl border border-white/10 bg-[#111111]/60 p-4 max-w-[262px] ${draggable ? "" : "lg:sticky lg:top-32"}`}>
        <p className="text-sm uppercase tracking-wider text-zinc-400 mb-3">On this page</p>
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.id} className={item.level === 3 ? "pl-4 opacity-90" : ""}>
              <a href={`#${item.id}`} className="text-zinc-300 hover:text-white transition-colors">
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}


