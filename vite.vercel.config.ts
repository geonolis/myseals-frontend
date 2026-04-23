/**
 * Vite configuration for Vercel production builds.
 *
 * This file lives at the REPO ROOT and is run from the repo root.
 * In Vercel project settings, Root Directory must be set to "./" (repo root).
 *
 * It intentionally omits Manus-specific plugins
 * (vite-plugin-manus-runtime, vite-plugin-jsx-loc, debug collector)
 * which are only available in the Manus sandbox environment.
 */
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// __dirname is the repo root (where this config file lives)
const REPO_ROOT = path.resolve(__dirname);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
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
  // Vite root is client/ — this is where index.html lives
  root: path.resolve(REPO_ROOT, "client"),
  // envDir at repo root so .env files are picked up
  envDir: REPO_ROOT,
  build: {
    outDir: path.resolve(REPO_ROOT, "dist/public"),
    emptyOutDir: true,
  },
});
