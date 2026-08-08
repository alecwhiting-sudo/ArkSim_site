import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * The site is a project page served under /<repo>, so assets need a base path.
 * Override with NEXT_PUBLIC_BASE_PATH (e.g. "" for a root/custom domain).
 */
const isProd = process.env.NODE_ENV === "production";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? (isProd ? "/ArkSim_site" : "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
