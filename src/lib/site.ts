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
   * One installer per platform:
   *   - macOS  → a `.dmg` (build it as a *universal* binary and a single file
   *     covers both Apple Silicon and Intel Macs).
   *   - Windows → an NSIS `.exe` installer (64-bit).
   *
   * WHERE TO PUT THE FILES — two options:
   *   1. Drop them in `public/downloads/` and keep the paths below. They'll be
   *      served from the site. NOTE: GitHub blocks files larger than 100 MB in a
   *      normal git push, so this only works if each installer is under ~100 MB.
   *   2. For larger installers (typical for Electron), attach them to a GitHub
   *      Release and paste the release-asset URLs here instead (a full https://
   *      URL is used as-is; a leading-slash path is treated as a local file).
   *
   * Update the version in the filenames to match `version` above. Extra targets
   * (Windows arm64, Linux AppImage/deb) can be added as more entries.
   */
  downloads: {
    mac: {
      // Universal build → works on Apple Silicon and Intel.
      href: "/downloads/ArkSim-0.1.0-universal.dmg",
      meta: "Universal (Apple Silicon + Intel) · macOS 11+",
      note: "",
    },
    windows: {
      href: "/downloads/ArkSim-Setup-0.1.0.exe",
      meta: "64-bit installer · Windows 10 & 11",
      // Shown under the Windows button until the app is code-signed.
      note: "Windows may warn that the publisher isn't recognised — click “More info”, then “Run anyway”.",
    },
  },
} as const;
