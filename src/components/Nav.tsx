"use client";

import { useState } from "react";
import { Logo } from "@/components/Icons";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#key-features", label: "Key features" },
  { href: "#compare", label: "Compare" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#download", label: "Download" },
  { href: "#pricing", label: "Pricing" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[rgba(6,7,13,0.72)] backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo className="h-7 w-auto" priority />
          <span className="text-lg font-semibold tracking-tight">ArkSim</span>
          <span className="ml-1 rounded-full border border-[var(--border-strong)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]">
            Beta
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#download"
            className="btn-primary rounded-lg px-4 py-2 text-sm"
          >
            Download
          </a>
        </div>

        <button
          className="btn-ghost rounded-lg p-2 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {open ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--border)] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#download"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 rounded-lg px-4 py-2.5 text-center text-sm"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
