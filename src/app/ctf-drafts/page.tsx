import type { Metadata } from "next";
import crypto from "node:crypto";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { SectionTitle } from "@/components/SectionTitle";
import { getAllPosts } from "@/lib/posts";
import { DRAFT_ACCESS_COOKIE, hasDraftAccess } from "@/lib/drafts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Private CTF Drafts",
  robots: { index: false, follow: false },
};

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export default async function CtfDraftsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const unlocked = await hasDraftAccess();

  async function unlock(formData: FormData) {
    "use server";

    const submitted = String(formData.get("password") || "");
    const expected = process.env.CTF_DRAFT_PASSWORD || "";

    if (!expected) {
      redirect("/ctf-drafts?error=missing-config");
    }

    if (!safeEqual(submitted, expected)) {
      redirect("/ctf-drafts?error=invalid");
    }

    const store = await cookies();
    store.set({
      name: DRAFT_ACCESS_COOKIE,
      value: "1",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    redirect("/ctf-drafts");
  }

  if (!unlocked) {
    return (
      <SiteShell>
        <main className="flex-grow max-w-xl mx-auto w-full px-4 py-10 md:py-14">
          <SectionTitle title="CTF Draft Vault" />

          <div className="rounded-2xl border border-zinc-700 bg-zinc-900/70 p-6 md:p-8 space-y-5">
            <p className="text-zinc-300 text-sm leading-relaxed">
              Draft posts are locked. Drop the password and the vault opens. No fake login page circus, just the gate.
            </p>

            <form action={unlock} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm text-zinc-400 mb-2">
                  Draft password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoFocus
                  className="w-full rounded-lg border border-zinc-700 bg-black/40 px-4 py-3 text-white outline-none focus:border-zinc-400"
                  placeholder="Enter password"
                />
              </div>

              {params.error === "invalid" ? (
                <p className="text-sm text-red-400">Wrong password.</p>
              ) : null}
              {params.error === "missing-config" ? (
                <p className="text-sm text-red-400">CTF_DRAFT_PASSWORD is not configured on the server.</p>
              ) : null}

              <button
                type="submit"
                className="rounded-lg border border-zinc-600 bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white"
              >
                Unlock drafts
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
            Draft posts only. Hidden from public pages and blocked unless unlocked.
          </p>
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
