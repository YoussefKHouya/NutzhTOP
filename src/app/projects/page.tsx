import { SiteShell } from "@/components/SiteShell";
import { SectionTitle } from "@/components/SectionTitle";
import { PostCard } from "@/components/PostCard";
import { getAllPosts } from "@/lib/posts";

export default function ProjectsPage() {
  const list = getAllPosts().filter((p) => (p.meta.type || "writeup") === "project");

  return (
    <SiteShell>
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-10 md:py-14">
        <SectionTitle title="PROJECTS" />

        {list.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No projects yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p) => (
              <PostCard key={p.slug.join("/")} post={p} showCategory />
            ))}
          </div>
        )}
      </main>
    </SiteShell>
  );
}
