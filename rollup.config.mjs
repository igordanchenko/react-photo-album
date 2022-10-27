import fs from "fs";
import path from "path";
import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

// import from JSON currently fails under Node 14
// import pkg from "./package.json" assert { type: "json" };
const pkg = JSON.parse(fs.readFileSync(path.resolve("package.json"), { encoding: "utf8", flag: "r" }));

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
            typescript({
                exclude: ["examples/**/*"],
                compilerOptions: { removeComments: true },
            }),
        ],
    },
    {
        input,
        output: [{ format: "esm", file: pkg.types }],
        plugins: [dts()],
    },
];
