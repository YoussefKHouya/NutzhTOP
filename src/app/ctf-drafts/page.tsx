import Link from "next/link";
import { cookies } from "next/headers";
import { SiteShell } from "@/components/SiteShell";
import { SectionTitle } from "@/components/SectionTitle";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function CtfDraftsPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get("ctf_draft_access")?.value === "1";

  if (!hasAccess) {
    return (
      <SiteShell>
        <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-10 md:py-14">
          <SectionTitle title="CTF Draft Vault" />

          <div className="mx-auto max-w-md rounded-xl border border-zinc-700 bg-zinc-900/60 p-6">
            <p className="text-zinc-300 mb-4 text-sm">
              This page is private. Enter your drafts password to unlock unpublished CTF writeups.
            </p>

            {params?.error === "invalid" ? (
              <p className="mb-4 rounded border border-red-700 bg-red-950/40 p-2 text-sm text-red-300">
                Wrong password. Try again.
              </p>
            ) : null}

            {params?.error === "missing-config" ? (
              <p className="mb-4 rounded border border-amber-700 bg-amber-950/40 p-2 text-sm text-amber-300">
                Draft password is not configured yet (CTF_DRAFT_PASSWORD).
              </p>
            ) : null}

            <form method="post" action="/ctf-drafts/login" className="space-y-3">
              <input
                type="password"
                name="password"
                required
                placeholder="Draft password"
                className="w-full rounded-lg border border-zinc-600 bg-zinc-800/70 px-3 py-2 text-white placeholder-zinc-400 outline-none focus:border-white"
              />
              <button
                type="submit"
                className="w-full rounded-lg border border-zinc-500 bg-zinc-200 px-3 py-2 text-sm font-semibold text-black hover:bg-white"
              >
                Unlock Drafts
              </button>
            </form>
          </div>
        </main>
      </SiteShell>
    );
  }

  const drafts = getAllPosts({ includeDrafts: true }).filter((p) => p.meta.draft);

  return (
    <SiteShell>
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-10 md:py-14">
        <SectionTitle title="CTF Draft Vault" />

        <div className="mb-6 flex items-center justify-between">
          <p className="text-zinc-300 text-sm">
            Private draft posts only. Not listed on public pages or sitemap.
          </p>
          <form method="post" action="/ctf-drafts/logout">
            <button
              type="submit"
              className="rounded-lg border border-zinc-500 px-3 py-1.5 text-xs text-zinc-200 hover:border-zinc-300"
            >
              Lock
            </button>
          </form>
        </div>

        {drafts.length === 0 ? (
          <div className="text-center text-zinc-400 py-16">No draft posts found.</div>
        ) : (
          <div className="space-y-4">
            {drafts.map((post) => (
              <Link
                key={post.slug.join("/")}
                href={`/${post.slug.join("/")}`}
                className="block rounded-xl border border-zinc-700 bg-zinc-900/60 p-4 hover:border-zinc-400"
              >
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">{post.slug[0] ?? "post"}</p>
                <h3 className="text-lg font-bold text-white">{post.meta.title}</h3>
                <p className="text-sm text-zinc-400 mt-1">{post.meta.description || "No description yet."}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </SiteShell>
  );
}
