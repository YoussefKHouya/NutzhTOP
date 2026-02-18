import { notFound } from "next/navigation";
import Link from "next/link";
import { MushroomShell } from "@/components/MushroomShell";
import { MDXContent } from "@/components/MDXContent";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import { PizzaWidget } from "@/components/PizzaWidget";
// floating widget disabled for parity cleanup
import { getAllPostSlugs, getPostBySlug, getAllPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
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
      <MushroomShell>
        <main className="flex-grow">
          <div className="max-w-4xl mx-auto">
            <article className="article-content">
              <div className="px-4 md:px-6">
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
                  {category ? (
                    <p className="text-zinc-400 text-xs uppercase tracking-widest mt-2">{category}</p>
                  ) : null}
                </div>

                {/* Lifted H1 (e.g., Arabic phrase) above image */}
                {liftedH1 ? (
                  <h1 className="text-center font-fustat text-2xl sm:text-4xl leading-tight my-6">{liftedH1}</h1>
                ) : null}

                {/* Cover image */}
                {post.meta.cover ? (
                  <div className="mb-8 md:mb-12">
                    <div className="cover-image">
                      <img alt={post.meta.title} className="w-full h-auto rounded-lg" src={post.meta.cover} />
                    </div>
                  </div>
                ) : null}

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
                          <Link 
                            className="hover:text-white hover:underline transition-colors" 
                            href={`/?tag=${encodeURIComponent(t.toLowerCase())}`}
                          >
                            {t}
                          </Link>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </article>

            {/* Related posts */}
            {related ? (
              <div className="mt-16 md:mt-24 px-4 md:px-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center opacity-40 flex items-center justify-center font-upheavtt">
                  <span className="w-8 md:w-16 h-px bg-gray-400 mr-4"></span>
                  You might also like
                  <span className="w-8 md:w-16 h-px bg-gray-400 ml-4"></span>
                </h2>
                <div className="relative max-w-md mx-auto">
                  <Link 
                    className="bg-[#111111] rounded-xl flex flex-col shadow-lg border-2 border-[#111111] transition-all duration-300 hover:shadow-xl group" 
                    href={`/${related.slug.join('/')}`}
                  >
                    <div className="relative w-full overflow-hidden rounded-t-xl">
                      <div className="absolute inset-0 bg-gradient-to-b from-[#14141480] via-transparent to-[#141414] z-10 rounded-t-xl group-hover:opacity-80 transition-opacity duration-300"></div>
                      <img 
                        alt={related.meta.title} 
                        className="rounded-t-xl w-full object-cover h-48 transition-transform duration-500 group-hover:scale-105 brightness-[0.85] contrast-[1.1]" 
                        src={related.meta.cover ?? '/mc/images/tokyo.jpg'} 
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-center mb-2">
                        <p className="text-zinc-500 text-xs font-mono tracking-widest">
                          {new Date(related.meta.date).toLocaleDateString('en-GB', {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="mb-2">
                        <h2 className="text-2xl font-semibold mb-1 transition-colors duration-300 text-gray-100 group-hover:text-white text-center">
                          {related.meta.title}
                        </h2>
                      </div>
                      <p className="text-gray-300 text-sm font-medium leading-relaxed text-center">
                        {related.meta.description ?? ''}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            ) : null}


            {/* Bottom character/widget */}
            <PizzaWidget />
          </div>
        </main>
        <ScrollTopButton />
      </MushroomShell>
    );
  } catch {
    return notFound();
  }
}
