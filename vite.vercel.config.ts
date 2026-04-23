/**
 * Vite configuration for Vercel production builds.
 *
 * This config intentionally omits Manus-specific plugins
 * (vite-plugin-manus-runtime, vite-plugin-jsx-loc, debug collector)
 * which are only available in the Manus sandbox environment.
 *
 * Paths are resolved relative to the REPOSITORY ROOT (one level above client/).
 */
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// Repository root is one directory above this config file (which lives at repo root)
const REPO_ROOT = path.resolve(__dirname);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Set to 'false' so Auth0 is enforced in production.
    // Override by setting VITE_PREVIEW_MODE=true in Vercel environment variables
    // if you want to deploy a demo without a live backend.
    "import.meta.env.VITE_PREVIEW_MODE": JSON.stringify(
      process.env.VITE_PREVIEW_MODE ?? "false"
    ),
  },
  resolve: {
    alias: {
      "@": path.resolve(REPO_ROOT, "client", "src"),
      "@shared": path.resolve(REPO_ROOT, "shared"),
      "@assets": path.resolve(REPO_ROOT, "attached_assets"),
    },
  },
  // Root is client/ — this is where index.html lives
  root: path.resolve(REPO_ROOT, "client"),
  // envDir at repo root so .env files are picked up
  envDir: REPO_ROOT,
  build: {
    outDir: path.resolve(REPO_ROOT, "dist/public"),
    emptyOutDir: true,
  },
});
