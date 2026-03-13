import { NextResponse } from "next/server";
import crypto from "node:crypto";

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export async function POST(req: Request) {
  const form = await req.formData();
  const submitted = String(form.get("password") || "");
  const expected = process.env.CTF_DRAFT_PASSWORD || "";

  if (!expected) {
    return NextResponse.redirect(new URL("/ctf-drafts?error=missing-config", req.url));
  }

  const ok = safeEqual(submitted, expected);
  const res = NextResponse.redirect(new URL(ok ? "/ctf-drafts" : "/ctf-drafts?error=invalid", req.url));

  if (ok) {
    res.cookies.set({
      name: "ctf_draft_access",
      value: "1",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return res;
}
