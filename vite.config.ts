/// <reference types="vite/client" />
/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import cleanup from "rollup-plugin-cleanup";
import type { Plugin } from "rollup";

function addClientDirective(): Plugin {
  return {
    name: "add-client-directive",
    renderChunk(code) {
      if (
        (/import\s.*(?:useMemo|useState|useRef|useCallback|useReducer).*from\s*['"]react['"]/.test(code) ||
          /import\s.*from\s*['"]\.\/(?:rows|columns|masonry)\.js['"]/.test(code)) &&
        !/['"]use client['"]/.test(code)
      ) {
        return { code: `"use client";\n${code}`, map: null };
      }
    },
  };
}

export default defineConfig({
  test: {
    dir: "test",
    environment: "jsdom",
    setupFiles: "./test/vitest.setup.ts",
    coverage: {
      enabled: true,
      thresholds: { 100: true },
      include: ["src/**/**.{ts,tsx}"],
      exclude: ["src/**/index.ts", "src/types.ts"],
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
      plugins: [
        addClientDirective(),
        cleanup({
          extensions: ["ts", "tsx"],
          comments: "license", // https://github.com/vitest-dev/vitest/issues/8365
        }),
      ],
      preserveEntrySignatures: "allow-extension",
      treeshake: false,
    },
  },
});
