/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "tests/setup.ts",
      ],
    },
    deps: {
      optimizer: {
        web: {
          include: [
            "@testing-library/react",
            "@testing-library/user-event",
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname),
      // Handle Node.js built-ins
      fs: "memfs",
      path: "path-browserify",
    },
  },
});
