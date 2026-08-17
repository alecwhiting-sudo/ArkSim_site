"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated hero visualisation: the SAME process shown Before vs After a
 * redesign, auto-transitioning between the two.
 *   - Before (baseline): more steps, extra rework loops, slower token flow.
 *   - After (target): a simpler path, no rework, faster flow.
 * Purely decorative. Clicking the Baseline/Target toggle takes manual control;
 * respects prefers-reduced-motion (renders a static "before" frame).
 */

type Mode = "before" | "after";

type Node = {
  id: string;
  x: number;
  y: number;
  w: number;
  label: string;
  kind: "activity" | "decision" | "control" | "end";
  beforeOnly?: boolean;
};

const NODES: Node[] = [
  { id: "intake", x: 70, y: 185, w: 96, label: "Intake", kind: "activity" },
  { id: "check", x: 214, y: 185, w: 110, label: "Check", kind: "decision" },
  { id: "work", x: 384, y: 110, w: 104, label: "Do work", kind: "activity" },
  { id: "qa", x: 540, y: 110, w: 116, label: "Quality", kind: "control" },
  {
    id: "info",
    x: 384,
    y: 262,
    w: 116,
    label: "Request info",
    kind: "activity",
    beforeOnly: true,
  },
  { id: "done", x: 636, y: 262, w: 92, label: "Finalize", kind: "end" },
];

const NODE_H = 46;

function n(id: string) {
  const node = NODES.find((x) => x.id === id)!;
  return { x: node.x, y: node.y };
}

type Edge = {
  pts: { x: number; y: number }[];
  dashed?: boolean;
  beforeOnly?: boolean;
};

const EDGES: Edge[] = [
  // Spine — present in both.
  { pts: [n("intake"), n("check")] },
  { pts: [n("check"), n("work")] },
  { pts: [n("work"), n("qa")] },
  { pts: [n("qa"), n("done")] },
  // Before-only: request-info branch + rework loops.
  { pts: [n("check"), n("info")], beforeOnly: true },
  { pts: [n("info"), { x: 300, y: 300 }, n("check")], dashed: true, beforeOnly: true },
  { pts: [n("qa"), { x: 462, y: 54 }, n("work")], dashed: true, beforeOnly: true },
];

// Blob routes (sequences of node ids).
const HAPPY = ["intake", "check", "work", "qa", "done"];
const ROUTE_INFO = ["intake", "check", "info", "check", "work", "qa", "done"];
const ROUTE_REWORK = ["intake", "check", "work", "qa", "work", "qa", "done"];

function routePoints(route: string[]) {
  return route.map((id) => n(id));
}

function buildPath(pts: { x: number; y: number }[]) {
  const segs: {
    a: { x: number; y: number };
    b: { x: number; y: number };
    len: number;
  }[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    segs.push({ a, b, len });
    total += len;
  }
  return {
    total,
    at(p: number) {
      let d = p * total;
      for (const s of segs) {
        if (d <= s.len || s === segs[segs.length - 1]) {
          const t = s.len === 0 ? 0 : d / s.len;
          return {
            x: s.a.x + (s.b.x - s.a.x) * t,
            y: s.a.y + (s.b.y - s.a.y) * t,
          };
        }
        d -= s.len;
      }
      return pts[pts.length - 1];
    },
  };
}

type BlobDef = {
  path: ReturnType<typeof buildPath>;
  offset: number;
  speed: number;
  hue: string;
};

const HUES = ["var(--accent)", "var(--accent-2)", "var(--accent-3)"];

// Per-mode blob population: before = many + slow + looping; after = fewer + fast + direct.
function buildDefs(mode: Mode): BlobDef[] {
  const defs: BlobDef[] = [];
  if (mode === "before") {
    const routes = [HAPPY, ROUTE_INFO, ROUTE_REWORK, ROUTE_INFO, ROUTE_REWORK];
    const count = 10;
    for (let i = 0; i < count; i++) {
      const route = routes[i % routes.length];
      defs.push({
        path: buildPath(routePoints(route)),
        offset: (i / count) % 1,
        speed: 0.045 + (i % 3) * 0.006, // slower
        hue: HUES[i % HUES.length],
      });
    }
  } else {
    const count = 6;
    for (let i = 0; i < count; i++) {
      defs.push({
        path: buildPath(routePoints(HAPPY)),
        offset: (i / count) % 1,
        speed: 0.14 + (i % 3) * 0.014, // faster
        hue: HUES[i % HUES.length],
      });
    }
  }
  return defs;
}

const CLOCK: Record<Mode, string> = {
  before: "06:18:40",
  after: "02:41:10",
};

