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
      entry: {
        index: "src/index.ts",
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: "react",
      output: {
        banner: '"use client";',
      },
      plugins: [cleanup({ extensions: ["ts", "tsx"] })],
    },
  },
});
