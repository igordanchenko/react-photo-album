/// <reference types="vitest" />
/// <reference types="vite/client" />
/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from "vite";
import cleanup from "rollup-plugin-cleanup";

export default defineConfig({
  test: {
    globals: true,
    dir: "test",
    environment: "jsdom",
    coverage: { include: ["src"] },
    setupFiles: "./test/setup.ts",
  },
  build: {
    minify: false,
    emptyOutDir: false,
    target: "es2020",
    lib: {
      entry: {
        index: "src/index.ts",
        "core/utils": "src/core/utils/index.ts",
        "core/static": "src/core/static/index.ts",
        "layouts/rows": "src/layouts/rows/index.ts",
        "layouts/columns": "src/layouts/columns/index.ts",
        "layouts/masonry": "src/layouts/masonry/index.ts",
        "client/hooks": "src/client/hooks/index.ts",
        "client/rows": "src/client/rows/index.ts",
        "client/columns": "src/client/columns/index.ts",
        "client/masonry": "src/client/masonry/index.ts",
        "client/aggregate": "src/client/aggregate/index.ts",
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
