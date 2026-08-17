import type { NextConfig } from "next";

/**
 * Deployed on Vercel (native Next.js runtime). Served at the domain root, so no
 * basePath. Set NEXT_PUBLIC_BASE_PATH only if hosting under a sub-path.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
