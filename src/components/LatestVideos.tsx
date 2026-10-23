"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Play } from "lucide-react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const instagramVideos = [
  "https://www.instagram.com/reel/DbWXtKGMwI4/",
  "https://www.instagram.com/reel/DbWiYWqMWel/",
  "https://www.instagram.com/reel/DbWeWVcsvkY/",
];

export default function LatestVideos() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const processEmbeds = () => window.instgrm?.Embeds.process();

        if (window.instgrm) {
          processEmbeds();
          return;
        }

        const scriptId = "instagram-embed-script";
        const existing = document.getElementById(scriptId);

        if (existing) {
          existing.addEventListener("load", processEmbeds, { once: true });
          return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.addEventListener("load", processEmbeds, { once: true });
        document.body.appendChild(script);
      },
      { rootMargin: "500px 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="videolar"
      className="border-b border-slate-200 bg-white py-14 sm:py-20"
    >
      <div className="container">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Son Videolar
            </h2>
            <span
              className="mt-2 block h-1 w-12 rounded-full bg-amber-500"
              aria-hidden="true"
            />
          </div>
          <a
            href="https://www.instagram.com/opelbeyinuzmani.comm/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-amber-600 sm:text-sm"
          >
            Instagram&apos;da Tümünü Gör
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {instagramVideos.map((permalink) => (
            <div
              key={permalink}
              className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <blockquote
                className="instagram-media min-w-0"
                data-instgrm-captioned="true"
                data-instgrm-permalink={permalink}
                data-instgrm-version="14"
                style={{
                  background: "#fff",
                  border: 0,
                  boxShadow: "none",
                  margin: 0,
                  maxWidth: "100%",
                  minWidth: 0,
                  padding: 0,
                  width: "100%",
                }}
              >
                <a
                  href={permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[280px] flex-col items-center justify-center gap-3 p-6 text-center transition-colors hover:bg-slate-50"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-slate-950">
                    <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    Instagram&apos;da izle
                  </span>
                  <span className="text-xs text-slate-500">
                    @opelbeyinuzmani.comm
                  </span>
                </a>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
