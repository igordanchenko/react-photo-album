import peerDeps from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";

const input = "src/index.ts";

const formats = [
    { format: "esm", file: "dist/index.esm.js" },
    { format: "cjs", file: "dist/index.cjs.js" },
];

// noinspection JSCheckFunctionSignatures
export default formats
    .map((output) => ({
        input,
        output: [
            {
                ...output,
                sourcemap: true,
                exports: "named",
            },
        ],
        plugins: [
            peerDeps(),
            resolve(),
            commonjs(),
            typescript(),
            babel({
                babelHelpers: "bundled",
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            }),
            output.format !== "esm" && terser(),
        ].filter(Boolean),
    }))
    .concat([
        {
            input,
            output: [{ file: pkg.types, format: "es" }],
            plugins: [dts()],
        },
    ]);
