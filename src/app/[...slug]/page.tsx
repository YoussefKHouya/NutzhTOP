import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { MDXContent } from "@/components/MDXContent";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import { ClickToZoomImage } from "@/components/ClickToZoomImage";
import { SectionTitle } from "@/components/SectionTitle";
import { PostCard } from "@/components/PostCard";
import { DraggableToc } from "@/components/DraggableToc";
import { ReadProgressFooter } from "@/components/ReadProgressFooter";
import { PinnedCodeProvider } from "@/components/PinnedCodeProvider";
// floating widget disabled for parity cleanup
import { getAllPostSlugs, getPostBySlug, getAllPosts } from "@/lib/posts";
import { hasDraftAccess } from "@/lib/drafts";

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

function getRelatedPosts(current: ReturnType<typeof getPostBySlug>, limit = 2) {
  const currentSlug = current.slug.join("/");
  const currentTags = new Set((current.meta.tags || []).map((tag) => tag.toLowerCase()));
  const currentRoot = current.slug[0]?.toLowerCase() || "";
  const currentPlatform = (current.meta.platform || "").toLowerCase();

  return getAllPosts()
    .filter((post) => post.slug.join("/") !== currentSlug)
    .map((post) => {
      const tagScore = (post.meta.tags || []).reduce(
        (score, tag) => score + (currentTags.has(tag.toLowerCase()) ? 4 : 0),
        0,
      );
      const samePlatform = currentPlatform && (post.meta.platform || "").toLowerCase() === currentPlatform ? 2 : 0;
      const sameRoot = currentRoot && post.slug[0]?.toLowerCase() === currentRoot ? 1 : 0;
      const dateScore = Math.max(0, Date.parse(post.meta.date || "") || 0) / 1_000_000_000_000;

      return { post, score: tagScore + samePlatform + sameRoot + dateScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

function getSeoTitle(slug: string[], title: string, type?: string) {
  if (type === "project" || slug[0] === "projects") return `${title} Security Project`;

  const category = slug[0]?.toLowerCase();
  const labels: Record<string, string> = {
    "hack-the-box": "Hack The Box Writeup",
    hackmyvm: "HackMyVM Writeup",
    "try-hack-me": "TryHackMe Writeup",
    vulnyx: "Vulnyx Writeup",
    vulnvm: "VulnVM Writeup",
    payload: "Security Research",
  };

  return `${title} ${labels[category] || "CTF Writeup"}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug, { includeDrafts: true });
    const canonicalPath = `/${slug.join("/")}`;

    return {
      title: getSeoTitle(slug, post.meta.title, post.meta.type),
      alternates: { canonical: canonicalPath },
      robots: post.meta.draft ? { index: false, follow: false } : undefined,
    };
  } catch {
    return {
      title: "Page Not Found",
      robots: { index: false, follow: false },
    };
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug, { includeDrafts: true });

    if (post.meta.draft && !(await hasDraftAccess())) {
      return notFound();
    }

    const coverSrc = (post.meta.cover || "").trim() || "/mc/images/batman2.avif";
    const related = getRelatedPosts(post, 2);

    // Dynamic category from path (e.g., /ctf/slug => ctf)
    const category = slug[0] ?? "";

    // Lift first markdown H1 (even if content starts with blank lines) above cover image
    let liftedH1 = "";
    let contentForRender = post.content;
    const h1BlockMatch = post.content.match(/^\s*#\s+(.+)\r?\n?/);
    if (h1BlockMatch) {
      liftedH1 = h1BlockMatch[1].trim();
      contentForRender = post.content.replace(/^\s*#\s+.+\r?\n?/, "");
    }

    return (
      <PinnedCodeProvider>
        <SiteShell>
          <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
              <div className="max-w-4xl mx-auto">
                <div className="min-w-0">
                  <article className="article-content">
                    <div>
                      {/* Header section */}
                      <div className="flex flex-col items-center my-12 md:my-16">
                        <div className="flex justify-center mb-3">
                          <p className="text-zinc-500 text-xs font-mono tracking-widest">
                            {formatDisplayDate(post.meta.date)}
                          </p>
                        </div>
                        <div className="mb-4 text-center">
                          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center normal-font text-white">
                            {post.meta.title}
                          </h1>
                        </div>
                        {post.meta.description ? (
                          <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed text-center max-w-2xl mb-2">
                            {post.meta.description}
                          </p>
                        ) : null}
                        {category ? <p className="text-zinc-400 text-xs uppercase tracking-widest mt-2">{category}</p> : null}
                      </div>

                      {/* Decorative opening phrase, kept outside the document heading hierarchy */}
                      {liftedH1 ? (
                        <p lang="ar" dir="rtl" className="text-center font-fustat text-2xl sm:text-4xl leading-tight my-6">
                          {liftedH1}
                        </p>
                      ) : null}

                      {/* Cover image */}
                      <div className="mb-8 md:mb-12">
                        <div className="cover-image">
                          <ClickToZoomImage
                            alt={post.meta.title}
                            className="w-full h-auto rounded-lg"
                            src={coverSrc}
                            fallbackSrc="/mc/images/batman2.avif"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="prose prose-invert max-w-none">
                        <MDXContent source={contentForRender} />
                      </div>

                      {/* Tags */}
                      {post.meta.tags?.length ? (
                        <div className="mt-12 pt-8 border-t border-gray-800">
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                            <span className="opacity-60">Tags:</span>
                            {post.meta.tags.map((t, idx) => (
                              <span key={t} className="flex items-center">
                                {idx > 0 && <span className="mx-1 opacity-40">|</span>}
                                <Link className="hover:text-white hover:underline transition-colors" href={`/?tag=${encodeURIComponent(t.toLowerCase())}`}>
                                  {t}
                                </Link>
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </article>

                  {related.length ? (
                    <div className="mt-16 md:mt-24 px-4 md:px-6">
                      <SectionTitle title="You might also like" className="mb-8 md:mb-12" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {related.map((item) => (
                          <div key={item.slug.join('/')} className="relative">
                            <PostCard post={item} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

              </div>

              <DraggableToc />
            </div>
            <ReadProgressFooter />
          </main>
          <ScrollTopButton />
        </SiteShell>
      </PinnedCodeProvider>
    );
  } catch {
    return notFound();
  }
}


