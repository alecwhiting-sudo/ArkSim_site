# Deployment & services notes

This captures the *why* behind how this site is wired up — not just the
current config, but the dead ends and trade-offs behind it — so future work
doesn't accidentally re-break something or re-litigate a settled decision.

For "how do I run this locally" / "where do I edit X," see
[`README.md`](./README.md).

---

## Hosting — Vercel

Originally deployed to GitHub Pages as a static export. Migrated to
**Vercel** (native Next.js, dynamic API routes) because the contact form and
download email-gate both need real serverless functions, which a static
export can't provide.

- Production branch: `claude/arksim-landing-page-gffj0h`, kept in sync with
  `main` — this is what Vercel auto-deploys on every push.
- The project's default `ark-sim-site.vercel.app` URL stays live alongside
  the custom domain (Vercel doesn't disable it when you add one). Useful as
  a fallback — see "Corporate network access" below.

## Domain — arkmode.app

- `arkmode.app` is intended as the long-term "mothership" domain for future
  ArkMode products. ArkSim deliberately lives at **`/arksim`**, not the
  domain root, so a future parent site can occupy the root later without
  breaking this URL. Controlled by `basePath` in `next.config.ts` /
  `NEXT_PUBLIC_BASE_PATH` in `src/lib/site.ts` (defaults to `/arksim`).
- DNS (Namecheap → Advanced DNS): `A` record `@` → `216.198.79.1`, `CNAME`
  `www` → `cname.vercel-dns.com`. In Vercel, `arkmode.app` is set as the
  primary domain; `www.arkmode.app` 308-redirects to it.
- `vercel.json` redirects `/` → `/arksim` so the bare domain lands on the
  product page.

## Contact form & download-lead capture (email)

### What's actually live

Both the "Talk to us" contact form (`/api/contact`) and the download
email-gate (`/api/download-lead`) send through the same pipeline:

- **Provider:** [Resend](https://resend.com), via `RESEND_API_KEY`.
- **Sender:** the shared `onboarding@resend.dev` address (`CONTACT_FROM` env
  var, currently unset/default — no custom domain is verified in Resend for
  this project; see below for why).
- **Recipient:** `CONTACT_TO` env var → the site owner's Gmail.
- All three are Vercel **Environment Variables** (Production + Preview), set
  server-side only — never exposed to the browser.

### What was tried and rejected (so it isn't re-attempted)

The goal explored here was: let the owner **reply** to a contact-form
message without their personal Gmail address being visible to the
recipient. None of the following are active:

1. **Verify `arkmode.app` as a sending domain in Resend**, to send from
   `hello@arkmode.app` and get real SMTP credentials for Gmail's "send mail
   as." Blocked: the free Resend plan allows only 1 domain (already used by
   a different project's site), and upgrading is $20/mo — judged not worth
   it for this.
2. **Namecheap free email forwarding**, `hello@arkmode.app →` the owner's
   Gmail — **this one IS live and confirmed working** (Namecheap → Domain
   List → arkmode.app → Domain tab → Redirect Email; test email sent to
   `hello@arkmode.app` was received in Gmail), but it's receive-only. Free
   forwarding has no SMTP send capability, so it can't be used as a Gmail
   "send mail as" alias despite looking like it should.
   - Not currently published anywhere (no `mailto:` links on the site — see
     the contact-form section above), so it has no real traffic today beyond
     the odd spam bot dictionary-guessing common prefixes against the
     domain. Kept live because it's free/zero-maintenance and is exactly the
     address a future branded-reply setup (see item 4 below) would use — a
     10-second delete in the same Namecheap panel if it's ever not wanted.
3. **An existing paid Namecheap Private Email plan** (bought for an
   unrelated project's domain) had spare mailbox capacity, but that plan is
   locked to its original domain — can't add an `arkmode.app` mailbox to it.
4. **A free mailbox on that same existing Private Email plan** (e.g.
   `arksim@` the other domain) would give real SMTP credentials for Gmail's
   "send mail as," at no extra cost, and was offered as the cheapest real
   fix — **not yet actioned**.

**Net effect:** replying to a contact-form message today goes out from the
owner's personal Gmail directly, with no branded or hidden "from" address.
This was an explicit, deliberate decision to defer, not an oversight. If it
becomes a problem, option 4 above is the cheapest path to revisit.

## Downloads (macOS & Windows)

- Installers are too large for a normal `git push` (GitHub's 100 MB limit)
  *and* too large for the web file-upload UI (a separate, lower 25 MB cap).
  Both are hosted as **GitHub Releases on this repo** (`ArkSim_site`), not
  committed as files:
  - macOS: release `v0.1.0-mac`, asset `ArkSim.app.zip`
  - Windows: release `v0.1.0-windows`, asset `ArkSim.Setup.0.1.0.zip`
- The app's actual source code lives in a **separate, private** repo
  (`alecwhiting-sudo/ArkSim`). Do not link download buttons directly to
  release assets there — they're private and 404 for anonymous visitors.
  Any future installer should be downloaded from that repo and re-uploaded
  to a Release on **this** (public) repo instead, to avoid needing to make
  the app's source repo public.
- This repo was made **public** specifically so Release assets are
  downloadable by anonymous visitors. Public only grants read access —
  nobody can push or merge without being added as a Collaborator.
- Download buttons don't link to raw GitHub URLs. They go through
  `/download/[platform]` (`src/app/download/[platform]/route.ts`), which:
  1. hides the GitHub URL/username from visitors, and
  2. enforces the email-gate cookie before redirecting to the real file.
- Gated behind an email-capture form (`src/components/Download.tsx` +
  `/api/download-lead`), reusing the contact-form's Resend pipeline. The
  unlock cookie (`arksim_dl_ok`) is **not cryptographically signed** — it's
  a lead-capture gate, not real access control. A determined visitor could
  bypass it (e.g. setting the cookie manually); that's an accepted
  trade-off for staying dependency-free.
- The Windows build is currently **unsigned** (code-signing cert pending,
  per the app repo's own release notes). The site shows an expandable
  "Trouble opening it?" guide on the Windows card covering, in order: the
  browser's download-reputation warning, extracting the `.zip`, and Windows
  SmartScreen at launch.
- To publish a new version: draft a new Release with the updated asset,
  copy its URL, and update `href` + `version` in `src/lib/site.ts` to match.

## Corporate network / firewall access

- Brand-new custom domains (like `arkmode.app`) are commonly flagged by
  corporate secure web gateways (Zscaler, Palo Alto, Netskope, Cisco
  Umbrella, Fortinet...) as "Newly Registered" or "Uncategorized" —
  categories many default corporate policies block outright.
- `*.vercel.app` isn't automatically safer: because anyone can spin one up
  free with no verification, several of the same vendors flag it (and
  similar free-hosting platforms) as elevated-risk "free/dynamic hosting."
  Which one gets blocked depends on the specific company's policy.
- **Real data point:** PwC's corporate network allows `*.vercel.app` apps.
  Given ArkSim's audience overlaps heavily with large consultancies, **lead
  with the `.vercel.app` URL (`ark-sim-site.vercel.app`) for corporate
  outreach for now**; treat `arkmode.app` as the long-term branded link and
  switch back once it's aged (~30–90 days with no abuse reports) and/or been
  submitted to vendor URL-categorization tools (Palo Alto, Zscaler, Cisco
  Talos, Fortiguard site-review tools).

## Known open items

- Reply-privacy for contact-form responses (see email section above).
- Windows code signing (SSL.com certificate, tracked in the app repo).
- `arkmode.app` domain reputation / corporate-network categorization.
- Only macOS (universal) and Windows x64 are covered — no Linux or Windows
  arm64 builds yet.
