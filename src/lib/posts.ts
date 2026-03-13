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
  draft?: boolean;
};

export type Post = {
  slug: string[];
  meta: PostMeta;
  content: string;
};

type PostQueryOptions = {
  includeDrafts?: boolean;
};

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const DEFAULT_COVER = "/mc/images/batman2.avif";

function normalizeCover(rawCover: string | undefined): string | undefined {
  const cover = (rawCover || "").trim();
  if (!cover) return undefined;

  if (/^https?:\/\//i.test(cover)) return cover;

  const normalized = cover.startsWith("/") ? cover : `/${cover}`;
  const cleaned = normalized.split("?")[0].split("#")[0];
  const localFile = path.join(PUBLIC_DIR, cleaned.replace(/^\/+/, ""));

  return fs.existsSync(localFile) ? normalized : undefined;
}

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

export function getAllPostSlugs(options: PostQueryOptions = {}): string[][] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const out: string[][] = [];

  function walk(dir: string, prefix: string[] = []) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.isDirectory()) walk(path.join(dir, ent.name), [...prefix, ent.name]);
      if (ent.isFile() && ent.name.endsWith(".mdx") && !ent.name.startsWith("_")) {
        const slug = [...prefix, ent.name.replace(/\.mdx$/, "")];

        if (options.includeDrafts) {
          out.push(slug);
          continue;
        }

        const filePath = path.join(CONTENT_DIR, ...slug) + ".mdx";
        const raw = fs.readFileSync(filePath, "utf8");
        const { data } = matter(raw);
        const isDraft = Boolean(data?.draft);
        if (!isDraft) out.push(slug);
      }
    }
  }

  walk(CONTENT_DIR);
  return out;
}

export function getPostBySlug(slug: string[], options: PostQueryOptions = {}): Post {
  const file = path.join(CONTENT_DIR, ...slug) + ".mdx";
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  const isDraft = Boolean(data?.draft);
  if (isDraft && !options.includeDrafts) {
    throw new Error("Draft post is private");
  }

  const rawCover = (data.cover as string | undefined) ?? (data.image as string | undefined);
  const meta: PostMeta = {
    title: (data.title as string) ?? slug.at(-1) ?? "Untitled",
    date: (data.date as string) ?? new Date().toISOString(),
    description: (data.description as string) ?? (data.excerpt as string) ?? undefined,
    tags: (data.tags as string[] | undefined) ?? [],
    cover: normalizeCover(rawCover) ?? DEFAULT_COVER,
    difficulty: (data.difficulty as string | undefined)?.toLowerCase(),
    type: ((data.type as string | undefined) ?? "writeup").toLowerCase(),
    platform: normalizePlatform(data.platform as string | undefined, slug),
    draft: isDraft,
  };

  return { slug, meta, content };
}

export function getAllPosts(options: PostQueryOptions = {}): Post[] {
  const slugs = getAllPostSlugs(options);
  const posts = slugs
    .map((s) => getPostBySlug(s, { includeDrafts: true }))
    .filter((p) => options.includeDrafts || !p.meta.draft);

  posts.sort((a, b) => {
    const ta = Date.parse(a.meta.date || "");
    const tb = Date.parse(b.meta.date || "");
    const va = Number.isNaN(ta) ? 0 : ta;
    const vb = Number.isNaN(tb) ? 0 : tb;
    return vb - va;
  });
  return posts;
}
