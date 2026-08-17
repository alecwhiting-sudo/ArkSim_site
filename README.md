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

## Editing key details

Site-wide values live in [`src/lib/site.ts`](./src/lib/site.ts):

- **`contactEmail`** — used by the "Talk to us" / Contact links.
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
| `src/lib/site.ts` | Central config (app URL, contact, positioning) |
