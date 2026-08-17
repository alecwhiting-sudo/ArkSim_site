"use client";

import { useEffect, useState } from "react";
import { DOWNLOAD_UNLOCK_COOKIE, basePath, site } from "@/lib/site";
import { IconApple, IconArrow, IconCheck, IconWindows } from "@/components/Icons";

type OS = "mac" | "windows" | "other";

function detectOS(): OS {
  if (typeof navigator === "undefined") return "other";
  const ua = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();
  if (/mac|iphone|ipad|ipod/.test(ua)) return "mac";
  if (/win/.test(ua)) return "windows";
  return "other";
}

function hasUnlockCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${DOWNLOAD_UNLOCK_COOKIE}=1`));
}

const platforms = [
  {
    key: "mac" as const,
    name: "macOS",
    Icon: IconApple,
    // Routed through /download/mac (see src/app/download/[platform]/route.ts)
    // so the button never shows/leaks the underlying GitHub Release URL.
    href: `${basePath}/download/mac`,
    meta: site.downloads.mac.meta,
    note: site.downloads.mac.note,
    helpSteps: undefined as readonly string[] | undefined,
  },
  {
    key: "windows" as const,
    name: "Windows",
    Icon: IconWindows,
    href: `${basePath}/download/windows`,
    meta: site.downloads.windows.meta,
    note: site.downloads.windows.note,
    helpSteps: site.downloads.windows.helpSteps as readonly string[] | undefined,
  },
];

type GateStatus = "idle" | "sending" | "error";

export default function Download() {
  // Start "other"/locked so server and first client render match; refine after mount.
  const [os, setOs] = useState<OS>("other");
  const [unlocked, setUnlocked] = useState(false);
  const [gateStatus, setGateStatus] = useState<GateStatus>("idle");
  const [gateError, setGateError] = useState("");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setOs(detectOS());
      setUnlocked(hasUnlockCookie());
    });
    return () => cancelAnimationFrame(id);
  }, []);

  async function onGateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setGateStatus("sending");
    setGateError("");
    try {
      const res = await fetch(`${basePath}/api/download-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          company: fd.get("company"), // honeypot
          platform: os,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setGateError(data.error || "Something went wrong. Please try again.");
        setGateStatus("error");
        return;
      }
      setUnlocked(true);
    } catch {
      setGateError("Network error. Please try again.");
      setGateStatus("error");
    }
  }

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

      {!unlocked ? (
        <form
          onSubmit={onGateSubmit}
          className="card mx-auto mt-12 max-w-md p-8 text-center"
          noValidate
        >
          <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>
              Company
              <input type="text" name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <h3 className="text-lg font-semibold">Enter your email to download</h3>
          <p className="mt-1.5 text-sm text-[var(--muted)]">
            We&rsquo;ll only use it to keep you posted on ArkSim. No spam.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className="w-full flex-1 rounded-lg border border-[var(--border-strong)] bg-white/[0.02] px-3.5 py-2.5 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-2)] transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40"
            />
            <button
              type="submit"
              disabled={gateStatus === "sending"}
              className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
            >
              {gateStatus === "sending" ? "Please wait…" : "Continue"}
              {gateStatus !== "sending" && <IconArrow width={16} height={16} />}
            </button>
          </div>

          {gateStatus === "error" && (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
              {gateError}
            </p>
          )}
        </form>
      ) : (
        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          {platforms.map((p) => {
            const recommended = os === p.key;
            return (
              <div
                key={p.key}
                className={`card card-hover flex flex-col items-center gap-3 p-8 text-center ${
                  recommended ? "!border-[var(--accent)]" : ""
                }`}
              >
                <a href={p.href} className="flex w-full flex-col items-center gap-3">
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

                {p.helpSteps && (
                  <details className="mt-1 w-full text-left">
                    <summary className="cursor-pointer text-center text-xs text-[var(--muted-2)] underline decoration-dotted underline-offset-4 hover:text-[var(--foreground)]">
                      Trouble opening it?
                    </summary>
                    <ol className="mt-2.5 list-decimal space-y-2 pl-4 text-xs leading-relaxed text-[var(--muted-2)]">
                      {p.helpSteps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}

      {unlocked && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-sm text-[var(--accent)]">
          <IconCheck width={14} height={14} />
          Access unlocked
        </p>
      )}

      <p className="mt-6 text-center text-sm text-[var(--muted-2)]">
        Version {site.version} · Free during beta · macOS &amp; Windows
      </p>
    </section>
  );
}
