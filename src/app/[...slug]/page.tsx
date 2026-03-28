import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { MDXContent } from "@/components/MDXContent";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import { ClickToZoomImage } from "@/components/ClickToZoomImage";
import { SectionTitle } from "@/components/SectionTitle";
import { PostCard } from "@/components/PostCard";
import { TableOfContents } from "@/components/TableOfContents";
import { DraggableToc } from "@/components/DraggableToc";
import { ReadProgressFooter } from "@/components/ReadProgressFooter";
import { PinnedCodeProvider } from "@/components/PinnedCodeProvider";
// floating widget disabled for parity cleanup
import { getAllPostSlugs, getPostBySlug, getAllPosts } from "@/lib/posts";
import { hasDraftAccess } from "@/lib/drafts";

export const dynamic = "force-dynamic";

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

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug, { includeDrafts: true });

    if (post.meta.draft && !(await hasDraftAccess())) {
      return notFound();
    }

    const coverSrc = (post.meta.cover || "").trim() || "/mc/images/batman2.avif";
    const related = getAllPosts()
      .filter((p) => p.slug.join('/') !== slug.join('/'))
      .slice(0, 2);

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

                      {/* Lifted H1 (e.g., Arabic phrase) above image */}
                      {liftedH1 ? (
                        <h1 className="text-center font-fustat text-2xl sm:text-4xl leading-tight my-6">{liftedH1}</h1>
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


