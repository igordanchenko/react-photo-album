import dts from "rollup-plugin-dts";

export default {
  input: {
    types: "src/types.ts",
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
  output: { dir: "dist" },
  plugins: [dts()],
};
