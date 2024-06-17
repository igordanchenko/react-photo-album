/// <reference types="vitest" />
/// <reference types="vite/client" />
/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from "vite";
import cleanup from "rollup-plugin-cleanup";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      include: ["src"],
    },
  },
  build: {
    minify: false,
    target: "es2020",
    lib: {
      entry: "src/index.ts",
      formats: ["cjs", "es"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
    },
    rollupOptions: {
      external: "react",
      output: {
        exports: "named",
        banner: '"use client";',
      },
      plugins: [cleanup({ extensions: ["ts", "tsx"] })],
    },
  },
});
