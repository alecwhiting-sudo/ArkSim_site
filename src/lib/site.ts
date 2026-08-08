/**
 * Central site configuration.
 *
 * Update these values in one place. ArkSim is a downloadable desktop app, so the
 * primary calls to action point at the Download section (see `downloads` below).
 */
export const site = {
  name: "ArkSim",
  tagline: "Simulate process change before you commit to it.",
  contactEmail: "hello@arksim.io",
  // Rough per-license price of legacy tools we position against (GBP).
  competitorPriceLow: 2000,
  competitorPriceHigh: 8000,

  /** Current desktop app version, shown next to the download buttons. */
  version: "0.1.0",

  /**
   * Desktop downloads (Electron-wrapped app).
   *
   * ArkSim is packaged with electron-builder, which produces one installer per
   * platform:
   *   - macOS  → a `.dmg`. Build it as a *universal* binary and a single file
   *     covers both Apple Silicon and Intel Macs.
   *   - Windows → an NSIS `.exe` installer (64-bit).
   *
   * These `href`s are STUBS — replace them with your real release-asset URLs
   * (e.g. GitHub Releases links). Extra targets (Windows arm64, Linux
   * AppImage/deb) can be added as more entries and rendered the same way.
   */
  downloads: {
    mac: {
      // Universal build → works on Apple Silicon and Intel.
      href: "/downloads/ArkSim-0.1.0-universal.dmg",
      meta: "Universal (Apple Silicon + Intel) · macOS 11+",
    },
    windows: {
      href: "/downloads/ArkSim-Setup-0.1.0.exe",
      meta: "64-bit installer · Windows 10 & 11",
    },
  },
} as const;
