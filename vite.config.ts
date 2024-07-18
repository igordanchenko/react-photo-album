/// <reference types="vitest" />
/// <reference types="vite/client" />
/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from "vite";
import cleanup from "rollup-plugin-cleanup";

export default defineConfig({
  test: {
    dir: "test",
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/vitest.setup.ts",
    coverage: {
      all: true,
      enabled: true,
      include: ["src"],
      thresholds: { 100: true },
      reporter: [
        ["text", { skipEmpty: true }],
        ["html", { skipEmpty: true }],
      ],
    },
  },
  build: {
    minify: false,
    emptyOutDir: false,
    target: "es2020",
    lib: {
      entry: {
        index: "src/index.ts",
        "utils/index": "src/utils/index.ts",
        "static/index": "src/static/index.ts",
        "layouts/rows": "src/layouts/rows/index.ts",
        "layouts/columns": "src/layouts/columns/index.ts",
        "layouts/masonry": "src/layouts/masonry/index.ts",
        "client/hooks": "src/client/hooks/index.ts",
        "client/rows": "src/client/rows/index.ts",
        "client/columns": "src/client/columns/index.ts",
        "client/masonry": "src/client/masonry/index.ts",
        "client/rowsProps": "src/client/rows/resolveRowsProps.ts",
        "client/columnsProps": "src/client/columns/resolveColumnsProps.ts",
        "client/masonryProps": "src/client/masonry/resolveMasonryProps.ts",
        "client/aggregate": "src/client/aggregate/index.ts",
        "scroll/index": "src/scroll/index.ts",
        "server/index": "src/server/index.ts",
        "ssr/index": "src/ssr/index.ts",
        "ssr/breakpoints": "src/ssr/breakpoints/index.ts",
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      output: { minifyInternalExports: false },
      plugins: [cleanup({ extensions: ["ts", "tsx"] })],
      preserveEntrySignatures: "allow-extension",
      treeshake: false,
    },
  },
});
