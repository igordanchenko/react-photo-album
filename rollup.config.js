import dts from "rollup-plugin-dts";

export default {
  input: {
    types: "src/types.ts",
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
    "scroll/index": "src/scroll/index.ts",
    "ssr/index": "src/ssr/index.ts",
  },
  output: { dir: "dist" },
  plugins: [dts()],
};
