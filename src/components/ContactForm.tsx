"use client";

import { useState } from "react";
import { IconArrow, IconCheck } from "@/components/Icons";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
      company: fd.get("company"), // honeypot
    };

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card flex flex-col items-center gap-3 p-10 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)] ring-1 ring-[var(--accent)]/40">
          <IconCheck width={24} height={24} />
        </span>
        <h3 className="text-xl font-semibold">Thanks — message sent</h3>
        <p className="max-w-sm text-[var(--muted)]">
          It&rsquo;s on its way to our inbox and we&rsquo;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-ghost mt-2 rounded-lg px-4 py-2 text-sm"
        >
          Send another
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8" noValidate>
      {/* Honeypot — hidden from users, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className={inputCls}
          />
        </Field>
        <Field label="Email">
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={inputCls}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Message">
          <textarea
            name="message"
            required
            rows={5}
            placeholder="What would you like to tell us or ask about?"
            className={`${inputCls} resize-y`}
          />
        </Field>
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? "Sending…" : "Send message"}
          {!sending && <IconArrow width={18} height={18} />}
        </button>
        <span className="text-xs text-[var(--muted-2)]">
          We&rsquo;ll only use your email to reply.
        </span>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-[var(--border-strong)] bg-white/[0.02] px-3.5 py-2.5 text-[var(--foreground)] outline-none placeholder:text-[var(--muted-2)] transition-colors focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}
