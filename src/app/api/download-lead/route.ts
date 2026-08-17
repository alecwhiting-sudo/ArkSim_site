import { NextResponse } from "next/server";
import { Resend } from "resend";
import { DOWNLOAD_UNLOCK_COOKIE } from "@/lib/site";

// Runs as a Node serverless function on Vercel.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const UNLOCK_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots learn nothing, but don't unlock/notify.
  if (clip(body.company, 100)) {
    return NextResponse.json({ ok: true });
  }

  const email = clip(body.email, 320);
  const platform = clip(body.platform, 20) || "unspecified";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM || "ArkSim <onboarding@resend.dev>";

  // Best-effort lead notification — never block the download on this.
  if (apiKey && to) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to: [to],
        subject: `ArkSim download lead — ${email}`,
        text: `Email: ${email}\nPlatform: ${platform}\nWhen: ${new Date().toISOString()}`,
      });
    } catch {
      // Swallow — unlocking shouldn't depend on the notification succeeding.
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(DOWNLOAD_UNLOCK_COOKIE, "1", {
    maxAge: UNLOCK_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
  return res;
}
