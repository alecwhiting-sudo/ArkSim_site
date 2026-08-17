/**
 * Base path the site is served under. Must match `basePath` in next.config.ts.
 * Served under arkmode.app/arksim, so defaults to "/arksim". Set
 * NEXT_PUBLIC_BASE_PATH="" to serve at a domain root instead.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/arksim";

/**
 * Central site configuration.
 *
 * Update these values in one place. ArkSim is a downloadable desktop app, so the
 * primary calls to action point at the Download section (see `downloads` below).
 * The contact email is intentionally NOT stored here — the contact form posts to
 * a serverless function that reads the recipient from a server-side env var, so
 * the address never reaches the browser.
 */
export const site = {
  name: "ArkSim",
  tagline: "Simulate process change before you commit to it.",
  // Rough per-license price of the specialist platforms (GBP), used in copy.
  competitorPriceLow: 2000,
  competitorPriceHigh: 8000,

  /** Current desktop app version, shown next to the download buttons. */
  version: "0.1.0",

  /**
   * Desktop downloads (Electron-wrapped app).
   *
   * WHERE TO PUT THE FILES — two options:
   *   1. Drop them in `public/downloads/` and use a leading-slash path below.
   *      They'll be served from the site. NOTE: GitHub blocks files larger than
   *      100 MB in a normal git push, so this only works under that size.
   *   2. For larger installers (typical for Electron — mac is currently ~350 MB),
   *      attach them to a GitHub Release instead and paste the release-asset URL
   *      here (a full https:// URL is used as-is).
   *
   * Current mac build: hosted as a GitHub Release asset (see the `v0.1.0-mac`
   * release). To publish a new version: draft a new release, upload the file,
   * copy its asset URL, and update `href` + `version` below to match.
   */
  downloads: {
    mac: {
      // Hosted as a GitHub Release asset (too large for a normal git push).
      href: "https://github.com/alecwhiting-sudo/ArkSim_site/releases/download/v0.1.0-mac/ArkSim.app.zip",
      meta: "macOS · signed & notarised by Apple",
      note: "Signed, notarised and stapled — opens without a security warning.",
    },
    windows: {
      href: "/downloads/ArkSim-Setup-0.1.0.exe",
      meta: "64-bit installer · Windows 10 & 11",
      // Shown under the Windows button until the app is code-signed.
      note: "Windows may warn that the publisher isn't recognised — click “More info”, then “Run anyway”.",
    },
  },
} as const;
