import dts from "rollup-plugin-dts";

function createConfig(format) {
  return {
    input: "src/index.ts",
    output: { format, file: `dist/index.d.${format === "es" ? "mts" : "ts"}` },
    plugins: [dts()],
  };
}

export default [createConfig("es"), createConfig("cjs")];
