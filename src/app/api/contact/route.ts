import { NextResponse } from "next/server";
import { Resend } from "resend";

// Runs as a Node serverless function on Vercel.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Quick health check — reports which env vars are present (never their
// values). Visit /arksim/api/contact in a browser to check configuration
// without filling in the form.
export async function GET() {
  return NextResponse.json({
    RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
    CONTACT_TO: Boolean(process.env.CONTACT_TO),
    CONTACT_FROM: Boolean(process.env.CONTACT_FROM),
  });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  // Honeypot: real users never fill "company"; bots often do.
  if (clip(body.company, 100)) return NextResponse.json({ ok: true });

  const name = clip(body.name, 200);
  const email = clip(body.email, 320);
  const message = clip(body.message, 5000);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  // Use an address on your verified Resend domain for best deliverability; the
  // shared onboarding@resend.dev works too (only delivers to your own address).
  const from = process.env.CONTACT_FROM || "ArkSim <onboarding@resend.dev>";

  if (!apiKey || !to) {
    const missing = [!apiKey && "RESEND_API_KEY", !to && "CONTACT_TO"]
      .filter(Boolean)
      .join(", ");
    return NextResponse.json(
      { error: `The contact form isn't configured yet. Missing: ${missing}.` },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `ArkSim enquiry — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    if (error) {
      return NextResponse.json(
        { error: "Couldn't send right now. Please try again shortly." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Couldn't send right now. Please try again shortly." },
      { status: 502 },
    );
  }
}
