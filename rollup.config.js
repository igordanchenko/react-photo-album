import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

import pkg from "./package.json";

const input = "src/index.ts";

export default [
    {
        input,
        output: [
            { format: "esm", file: pkg.module },
            { format: "cjs", file: pkg.main, exports: "named" },
        ],
        plugins: [
            external(),
            resolve(),
            commonjs(),
            typescript({ tsconfigOverride: { compilerOptions: { removeComments: true } } }),
        ],
    },
    {
        input,
        output: [{ file: pkg.types, format: "es" }],
        plugins: [dts()],
    },
];
