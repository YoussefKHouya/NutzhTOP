import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { SectionTitle } from "@/components/SectionTitle";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Cybersecurity & CTF Writeups",
  alternates: { canonical: "/my-writeups" },
};

export default function MyWriteupsPage() {
  const posts = getAllPosts().filter((p) => (p.meta.type || "writeup") === "writeup");

  const getDifficulty = (difficulty?: string, tags?: string[]) => {
    const d = (difficulty || "").toLowerCase();
    if (d === "hard") return { label: "Hard", cls: "bg-red-500" };
    if (d === "easy") return { label: "Easy", cls: "bg-green-500" };
    if (d === "medium") return { label: "Medium", cls: "bg-yellow-400 text-black" };

    // fallback for older markdown files using tags only
    const t = (tags || []).map((x) => x.toLowerCase());
    if (t.includes("hard")) return { label: "Hard", cls: "bg-red-500" };
    if (t.includes("easy")) return { label: "Easy", cls: "bg-green-500" };
    if (t.includes("medium")) return { label: "Medium", cls: "bg-yellow-400 text-black" };
    return null;
  };

  return (
    <SiteShell>
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-10 md:py-14">
        <SectionTitle title="MY WRITEUPS" />
        <p className="text-center text-zinc-300 text-lg md:text-xl font-semibold mb-6">{posts.length} writeup{posts.length === 1 ? "" : "s"}</p>

        <div className="space-y-4 md:space-y-6">
          {posts.map((p) => (
            <div key={p.slug.join('/')} className="relative">
              {(() => { const d = getDifficulty(p.meta.difficulty, p.meta.tags); return d ? <span className={`absolute right-4 top-4 px-3 py-1 rounded-full text-xs font-bold z-10 ${d.cls}`}>{d.label}</span> : null; })()}
              <PostCard post={p} variant="list" showTags />
            </div>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}
