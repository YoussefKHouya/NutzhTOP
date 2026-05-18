"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/posts";

type PostCardProps = {
  post: Post;
  variant?: "image" | "list";
  showDate?: boolean;
  showTags?: boolean;
  showCategory?: boolean;
  className?: string;
};

const FALLBACK_COVER = "/mc/images/batman2.avif";

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  timeZone: "UTC",
});

function formatDisplayDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return dateFmt.format(d);
}

function CardCover({ src, alt }: { src?: string; alt: string }) {
  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK_COVER);
  const isRemote = /^https?:\/\//i.test(currentSrc);

  if (isRemote) {
    // Keep remote covers as plain img so existing external-cover behavior does not need next.config domains.
    return (
      <img
        alt={alt}
        className="rounded-t-xl w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105 brightness-[0.85] contrast-[1.1]"
        src={currentSrc}
        onError={() => {
          if (currentSrc !== FALLBACK_COVER) setCurrentSrc(FALLBACK_COVER);
        }}
      />
    );
  }

  return (
    <Image
      alt={alt}
      className="rounded-t-xl object-cover transition-transform duration-500 group-hover:scale-105 brightness-[0.85] contrast-[1.1]"
      src={currentSrc}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => {
        if (currentSrc !== FALLBACK_COVER) setCurrentSrc(FALLBACK_COVER);
      }}
    />
  );
}

export function PostCard({
  post,
  variant = "image",
  showDate = true,
  showTags = false,
  showCategory = false,
  className = "",
}: PostCardProps) {
  const href = `/${post.slug.join("/")}`;

  if (variant === "list") {
    return (
      <Link href={href} className={`block relative rounded-xl border border-white/10 bg-[#111111]/55 backdrop-blur-sm p-4 md:p-6 hover:bg-[#111111]/70 transition-colors ${className}`.trim()}>
        <h3 className="text-xl md:text-3xl font-bold text-white font-mono">{post.meta.title}</h3>
        <p className="text-gray-400 mt-1 text-sm">{post.meta.description ?? ""}</p>

        {showTags && !!post.meta.tags?.length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.meta.tags.slice(0, 8).map((tag) => (
              <span key={`${post.slug.join("/")}-${tag}`} className="text-xs px-2 py-1 rounded bg-zinc-700/80 text-zinc-200 border border-zinc-600/70">
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    );
  }

  return (
    <Link href={href} className={`bg-[#111111] rounded-xl flex flex-col shadow-lg border-2 border-[#111111] transition-all duration-300 hover:shadow-xl group ${className}`.trim()}>
      <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-[#14141480] via-transparent to-[#141414] z-10 rounded-t-xl group-hover:opacity-80 transition-opacity duration-300" />
        <CardCover alt={post.meta.title} src={post.meta.cover} />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        {showDate && (
          <div className="flex justify-center mb-2">
            <p className="text-zinc-500 text-xs font-mono tracking-widest">
              {formatDisplayDate(post.meta.date)}
            </p>
          </div>
        )}
        <div className="mb-2">
          <h3 className="text-2xl font-semibold mb-1 transition-colors duration-300 text-gray-100 group-hover:text-white text-center">{post.meta.title}</h3>
          {showCategory ? <p className="text-gray-400 text-xs uppercase tracking-widest text-center">{post.slug[0] ?? "post"}</p> : null}
        </div>
        <p className="text-gray-300 text-sm font-medium leading-relaxed text-center">{post.meta.description ?? ""}</p>
      </div>
    </Link>
  );
}
