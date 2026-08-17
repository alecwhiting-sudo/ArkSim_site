import Nav from "@/components/Nav";
import FlowSim from "@/components/FlowSim";
import Download from "@/components/Download";
import { site } from "@/lib/site";
import {
  IconArrow,
  IconBolt,
  IconChat,
  IconCheck,
  IconCoins,
  IconFlow,
  IconGauge,
  IconRepeat,
  IconUsers,
  Logo,
} from "@/components/Icons";

const features = [
  {
    icon: IconFlow,
    title: "Model any process as a flow",
    body: "Lay out steps, decisions, controls and endpoints as a graph. Work items flow through as discrete events — exactly how the work really happens.",
  },
  {
    icon: IconBolt,
    title: "Test automation & agents",
    body: "Swap a human step for a deterministic script or an AI agent, fixed-capacity or unlimited. See what actually shifts — throughput, cost, and where the queue moves next.",
  },
  {
    icon: IconCoins,
    title: "Baseline vs target economics",
    body: "Every run prices itself. Human cost, agent cost and per-run AI spend, baseline against target — so the business case is in the tool, not a separate spreadsheet.",
  },
  {
    icon: IconUsers,
    title: "Resources & queues",
    body: "Give steps real capacity. When demand outstrips it, items queue — so bottlenecks surface before they hit your customers.",
  },
  {
    icon: IconRepeat,
    title: "Rework, branches & variability",
    body: "Probabilistic branches, rework loops, and durations drawn from fixed, triangular, uniform or normal distributions. Model the messy reality, not a tidy average.",
  },
  {
    icon: IconGauge,
    title: "Batch workloads at any scale",
    body: "One quarter-end report or a full day's worth of invoices. Set an arrival rate and watch a month of work compress into a few minutes of playback.",
  },
];

const compareRows: {
  label: string;
  ark: string;
  other: string;
}[] = [
  {
    label: "Best for",
    ark: "Everyday business processes — finance, HR, marketing, operations",
    other: "Complex physical & industrial systems — airports, factories, logistics",
  },
  {
    label: "Modelling depth",
    ark: "The essentials, focused and fast",
    other: "Deep, richly detailed, endlessly configurable",
  },
  {
    label: "Learning curve",
    ark: "About 30 minutes",
    other: "A specialist toolset, worth the investment",
  },
  {
    label: "Setup",
    ark: "Lightweight desktop app",
    other: "A full simulation studio",
  },
  {
    label: "Cost",
    ark: "Free during beta",
    other: `Premium licences (≈£${site.competitorPriceLow.toLocaleString()}–${site.competitorPriceHigh.toLocaleString()})`,
  },
];

const steps = [
  {
    n: "01",
    title: "Map the process",
    body: "Add steps, connect them, and mark the decisions, controls and rework loops. Start from the built-in sample and edit, or build from a blank canvas.",
  },
  {
    n: "02",
    title: "Set the numbers",
    body: "Durations, volumes, who (or what) does each step, and where you want to introduce automation or agents. Sensible defaults mean you can move fast.",
  },
  {
    n: "03",
    title: "Run & compare",
    body: "Watch work flow through in real time, then read off the baseline-vs-target cost and time. Change one assumption, run again, and defend the number.",
  },
];


