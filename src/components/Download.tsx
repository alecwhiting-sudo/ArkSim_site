"use client";

import { useEffect, useState } from "react";
import { basePath, site } from "@/lib/site";
import { IconApple, IconArrow, IconWindows } from "@/components/Icons";

type OS = "mac" | "windows" | "other";

function detectOS(): OS {
  if (typeof navigator === "undefined") return "other";
  const ua = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();
  if (/mac|iphone|ipad|ipod/.test(ua)) return "mac";
  if (/win/.test(ua)) return "windows";
  return "other";
}

/** Full URLs pass through; local /public paths get the site base path. */
function resolveHref(href: string): string {
  return /^https?:\/\//.test(href) ? href : `${basePath}${href}`;
}

const platforms = [
  {
    key: "mac" as const,
    name: "macOS",
    Icon: IconApple,
    href: resolveHref(site.downloads.mac.href),
    meta: site.downloads.mac.meta,
    note: site.downloads.mac.note,
  },
  {
    key: "windows" as const,
    name: "Windows",
    Icon: IconWindows,
    href: resolveHref(site.downloads.windows.href),
    meta: site.downloads.windows.meta,
    note: site.downloads.windows.note,
  },
];

export default function Download() {
  // Start "other" so server and first client render match; refine after mount.
  const [os, setOs] = useState<OS>("other");
  useEffect(() => {
    const id = requestAnimationFrame(() => setOs(detectOS()));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section id="download" className="mx-auto max-w-6xl px-5 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
          Get the app
        </div>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Download ArkSim for desktop
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
          The same simulator as a native desktop app — works offline, launches
          from your dock or taskbar. Free during beta.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
        {platforms.map((p) => {
          const recommended = os === p.key;
          return (
            <a
              key={p.key}
              href={p.href}
              className={`card card-hover flex flex-col items-center gap-3 p-8 text-center ${
                recommended ? "!border-[var(--accent)]" : ""
              }`}
            >
              <span
                className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border-strong)] bg-white/[0.03] ${
                  recommended ? "text-[var(--accent)]" : "text-[var(--foreground)]"
                }`}
              >
                <p.Icon width={28} height={28} />
              </span>

              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">
                  Download for {p.name}
                </span>
                {recommended && (
                  <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--accent)]">
                    Detected
                  </span>
                )}
              </div>

              <span className="text-xs text-[var(--muted-2)]">{p.meta}</span>

              <span className="btn-primary mt-2 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm">
                Download
                <IconArrow width={16} height={16} />
              </span>

              {p.note && (
                <span className="mt-1 max-w-[15rem] text-xs leading-relaxed text-[var(--muted-2)]">
                  {p.note}
                </span>
              )}
            </a>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-[var(--muted-2)]">
        Version {site.version} · Free during beta · macOS &amp; Windows
      </p>
    </section>
  );
}