export default function FlowSim() {
  const [mode, setMode] = useState<Mode>("before");
  const [blobs, setBlobs] = useState<
    { x: number; y: number; hue: string; o: number }[]
  >([]);

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const defsRef = useRef<BlobDef[]>([]);
  const interacted = useRef(false);

  // Rebuild the blob population whenever the mode changes.
  useEffect(() => {
    defsRef.current = buildDefs(mode);
  }, [mode]);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    defsRef.current = buildDefs(mode);

    if (reduce) {
      rafRef.current = requestAnimationFrame(() => {
        setBlobs(
          defsRef.current.map((b) => {
            const pt = b.path.at(b.offset);
            return { x: pt.x, y: pt.y, hue: b.hue, o: 0.9 };
          }),
        );
      });
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000;
      const next = defsRef.current.map((b) => {
        const p = (b.offset + elapsed * b.speed) % 1;
        const pt = b.path.at(p);
        const o = Math.min(1, Math.min(p, 1 - p) * 6 + 0.15);
        return { x: pt.x, y: pt.y, hue: b.hue, o };
      });
      setBlobs(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // Auto-transition between before/after until the user takes control.
    const iv = window.setInterval(() => {
      if (!interacted.current) {
        setMode((m) => (m === "before" ? "after" : "before"));
      }
    }, 4600);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.clearInterval(iv);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (m: Mode) => {
    interacted.current = true;
    setMode(m);
  };

  const isBefore = mode === "before";

  return (
    <div className="card relative w-full overflow-hidden p-3 sm:p-4">
      {/* faux app chrome */}
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 font-mono text-[11px] text-[var(--muted-2)]">
          arksim · invoice-approval
        </span>
        <span className="ml-auto flex items-center gap-2 font-mono text-[11px] text-[var(--muted)]">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
          sim clock {CLOCK[mode]}
        </span>
      </div>

      {/* Before / After toggle */}
      <div className="mb-3 flex items-center justify-center px-1">
        <div className="relative inline-grid grid-cols-2 rounded-full border border-[var(--border-strong)] bg-white/[0.03] p-1 text-xs font-medium">
          <span
            className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-[var(--accent)]/15 ring-1 ring-[var(--accent)]/40 transition-transform duration-500"
            style={{ transform: isBefore ? "translateX(4px)" : "translateX(calc(100% + 4px))" }}
            aria-hidden
          />
          <button
            type="button"
            onClick={() => pick("before")}
            className={`relative z-10 rounded-full px-4 py-1 transition-colors ${
              isBefore ? "text-[var(--accent)]" : "text-[var(--muted)]"
            }`}
          >
            Baseline
          </button>
          <button
            type="button"
            onClick={() => pick("after")}
            className={`relative z-10 rounded-full px-4 py-1 transition-colors ${
              !isBefore ? "text-[var(--accent)]" : "text-[var(--muted)]"
            }`}
          >
            Target
          </button>
        </div>
      </div>

      <svg
        viewBox="0 0 720 360"
        className="w-full"
        role="img"
        aria-label="Animated diagram comparing a business process before and after redesign, with work items flowing through it"
      >
        <defs>
          <radialGradient id="blobGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* edges */}
        <g
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth={1.5}
          strokeLinecap="round"
        >
          {EDGES.map((e, i) => {
            const d =
              e.pts.length === 3
                ? `M ${e.pts[0].x} ${e.pts[0].y} Q ${e.pts[1].x} ${e.pts[1].y} ${e.pts[2].x} ${e.pts[2].y}`
                : `M ${e.pts[0].x} ${e.pts[0].y} L ${e.pts[1].x} ${e.pts[1].y}`;
            const hidden = e.beforeOnly && !isBefore;
            return (
              <path
                key={i}
                d={d}
                strokeDasharray={e.dashed ? "5 6" : undefined}
                style={{
                  opacity: hidden ? 0 : 1,
                  transition: "opacity 0.55s ease",
                }}
              />
            );
          })}
        </g>

        {/* blobs */}
        <g filter="url(#softGlow)">
          {blobs.map((b, i) => (
            <circle
              key={i}
              cx={b.x}
              cy={b.y}
              r={7}
              fill="url(#blobGrad)"
              opacity={b.o}
              style={{ color: b.hue }}
            />
          ))}
        </g>

        {/* nodes */}
        <g>
          {NODES.map((node) => {
            const stroke =
              node.kind === "end"
                ? "var(--accent)"
                : node.kind === "decision"
                  ? "var(--accent-2)"
                  : node.kind === "control"
                    ? "var(--accent-3)"
                    : "rgba(255,255,255,0.28)";
            const hidden = node.beforeOnly && !isBefore;
            return (
              <g
                key={node.id}
                style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.55s ease" }}
              >
                <rect
                  x={node.x - node.w / 2}
                  y={node.y - NODE_H / 2}
                  width={node.w}
                  height={NODE_H}
                  rx={12}
                  fill="rgba(12,14,23,0.92)"
                  stroke={stroke}
                  strokeWidth={1.5}
                />
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={14}
                  fontWeight={600}
                  fill="var(--foreground)"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* cost readout — highlights the active side */}
      <div className="mt-3 grid grid-cols-3 gap-2 px-1 font-mono text-[11px]">
        <div
          className="rounded-lg border bg-white/[0.02] px-3 py-2 transition-colors duration-500"
          style={{
            borderColor: isBefore ? "var(--accent)" : "var(--border)",
            opacity: isBefore ? 1 : 0.55,
          }}
        >
          <div className="text-[var(--muted-2)]">Baseline</div>
          <div className="text-sm text-[var(--foreground)]">£48,900</div>
        </div>
        <div
          className="rounded-lg border bg-white/[0.02] px-3 py-2 transition-colors duration-500"
          style={{
            borderColor: !isBefore ? "var(--accent)" : "var(--border)",
            opacity: !isBefore ? 1 : 0.55,
          }}
        >
          <div className="text-[var(--muted-2)]">Target</div>
          <div className="text-sm text-[var(--accent)]">£19,300</div>
        </div>
        <div
          className="rounded-lg border border-[var(--border)] bg-white/[0.02] px-3 py-2 transition-opacity duration-500"
          style={{ opacity: !isBefore ? 1 : 0.55 }}
        >
          <div className="text-[var(--muted-2)]">Saving</div>
          <div className="text-sm text-[var(--accent)]">−61%</div>
        </div>
      </div>
    </div>
  );
}
