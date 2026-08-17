# ArkSim — marketing site

Landing page for **ArkSim**, a downloadable desktop discrete-event process
simulator for business analysts and architects. Built with Next.js (App Router),
TypeScript and Tailwind CSS v4 — mirroring the [ArkSim app](https://github.com/alecwhiting-sudo/ArkSim)
stack.

## Run locally

```bash
npm install
npm run dev      # http://127.0.0.1:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

For the contact form to work locally, create `.env.local` from
[`.env.example`](./.env.example) with your Resend key and recipient.

## Deploying on Vercel

1. Push to GitHub, then in [Vercel](https://vercel.com) → **Add New → Project**
   and import this repo. Framework preset: **Next.js** (auto-detected). No build
   settings to change.
2. Add **Environment Variables** (Project → Settings → Environment Variables),
   from [`.env.example`](./.env.example):
   - `RESEND_API_KEY` — an API key from your Resend dashboard.
   - `CONTACT_TO` — the Gmail address submissions should reach.
   - `CONTACT_FROM` — an address on a domain you've verified in Resend
     (e.g. `ArkSim <hello@yourdomain.com>`). Omit to use the shared
     `onboarding@resend.dev`, which only delivers to your own Resend account
     email.
3. Deploy. Every push to the repo redeploys automatically. You get a free
   `*.vercel.app` URL; add a custom domain later under Settings → Domains.

The contact form (`/api/contact`) is a serverless function — the recipient
address lives only in the server-side env vars and never reaches the browser.

## Editing key details

Site-wide values live in [`src/lib/site.ts`](./src/lib/site.ts):

- **`downloads`** — desktop (Electron) installer links for the Download section.
  ArkSim is packaged with electron-builder: macOS gets one universal `.dmg`
  (Apple Silicon + Intel) and Windows gets one 64-bit `.exe`. The `href`s are
  _stubs_ — point them at your real release assets (e.g. GitHub Releases). Extra
  targets (Windows arm64, Linux AppImage/deb) slot in as more entries.
- **`version`** — shown beside the download buttons.

## Structure

| Path | Role |
|------|------|
| `src/app/page.tsx` | The landing page (all sections) |
| `src/app/layout.tsx` | Root layout, fonts, SEO metadata |
| `src/app/globals.css` | Theme tokens + utility classes (sleek dark theme) |
| `src/components/FlowSim.tsx` | Animated hero: tokens of light flowing through a process |
| `src/components/Nav.tsx` | Sticky nav with mobile menu |
| `src/components/Icons.tsx` | Inline icon set + logo |
| `src/components/ContactForm.tsx` | Contact form (posts to the API route) |
| `src/app/api/contact/route.ts` | Serverless function that emails submissions via Resend |
| `src/lib/site.ts` | Central config (downloads, positioning) |
