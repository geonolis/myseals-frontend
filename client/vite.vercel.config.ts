/**
 * Vite configuration for Vercel production builds.
 *
 * This file lives inside client/ so Vercel can find it when
 * Root Directory is set to "client" in the Vercel project settings.
 *
 * It intentionally omits Manus-specific plugins
 * (vite-plugin-manus-runtime, vite-plugin-jsx-loc, debug collector)
 * which are only available in the Manus sandbox environment.
 */
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// __dirname here is client/ — the repo root is one level up
const CLIENT_DIR = path.resolve(__dirname);
const REPO_ROOT = path.resolve(CLIENT_DIR, "..");

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
      "@": path.resolve(CLIENT_DIR, "src"),
      "@shared": path.resolve(REPO_ROOT, "shared"),
      "@assets": path.resolve(REPO_ROOT, "attached_assets"),
    },
  },
  // root is client/ (where this config lives and where index.html is)
  root: CLIENT_DIR,
  // envDir at repo root so .env files are picked up
  envDir: REPO_ROOT,
  build: {
    outDir: path.resolve(REPO_ROOT, "dist/public"),
    emptyOutDir: true,
  },
});
