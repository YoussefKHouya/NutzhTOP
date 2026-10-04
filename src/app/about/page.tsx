import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
};

const skills = ["PYTHON", "WEBEXPLOIT", "GAMING", "LEARNING"];

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="flex-grow">
        <div className="min-h-screen flex items-start justify-center max-w-7xl mx-auto">
          <section className="w-full max-w-6xl px-4 md:px-6 py-10 md:py-14">
            <h1 className="text-4xl md:text-5xl font-upheavtt text-white text-center mb-8 opacity-95">
              About Me
            </h1>

            <div className="rounded-xl border border-white/10 bg-[#111111]/70 backdrop-blur-sm px-6 py-10 md:px-10 md:py-14 min-h-[80vh] shadow-lg space-y-10">
              <div>
                <h2 className="text-xl md:text-2xl font-upheavtt text-white mb-3">Whoami</h2>
                <p className="text-gray-300 leading-8">
                  I&apos;m a curious and exploratory student learning cybersecurity step by step.
                  I enjoy understanding how systems work, breaking them in controlled labs,
                  and writing clear notes from each challenge.
                </p>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <h2 className="text-xl md:text-2xl font-upheavtt text-white mb-3">Website / Content</h2>
                <p className="text-gray-300 leading-8">
                  This blog is my personal archive of writeups, resources, and practical notes.
                  Everything here is focused on learning by doing, especially in web security,
                  networking, and penetration testing.
                </p>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <h2 className="text-xl md:text-2xl font-upheavtt text-white mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs md:text-sm px-3 py-1.5 rounded border border-zinc-600/80 bg-zinc-800/70 text-zinc-200 font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <h2 className="text-xl md:text-2xl font-upheavtt text-white mb-3">Privacy</h2>
                <p className="text-gray-300 leading-8">
                  This website does not track visitors and does not require sensitive personal
                  information.
                </p>
                <p className="text-white font-upheavtt mt-3">HAVE FUN!</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}


