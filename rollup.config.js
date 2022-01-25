import peerDeps from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";
import pkg from "./package.json";

const dist = "dist";
const input = "src/index.ts";

const esmBundle = "index.esm.js";
const cjsBundle = "index.cjs.js";
const umdBundle = "index.umd.js";

const formats = [
    { format: "esm", file: `${dist}/${esmBundle}` },
    { format: "cjs", file: `${dist}/${cjsBundle}` },
    { format: "umd", file: `${dist}/${umdBundle}`, globals: { react: "React" }, name: "ReactPhotoAlbum" },
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
