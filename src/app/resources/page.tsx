import { SiteShell } from "@/components/SiteShell";

export default function ResourcesPage() {
  return (
    <SiteShell>
      <main className="flex-grow flex items-center justify-center px-6 py-16">
        <section className="text-center">
          <h1 className="text-4xl font-upheavtt text-white">Resources</h1>
          <p className="mt-4 text-gray-300">I&apos;m working on this page. Trust me.</p>
          <img
            src="/mc/images/working.gif"
            alt="Under Construction"
            className="mx-auto mt-8"
          />
        </section>
      </main>
    </SiteShell>
  );
}
