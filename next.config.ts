import type { NextConfig } from "next";

const projectRoot = process.cwd();

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't auto-detect the parent
  // "VS Code" folder. Prevents the tailwindcss-resolution failure mode
  // that hit the sibling AskReal project.
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,

  // Rewrites — surface AskReal at hknexttry.com/askreal/* by
  // proxying to the separate AskReal Vercel deployment.
  //
  // IMPORTANT: set ASKREAL_ORIGIN in Vercel env vars to point at
  // AskReal's production URL (e.g. https://askreal-mvp.vercel.app).
  // Falls back to localhost:3001 for local dev where both projects
  // run side by side.
  async rewrites() {
    const askrealOrigin =
      process.env.ASKREAL_ORIGIN ?? "http://localhost:3001";
    return [
      {
        source: "/askreal",
        destination: `${askrealOrigin}/askreal`,
      },
      {
        source: "/askreal/:path*",
        destination: `${askrealOrigin}/askreal/:path*`,
      },
    ];
  },

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "motion",
    ],
    serverComponentsHmrCache: true,
  },
};

export default nextConfig;
