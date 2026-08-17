import type { NextConfig } from "next";

/**
 * Served under arkmode.app/arksim, so the app runs with a base path of
 * "/arksim". Override with NEXT_PUBLIC_BASE_PATH (set it to "" to serve at the
 * domain root instead).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/arksim";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
