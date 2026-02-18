import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  title: string;
  date: string; // ISO
  description?: string;
  tags?: string[];
  cover?: string;
  difficulty?: "easy" | "medium" | "hard" | string;
  type?: "writeup" | "project" | string;
  platform?: "ctf" | "hackthebox" | "tryhackme" | "other" | string;
};

export type Post = {
  slug: string[];
  meta: PostMeta;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function normalizePlatform(rawPlatform: string | undefined, slug: string[]): PostMeta["platform"] {
  const p = (rawPlatform || "").toLowerCase().trim();
  if (p) {
    if (["htb", "hack-the-box", "hack_the_box"].includes(p)) return "hackthebox";
    if (["thm", "try-hack-me", "try_hack_me"].includes(p)) return "tryhackme";
    return p;
  }

  const root = (slug[0] || "").toLowerCase();
  if (root === "ctf") return "ctf";
  if (["hackthebox", "hack-the-box", "htb"].includes(root)) return "hackthebox";
  if (["tryhackme", "try-hack-me", "thm"].includes(root)) return "tryhackme";
  return "other";
}

export function getAllPostSlugs(): string[][] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const out: string[][] = [];

  function walk(dir: string, prefix: string[] = []) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.isDirectory()) walk(path.join(dir, ent.name), [...prefix, ent.name]);
      if (ent.isFile() && ent.name.endsWith(".mdx") && !ent.name.startsWith("_")) {
        out.push([...prefix, ent.name.replace(/\.mdx$/, "")]);
      }
    }
  }

  walk(CONTENT_DIR);
  return out;
}

export function getPostBySlug(slug: string[]): Post {
  const file = path.join(CONTENT_DIR, ...slug) + ".mdx";
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  const meta: PostMeta = {
    title: (data.title as string) ?? slug.at(-1) ?? "Untitled",
    date: (data.date as string) ?? new Date().toISOString(),
    description: data.description as string | undefined,
    tags: (data.tags as string[] | undefined) ?? [],
    cover: data.cover as string | undefined,
    difficulty: (data.difficulty as string | undefined)?.toLowerCase(),
    type: ((data.type as string | undefined) ?? "writeup").toLowerCase(),
    platform: normalizePlatform(data.platform as string | undefined, slug),
  };

  return { slug, meta, content };
}

export function getAllPosts(): Post[] {
  const slugs = getAllPostSlugs();
  const posts = slugs.map((s) => getPostBySlug(s));
  posts.sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));
  return posts;
}