import dts from "rollup-plugin-dts";

export default {
  input: "src/index.ts",
  output: { dir: "dist" },
  plugins: [dts()],
};
