# ArkSim — marketing site

Landing page for **ArkSim**, a browser-based discrete-event process simulator
for business analysts and consultants. Built with Next.js (App Router),
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

- **`appUrl`** — where every "Try it free" button points. Set this to the live
  app URL. _(Currently a placeholder.)_
- **`contactEmail`** — used by the "Talk to us" / Contact links.

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
