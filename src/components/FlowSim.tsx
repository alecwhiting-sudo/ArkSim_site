"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated hero visualisation: a small business process with discrete "tokens
 * of light" flowing through it — the same metaphor ArkSim uses in the app.
 * Purely decorative. Falls back to a static frame when the user prefers
 * reduced motion.
 */

type Node = {
  id: string;
  x: number;
  y: number;
  w: number;
  label: string;
  kind: "activity" | "decision" | "control" | "end";
};

const NODES: Node[] = [
  { id: "intake", x: 70, y: 185, w: 96, label: "Intake", kind: "activity" },
  { id: "check", x: 214, y: 185, w: 110, label: "Check", kind: "decision" },
  { id: "work", x: 384, y: 110, w: 104, label: "Do work", kind: "activity" },
  { id: "qa", x: 540, y: 110, w: 116, label: "Quality", kind: "control" },
  { id: "info", x: 384, y: 262, w: 116, label: "Request info", kind: "activity" },
  { id: "done", x: 636, y: 262, w: 92, label: "Finalize", kind: "end" },
];

const NODE_H = 46;

function n(id: string) {
  const node = NODES.find((x) => x.id === id)!;
  return { x: node.x, y: node.y };
}

// Edges as ordered point lists (support a mid control point for curves).
type Edge = { pts: { x: number; y: number }[]; dashed?: boolean };

const EDGES: Edge[] = [
  { pts: [n("intake"), n("check")] },
  { pts: [n("check"), n("work")] },
  { pts: [n("check"), n("info")] },
  { pts: [n("info"), n("work")] },
  { pts: [n("work"), n("qa")] },
  // rework loop QA -> work (curved above)
  { pts: [n("qa"), { x: 462, y: 56 }, n("work")], dashed: true },
  { pts: [n("qa"), n("done")] },
];

// Routes the blobs travel (sequences of node ids).
const ROUTES: string[][] = [
  ["intake", "check", "work", "qa", "done"],
  ["intake", "check", "info", "work", "qa", "done"],
  ["intake", "check", "work", "qa", "work", "qa", "done"], // rework
];

function routePoints(route: string[]) {
  return route.map((id) => n(id));
}

// Total length of a polyline and a sampler for a position at param p in [0,1].
function buildPath(pts: { x: number; y: number }[]) {
  const segs: { a: { x: number; y: number }; b: { x: number; y: number }; len: number }[] = [];
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
          return { x: s.a.x + (s.b.x - s.a.x) * t, y: s.a.y + (s.b.y - s.a.y) * t };
        }
        d -= s.len;
      }
      return pts[pts.length - 1];
    },
  };
}

type Blob = {
  path: ReturnType<typeof buildPath>;
  offset: number; // start phase 0..1
  speed: number; // fraction per second
  hue: string;
};

const HUES = ["var(--accent)", "var(--accent-2)", "var(--accent-3)"];

export default function FlowSim() {
  const [blobs, setBlobs] = useState<{ x: number; y: number; hue: string; o: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const defsRef = useRef<Blob[]>([]);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Build a spread of blobs across the three routes.
    const defs: Blob[] = [];
    for (let i = 0; i < 9; i++) {
      const route = ROUTES[i % ROUTES.length];
      defs.push({
        path: buildPath(routePoints(route)),
        offset: (i / 9) % 1,
        speed: 0.08 + (i % 3) * 0.012,
        hue: HUES[i % HUES.length],
      });
    }
    defsRef.current = defs;

    if (reduce) {
      // Static: place each blob at its offset, no animation. Deferred to a
      // frame so we don't call setState synchronously inside the effect body.
      rafRef.current = requestAnimationFrame(() => {
        setBlobs(
          defs.map((b) => {
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
        // Fade in/out near the ends so blobs don't pop.
        const o = Math.min(1, Math.min(p, 1 - p) * 6 + 0.15);
        return { x: pt.x, y: pt.y, hue: b.hue, o };
      });
      setBlobs(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
          running · sim clock 03:12:40
        </span>
      </div>

      <svg
        viewBox="0 0 720 360"
        className="w-full"
        role="img"
        aria-label="Animated diagram of a business process with work items flowing through it"
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
            return (
              <path
                key={i}
                d={d}
                strokeDasharray={e.dashed ? "5 6" : undefined}
              />
            );
          })}
        </g>

        {/* blobs (drawn under nodes so nodes stay readable) */}
        <g filter="url(#softGlow)">
          {blobs.map((b, i) => (
            <circle
              key={i}
              cx={b.x}
              cy={b.y}
              r={7}
              fill="url(#blobGrad)"
              color={b.hue}
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
            return (
              <g key={node.id}>
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

      {/* mini cost readout */}
      <div className="mt-3 grid grid-cols-3 gap-2 px-1 font-mono text-[11px]">
        <div className="rounded-lg border border-[var(--border)] bg-white/[0.02] px-3 py-2">
          <div className="text-[var(--muted-2)]">Baseline</div>
          <div className="text-sm text-[var(--foreground)]">£48,900</div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white/[0.02] px-3 py-2">
          <div className="text-[var(--muted-2)]">Target</div>
          <div className="text-sm text-[var(--accent)]">£19,300</div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-white/[0.02] px-3 py-2">
          <div className="text-[var(--muted-2)]">Saving</div>
          <div className="text-sm text-[var(--accent)]">−61%</div>
        </div>
      </div>
    </div>
  );
}
