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

        <div className="space-y-4 md:space-y-6">
          {list.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No projects yet.</div>
        ) : list.map((p) => (
            <PostCard key={p.slug.join('/')} post={p} variant="list" showTags />
          ))}
        </div>
      </main>
    </SiteShell>
  );
}

