import Link from "next/link";
import { MushroomShell } from "@/components/MushroomShell";
import { ScrollTopButton } from "@/components/ScrollTopButton";
import { getAllPosts } from "@/lib/posts";

type HomeSearchParams = {
  q?: string;
  tag?: string;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<HomeSearchParams>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const query = (params?.q || "").toLowerCase().trim();
  const tagFilter = (params?.tag || "").toLowerCase().trim();

  const posts = getAllPosts();
  const writeups = posts.filter((p) => (p.meta.type || "writeup") === "writeup");
  const projectList = posts.filter((p) => (p.meta.type || "writeup") === "project");

  const allTags = Array.from(new Set(writeups.flatMap((p) => p.meta.tags || []).map((t) => t.toLowerCase()))).sort();

  const filteredWriteups = writeups.filter((p) => {
    const title = (p.meta.title || "").toLowerCase();
    const desc = (p.meta.description || "").toLowerCase();
    const tags = (p.meta.tags || []).map((t) => t.toLowerCase());

    const matchesQuery = !query || title.includes(query) || desc.includes(query) || tags.some((t) => t.includes(query));
    const matchesTag = !tagFilter || tags.includes(tagFilter);

    return matchesQuery && matchesTag;
  });

  return (
    <MushroomShell>
      <main className="flex-grow">
        <div className="min-h-screen flex items-center justify-center max-w-7xl mx-auto">
          <main className="container mx-auto px-4 py-8">
            <section className="h-[45vh] flex flex-col items-center justify-center mb-8">
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden transition-transform duration-200 ease-out" style={{ contain: "paint" as never }}>
                <img
                  alt="Profile"
                  className="object-cover object-center"
                  style={{ position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0 }}
                  src="/mc/images/tokyo.jpg"
                />
              </div>
            </section>

            <section className="flex flex-col relative min-h-screen">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center opacity-40 flex items-center justify-center font-upheavtt">
                <span className="w-8 md:w-16 h-px bg-gray-400 mr-4" />Blog
                <span className="w-8 md:w-16 h-px bg-gray-400 ml-4" />
              </h2>

              <form method="get" className="w-full max-w-3xl mx-auto px-4 mb-8 z-30 relative">
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
                    <img alt="" width={20} height={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-70" style={{ filter: "invert(1)" }} src="/mc/images/search.png" />
                  </div>
                  <select
                    name="tag"
                    defaultValue={params?.tag ?? ""}
                    aria-label="Filter by tag"
                    className="px-3 py-2 rounded-lg border border-gray-700 bg-zinc-800/50 text-gray-300 hover:border-gray-500"
                  >
                    <option value="">All tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="px-4 py-2 rounded-lg border border-gray-700 bg-zinc-800/50 text-gray-300 hover:border-gray-500">
                    Go
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 w-full pb-12">
                {filteredWriteups.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400 py-8">No writeups matched your filter.</div>
                ) : (
                  filteredWriteups.map((p) => (
                    <Link key={p.slug.join("/")} className="bg-[#111111] rounded-xl flex flex-col shadow-lg border-2 border-[#111111] transition-all duration-300 hover:shadow-xl group" href={`/${p.slug.join("/")}`}>
                      <div className="relative w-full overflow-hidden rounded-t-xl">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#14141480] via-transparent to-[#141414] z-10 rounded-t-xl group-hover:opacity-80 transition-opacity duration-300" />
                        <img alt={p.meta.title} className="rounded-t-xl w-full object-cover h-48 transition-transform duration-500 group-hover:scale-105 brightness-[0.85] contrast-[1.1]" src={p.meta.cover ?? "/mc/images/tokyo.jpg"} />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-center mb-2">
                          <p className="text-zinc-500 text-xs font-mono tracking-widest">{new Date(p.meta.date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })}</p>
                        </div>
                        <div className="mb-2">
                          <h2 className="text-2xl font-semibold mb-1 transition-colors duration-300 text-gray-100 group-hover:text-white text-center">{p.meta.title}</h2>
                          <p className="text-gray-400 text-xs uppercase tracking-widest text-center">{p.slug[0] ?? "post"}</p>
                        </div>
                        <p className="text-gray-300 text-sm font-medium leading-relaxed text-center">{p.meta.description ?? ""}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>

            <section className="flex flex-col relative pb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center opacity-40 flex items-center justify-center font-upheavtt">
                <span className="w-8 md:w-16 h-px bg-gray-400 mr-4" />Projects
                <span className="w-8 md:w-16 h-px bg-gray-400 ml-4" />
              </h2>
              <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto px-4 w-full">
                {projectList.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">No projects yet.</div>
                ) : projectList.map((p) => (
                  <Link key={`project-${p.slug.join("/")}`} href={`/${p.slug.join("/")}`} className="block relative rounded-xl border border-white/10 bg-[#111111]/55 backdrop-blur-sm p-4 md:p-6 hover:bg-[#111111]/70 transition-colors">
                    <h3 className="text-xl md:text-3xl font-bold text-white font-mono">{p.meta.title}</h3>
                    <p className="text-gray-400 mt-1 text-sm">{p.meta.description ?? ""}</p>
                    {!!p.meta.tags?.length && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.meta.tags.slice(0, 8).map((tag) => (
                          <span key={`${p.slug.join('/')}-${tag}`} className="text-xs px-2 py-1 rounded bg-zinc-700/80 text-zinc-200 border border-zinc-600/70">{tag}</span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          </main>
        </div>
      </main>
      <ScrollTopButton />
    </MushroomShell>
  );
}