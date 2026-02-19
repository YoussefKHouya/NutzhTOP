import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { getAllPosts } from "@/lib/posts";

export default function ProjectsPage() {
  const list = getAllPosts().filter((p) => (p.meta.type || "writeup") === "project");

  return (
    <SiteShell>
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-10 md:py-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center opacity-40 flex items-center justify-center font-upheavtt">
          <span className="w-8 md:w-16 h-px bg-gray-400 mr-4"></span>
          PROJECTS
          <span className="w-8 md:w-16 h-px bg-gray-400 ml-4"></span>
        </h2>

        <div className="space-y-4 md:space-y-6">
          {list.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No projects yet.</div>
        ) : list.map((p) => (
            <Link key={p.slug.join('/')} href={`/${p.slug.join('/')}`} className="block relative rounded-xl border border-white/10 bg-[#111111]/55 backdrop-blur-sm p-4 md:p-6 hover:bg-[#111111]/70 transition-colors">
              <h3 className="text-xl md:text-3xl font-bold text-white font-mono">{p.meta.title}</h3>
              <p className="text-gray-400 mt-1 text-sm">{p.meta.description ?? ''}</p>

              {!!p.meta.tags?.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.meta.tags.slice(0, 8).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded bg-zinc-700/80 text-zinc-200 border border-zinc-600/70">{tag}</span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </main>
    </SiteShell>
  );
}

