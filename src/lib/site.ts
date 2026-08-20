/**
 * Base path the site is served under. Must match `basePath` in next.config.ts.
 * Served under arkmode.app/arksim, so defaults to "/arksim". Set
 * NEXT_PUBLIC_BASE_PATH="" to serve at a domain root instead.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/arksim";

/**
 * Cookie set by /api/download-lead once a visitor has submitted their email;
 * checked by the download redirect route before serving a real file, and read
 * client-side by the Download component to decide whether to show the gate.
 * Not cryptographically signed — this is a lead-capture gate, not access
 * control, so a client-set cookie is an acceptable tradeoff for staying
 * dependency-free.
 */
export const DOWNLOAD_UNLOCK_COOKIE = "arksim_dl_ok";

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
  version: "0.1.1",

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
   * Both builds are hosted as GitHub Release assets (see the `v<version>-mac`
   * / `v<version>-windows` releases). To publish a new version: update the
   * release (new tag or edit the existing one), upload the file, copy its
   * asset URL, and update `href` + `version` below to match.
   */
  downloads: {
    mac: {
      // Hosted as a GitHub Release asset (too large for a normal git push).
      href: "https://github.com/alecwhiting-sudo/ArkSim_site/releases/download/v0.1.1-mac/ArkSim-0.1.1-universal.dmg",
      meta: "macOS · signed & notarised by Apple",
      note: "Signed, notarised and stapled — opens without a security warning.",
    },
    windows: {
      // Hosted as a GitHub Release asset (over the web-upload UI's 25 MB cap).
      href: "https://github.com/alecwhiting-sudo/ArkSim_site/releases/download/v0.1.1-windows/ArkSim.Setup.0.1.1.zip",
      meta: "64-bit installer (.zip) · Windows 10 & 11",
      note: "Downloads as a .zip — extract it to get the installer. Unsigned build: your browser and Windows will each ask you to confirm before it opens.",
      // Shown as an expandable "having trouble?" guide until the app is
      // code-signed. Three things people commonly hit, in the order they meet
      // them: the browser's own download-reputation check, extracting the zip,
      // then Windows SmartScreen when the installer is actually run.
      helpSteps: [
        "In your browser's downloads, the file may show as blocked or “not commonly downloaded.” Click the small ⌄ arrow next to it and choose “Keep” (you may need to confirm “Keep anyway”).",
        "Extract the .zip (right-click → “Extract All,” or just double-click it) to get ArkSim.Setup.0.1.1.exe.",
        "Run the installer. Windows will likely show “Windows protected your PC.” Click “More info,” then “Run anyway.”",
      ],
    },
  },
} as const;
