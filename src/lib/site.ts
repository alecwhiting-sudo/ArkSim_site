/**
 * Central site configuration.
 *
 * Update these values in one place. In particular, point `appUrl` at the live
 * ArkSim app once its URL is confirmed — every "Try it free" button reads from
 * here.
 */
export const site = {
  name: "ArkSim",
  tagline: "Simulate process change before you commit to it.",
  /** TODO: replace with the live app URL. */
  appUrl: "https://app.arksim.io",
  contactEmail: "hello@arksim.io",
  // Rough per-license price of legacy tools we position against (GBP).
  competitorPriceLow: 2000,
  competitorPriceHigh: 8000,
} as const;
