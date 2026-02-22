import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/SiteShell";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import { SectionTitle } from "@/components/SectionTitle";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

type HomeSearchParams = {
  q?: string;
  tag?: string;
  page?: string;
};

const WRITEUPS_PER_PAGE = 9;

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<HomeSearchParams>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const query = (params?.q || "").toLowerCase().trim();
  const tagFilter = (params?.tag || "").toLowerCase().trim();
  const requestedPage = Number(params?.page ?? "1");

  const posts = getAllPosts();
  const writeups = posts.filter((p) => (p.meta.type || "writeup") === "writeup");
  const projectList = posts.filter((p) => (p.meta.type || "writeup") === "project");
  const filteredWriteups = writeups.filter((p) => {
    const title = (p.meta.title || "").toLowerCase();
    const desc = (p.meta.description || "").toLowerCase();
    const tags = (p.meta.tags || []).map((t) => t.toLowerCase());

    const matchesQuery = !query || title.includes(query) || desc.includes(query) || tags.some((t) => t.includes(query));
    const matchesTag = !tagFilter || tags.includes(tagFilter);

    return matchesQuery && matchesTag;
  });

  const totalPages = Math.max(1, Math.ceil(filteredWriteups.length / WRITEUPS_PER_PAGE));
  const currentPage = Math.min(
    Math.max(Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1, 1),
    totalPages,
  );
  const start = (currentPage - 1) * WRITEUPS_PER_PAGE;
  const pagedWriteups = filteredWriteups.slice(start, start + WRITEUPS_PER_PAGE);

  function pageHref(page: number) {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.tag) qs.set("tag", params.tag);
    if (page > 1) qs.set("page", String(page));
    const s = qs.toString();
    return s ? `/?${s}` : "/";
  }

  return (
    <SiteShell>
      <main className="flex-grow">
        <div className="min-h-screen flex items-center justify-center max-w-7xl mx-auto">
          <main className="container mx-auto px-4 py-8">
            <div className="text-center mb-4">
              <h1 className="text-white/90 text-2xl md:text-4xl font-fustat leading-tight" dir="rtl">رَمَضَانُ كَرِيمٌ</h1>
            </div>

            <section className="h-[45vh] flex flex-col items-center justify-center mb-8">
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden transition-transform duration-200 ease-out" style={{ contain: "paint" as never }}>
                <Image
                  alt="Profile"
                  className="object-cover object-center"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1200px"
                  src="/mc/images/batman2.avif"
                />
              </div>
            </section>

            <section className="flex flex-col relative min-h-screen">
              <SectionTitle title="Blog" />

              <form method="get" className="w-full max-w-3xl mx-auto px-4 mb-8 z-30 relative">
                <input type="hidden" name="page" value="1" />
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      name="q"
                      defaultValue={params?.q ?? ""}
                      placeholder="Search posts..."
                      aria-label="Search blog posts"
                      className="w-full p-3 pl-10 rounded-lg border border-gray-700 bg-zinc-800/50 focus:bg-zinc-800 focus:border-white focus:outline-none transition-all text-white placeholder-gray-400"
                    />
                    <Image
                      alt=""
                      width={20}
                      height={20}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70"
                      style={{ filter: "invert(1)" }}
                      src="/mc/images/search.png"
                    />
                  </div><button type="submit" className="px-4 py-2 rounded-lg border border-gray-700 bg-zinc-800/50 text-gray-300 hover:border-gray-500">
                    Go
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 w-full pb-8">
                {filteredWriteups.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400 py-8">No writeups matched your filter.</div>
                ) : (
                  pagedWriteups.map((p) => (
                    <PostCard key={p.slug.join("/")} post={p} showCategory />
                  ))
                )}
              </div>

              {filteredWriteups.length > 0 && totalPages > 1 && (
                <nav className="max-w-7xl mx-auto px-4 w-full pb-12 flex items-center justify-center gap-2" aria-label="Writeups pagination">
                  <Link
                    href={pageHref(Math.max(1, currentPage - 1))}
                    className={"px-3 py-1 rounded border border-gray-700 text-sm " + (currentPage === 1 ? "pointer-events-none opacity-40" : "hover:border-gray-500")}
                  >
                    Prev
                  </Link>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={`page-${p}`}
                      href={pageHref(p)}
                      className={"px-3 py-1 rounded border text-sm " + (p === currentPage ? "border-white text-white" : "border-gray-700 text-gray-300 hover:border-gray-500")}
                    >
                      {p}
                    </Link>
                  ))}
                  <Link
                    href={pageHref(Math.min(totalPages, currentPage + 1))}
                    className={"px-3 py-1 rounded border border-gray-700 text-sm " + (currentPage === totalPages ? "pointer-events-none opacity-40" : "hover:border-gray-500")}
                  >
                    Next
                  </Link>
                </nav>
              )}
            </section>

            <section className="flex flex-col relative pb-16">
              <SectionTitle title="Projects" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 w-full">
                {projectList.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400 py-8">No projects yet.</div>
                ) : projectList.map((p) => (
                  <PostCard key={`project-${p.slug.join("/")}`} post={p} showCategory />
                ))}
              </div>
            </section>
          </main>
        </div>
      </main>
      <ScrollTopButton />
    </SiteShell>
  );
}

