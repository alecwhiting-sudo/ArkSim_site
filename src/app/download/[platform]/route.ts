import { NextResponse } from "next/server";
import { DOWNLOAD_UNLOCK_COOKIE, basePath, site } from "@/lib/site";

/**
 * Clean download links: /download/mac and /download/windows (served under
 * /arksim via basePath) redirect to the real asset — a GitHub Release URL or a
 * local /public file — without exposing that URL to the person clicking the
 * button. Keep this in sync with `site.downloads` in src/lib/site.ts.
 *
 * Gated: requires the unlock cookie set by /api/download-lead (the email-gate
 * form), so visiting this link directly without going through the form bounces
 * back to the download section instead of serving the file.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ platform: string }> },
) {
  const { platform } = await params;
  const entry = (site.downloads as Record<string, { href: string } | undefined>)[
    platform
  ];

  if (!entry) {
    return NextResponse.json({ error: "Unknown platform." }, { status: 404 });
  }

  const cookieHeader = req.headers.get("cookie") || "";
  const unlocked = cookieHeader
    .split(";")
    .some((c) => c.trim().startsWith(`${DOWNLOAD_UNLOCK_COOKIE}=1`));

  if (!unlocked) {
    return NextResponse.redirect(new URL(`${basePath}/#download`, req.url), {
      status: 302,
    });
  }

  // NextResponse.redirect requires an absolute URL — resolve local /public
  // paths against the current request; external URLs pass through unchanged.
  const candidate = /^https?:\/\//.test(entry.href)
    ? entry.href
    : `${basePath}${entry.href}`;
  const target = new URL(candidate, req.url).toString();

  return NextResponse.redirect(target, { status: 302 });
}
