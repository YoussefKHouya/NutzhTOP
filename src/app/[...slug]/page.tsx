import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { MDXContent } from "@/components/MDXContent";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import { PizzaWidget } from "@/components/PizzaWidget";
import { ClickToZoomImage } from "@/components/ClickToZoomImage";
import { SectionTitle } from "@/components/SectionTitle";
import { PostCard } from "@/components/PostCard";
import { TableOfContents } from "@/components/TableOfContents";
import { ReadProgressFooter } from "@/components/ReadProgressFooter";
import { PinnedCodeProvider } from "@/components/PinnedCodeProvider";
// floating widget disabled for parity cleanup
import { getAllPostSlugs, getPostBySlug, getAllPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    const coverSrc = (post.meta.cover || "").trim() || "/mc/images/batman2.avif";
    const related = getAllPosts().find((p) => p.slug.join('/') !== slug.join('/'));

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
                            {new Date(post.meta.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })}
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

                  {related ? (
                    <div className="mt-16 md:mt-24 px-4 md:px-6">
                      <SectionTitle title="You might also like" className="mb-8 md:mb-12" />
                      <div className="relative max-w-md mx-auto">
                        <PostCard post={related} />
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="md:hidden mt-8">
                  <TableOfContents />
                </div>
              </div>

              <div className="hidden md:block fixed left-10 lg:left-14 xl:left-20 top-28 w-[220px] lg:w-[240px] z-40">
                <TableOfContents />
              </div>

              {/* Bottom character/widget */}
              <PizzaWidget />
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