export default function Home() {
  return (
    <div id="top">
      <Nav />

      {/* ---------------- Hero ---------------- */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-12 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white/[0.03] px-3 py-1 text-xs text-[var(--muted)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              Live now · Free during beta
            </div>

            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              See the impact of process change{" "}
              <span className="text-gradient">before you commit to it</span>.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              ArkSim is a light, rapid process simulator for analysts and
              architects. Model automation, AI agents, new controls and quality
              improvements — and watch the cost and time impact play out in
              minutes. Right-sized for everyday business processes, at a fraction
              of the cost.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#download"
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base"
              >
                Download ArkSim — free
                <IconArrow width={18} height={18} />
              </a>
              <a
                href="#how"
                className="btn-ghost inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-base"
              >
                See how it works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-sm text-[var(--muted-2)]">
              <span className="inline-flex items-center gap-2">
                <IconCheck width={16} height={16} className="text-[var(--accent)]" />
                30-minute learning curve
              </span>
              <span className="inline-flex items-center gap-2">
                <IconCheck width={16} height={16} className="text-[var(--accent)]" />
                Works offline
              </span>
              <span className="inline-flex items-center gap-2">
                <IconCheck width={16} height={16} className="text-[var(--accent)]" />
                No sales call
              </span>
            </div>
          </div>

          <div className="relative animate-[float-slow_9s_ease-in-out_infinite]">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(50%_50%_at_50%_40%,rgba(56,225,200,0.18),transparent_70%)]" />
            <FlowSim />
          </div>
        </div>
      </section>

      {/* ---------------- Positioning strip ---------------- */}
      <section className="border-y border-[var(--border)] bg-white/[0.015]">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-5 py-8 text-center sm:grid-cols-3">
          {[
            ["<60 min", "to a working model"],
            ["£0", "during beta"],
            ["3 min", "to illustrate a 30-day close-the-books process"],
          ].map(([big, small]) => (
            <div key={small}>
              <div className="text-2xl font-semibold text-gradient sm:text-3xl">
                {big}
              </div>
              <div className="mt-1 text-sm text-[var(--muted-2)]">{small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Problem ---------------- */}
      <section className="mx-auto max-w-4xl px-5 py-20 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          &ldquo;What happens if we automate this step?&rdquo; deserves a better
          answer than a hunch.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          The specialist simulation platforms can answer it beautifully — but
          they&rsquo;re built for complex, industrial modelling and the teams who
          do it full time. For an everyday finance, HR or marketing process,
          that&rsquo;s more firepower than the question needs, so most teams fall
          back on a spreadsheet and an average. Averages hide the queues, the
          rework and the variability that decide whether a change actually pays
          off. ArkSim gives you a real discrete-event simulation with a learning
          curve you can clear over a coffee.
        </p>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          kicker="How it works"
          title="From a blank canvas to a defensible number"
          sub="Three steps. No specialist training, no scripting language."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="card card-hover relative p-7">
              <div className="font-mono text-sm text-[var(--accent)]">{s.n}</div>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2.5 leading-relaxed text-[var(--muted)]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          kicker="Features"
          title="A real simulation engine, minus the complexity"
          sub="Everything you need to model the messy reality of a process — and nothing you don't."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card card-hover p-7">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-white/[0.03] text-[var(--accent)]">
                <f.icon width={22} height={22} />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Comparison ---------------- */}
      <section id="compare" className="mx-auto max-w-5xl px-5 py-16">
        <SectionHeading
          kicker="Where ArkSim fits"
          title="Right-sized simulation for everyday business processes"
          sub="The specialist simulation platforms are superb — powerful, industrial-strength tools for modelling complex physical systems. ArkSim is the light, rapid, low-cost option for the processes most teams run day to day."
        />

        <div className="card mt-12 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="p-5 text-sm font-medium text-[var(--muted-2)]">
                    &nbsp;
                  </th>
                  <th className="p-5">
                    <span className="inline-flex items-center gap-2 text-base font-semibold">
                      <Logo className="h-5 w-auto" /> ArkSim
                    </span>
                  </th>
                  <th className="p-5 text-base font-medium text-[var(--muted)]">
                    Specialist platforms
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((r) => (
                  <tr
                    key={r.label}
                    className="border-b border-[var(--border)] last:border-0 align-top"
                  >
                    <td className="p-5 text-sm text-[var(--muted-2)]">
                      {r.label}
                    </td>
                    <td className="p-5 font-medium text-[var(--foreground)]">
                      {r.ark}
                    </td>
                    <td className="p-5 text-[var(--muted)]">{r.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-[var(--muted-2)]">
          Modelling an airport, a factory floor or a national supply chain?
          Those platforms are exactly what you want. For an everyday finance, HR
          or marketing process, ArkSim gets you a credible answer in an
          afternoon.
        </p>
      </section>

      {/* ---------------- Roadmap ---------------- */}
      <section id="roadmap" className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          kicker="On the roadmap"
          title="Coming soon: chat with your process"
          sub="Building from a process map, a spreadsheet or workshop output already works today. Next up: shaping a model just by describing it."
        />

        <div className="mx-auto mt-12 max-w-2xl">
          <div className="card relative p-8 sm:p-10">
            <span className="absolute right-6 top-6 rounded-full border border-[var(--border-strong)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--muted-2)]">
              Coming soon
            </span>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-white/[0.03] text-[var(--accent-3)]">
              <IconChat width={24} height={24} />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Chat with your process</h3>
            <p className="mt-2.5 leading-relaxed text-[var(--muted)]">
              Describe the process — or the change you&rsquo;re weighing up — in
              plain language, and let ArkSim build and adjust the model with you.
              No forms, no fiddly data entry: a conversation that ends in a
              running simulation.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <p className="text-[var(--muted)]">
              Got an idea for the roadmap? We&rsquo;d love to hear it.
            </p>
            <a
              href={`mailto:${site.contactEmail}?subject=ArkSim%20roadmap%20idea`}
              className="btn-ghost inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm"
            >
              Get in touch
              <IconArrow width={16} height={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- Who it's for ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card p-8">
            <h3 className="text-xl font-semibold">For business analysts</h3>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              Turn a process map into evidence. Show the ops team where the queue
              forms, quantify the rework, and put a credible number on the
              improvement you&rsquo;re proposing — without waiting on a
              simulation specialist.
            </p>
          </div>
          <div className="card p-8">
            <h3 className="text-xl font-semibold">For architects</h3>
            <p className="mt-3 leading-relaxed text-[var(--muted)]">
              Prove the target-state design before anyone builds it. Pressure-test
              your automation and agentic options, compare designs on cost and
              time, and hand over a blueprint backed by numbers — not just a
              diagram.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Download ---------------- */}
      <Download />

      {/* ---------------- Pricing ---------------- */}
      <section id="pricing" className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          kicker="Pricing"
          title="Free while we're in beta"
          sub="No licence fee, no seat count, no procurement cycle. Use ArkSim on real work today and help shape where it goes next."
        />

        <div className="mx-auto mt-12 max-w-lg">
          <div className="card relative overflow-hidden p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(56,225,200,0.25),transparent_70%)]" />
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white/[0.03] px-3 py-1 text-xs text-[var(--muted)]">
              Beta access
            </div>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-5xl font-semibold tracking-tight">Free</span>
              <span className="mb-1.5 text-[var(--muted-2)]">
                / for the whole beta
              </span>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "The full discrete-event simulation engine",
                "Baseline vs target cost & time on every run",
                "Automation, AI-agent and rework modelling",
                "Batch workloads at scale",
                "Works offline on your own machine",
              ].map((li) => (
                <li key={li} className="flex items-start gap-2.5">
                  <IconCheck
                    width={18}
                    height={18}
                    className="mt-0.5 shrink-0 text-[var(--accent)]"
                  />
                  <span className="text-[var(--muted)]">{li}</span>
                </li>
              ))}
            </ul>
            <a
              href="#download"
              className="btn-primary mt-8 flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base"
            >
              Download ArkSim — free
              <IconArrow width={18} height={18} />
            </a>
            <p className="mt-4 text-center text-xs text-[var(--muted-2)]">
              When paid plans arrive, they&rsquo;ll stay a fraction of the cost of
              legacy tools.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="card relative overflow-hidden p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(91,140,255,0.18),transparent_70%)]" />
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Stop guessing at process change.{" "}
            <span className="text-gradient">Simulate it.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--muted)]">
            Download ArkSim, load the sample process, and have your first
            baseline-vs-target result inside ten minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#download"
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base"
            >
              Download ArkSim free
              <IconArrow width={18} height={18} />
            </a>
            <a
              href={`mailto:${site.contactEmail}`}
              className="btn-ghost inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base"
            >
              Talk to us
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <Logo />
            <span className="font-semibold">ArkSim</span>
            <span className="text-sm text-[var(--muted-2)]">
              · Process simulation, made simple
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--muted)]">
            <a href="#features" className="hover:text-[var(--foreground)]">
              Features
            </a>
            <a href="#pricing" className="hover:text-[var(--foreground)]">
              Pricing
            </a>
            <a
              href={`mailto:${site.contactEmail}`}
              className="hover:text-[var(--foreground)]"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="border-t border-[var(--border)] py-5 text-center text-xs text-[var(--muted-2)]">
          © {new Date().getFullYear()} ArkSim. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
        {kicker}
      </div>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {sub && (
        <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">{sub}</p>
      )}
    </div>
  );
}
