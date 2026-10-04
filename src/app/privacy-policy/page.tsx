import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Nutzh.top handles analytics and visitor data.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <main className="max-w-3xl mx-auto px-4 py-10 text-gray-200 leading-7">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4">
          We care about privacy. This website uses privacy-friendly analytics to understand traffic and improve content. Hope you enjoy your stay!
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">What we collect</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Page views</li>
          <li>Referrer source (where visitors come from)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">What we do NOT collect</h2>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>No names, emails, or personal profiles</li>
          <li>No passwords or sensitive form data</li>
          <li>No cross-site ad tracking</li>
          <li>No tracking of individual users</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-3">Analytics provider</h2>
        <p className="mb-4">
          I use Analytics to see if something is working well or needs improvement.
        </p>

        <p className="mt-8 text-sm text-gray-400">Nutzh Was Here, Last updated: 2026-02-24</p>
      </main>
    </SiteShell>
  );
}
