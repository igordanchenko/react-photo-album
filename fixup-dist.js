import os from "os";
import fs from "fs";
import path from "path";
import { globSync } from "glob";
import chokidar from "chokidar";

const ROOT = "dist";

/**
 * Read file contents.
 *
 * @param {string} file - file name
 * @returns {string} - file contents
 */
function readFile(file) {
  return fs.readFileSync(path.resolve(file), { encoding: "utf8", flag: "r" });
}

/**
 * Write file contents.
 *
 * @param {string} file - file name
 * @param {string} data - file contents
 */
function writeFile(file, data) {
  fs.writeFileSync(path.resolve(file), data, { encoding: "utf8" });
}

/**
 * Edit file contents.
 *
 * @param {string} file - file name
 * @param {function} callback - callback function
 */
function editFile(file, callback) {
  if (fs.existsSync(file)) {
    let data = readFile(file);
    data = callback(data);
    writeFile(file, data);
  }
}

/**
 * Add type definitions for CSS files.
 *
 * @param {string} file - file name
 */
function fixupCssDefinitions(file) {
  writeFile(`${file}.d.ts`, ["declare const styles: unknown;", "export default styles;"].join(os.EOL));
}

/**
 * Add client boundary.
 *
 * @param {string} file - file name
 */
function fixupClientBoundary(file) {
  editFile(file, (data) => {
    return /import.*(?:useMemo|useState|useRef|useCallback|useReducer).*from\s*['"]react['"]/.test(data) ||
      /import.*from.*\.\/(?:rows|columns|masonry)\.js/.test(data)
      ? ['"use client";', data].join(os.EOL)
      : data;
  });
}

/**
 * Run all fix-ups.
 *
 * @param {boolean} [watchMode] - watch mode flag
 */
function fixup(watchMode) {
  try {
    globSync(`${ROOT}/**/*.js`).forEach((file) => {
      fixupClientBoundary(file);
    });

    globSync(`${ROOT}/**/*.css`).forEach((file) => {
      fixupCssDefinitions(file);
    });

    globSync(`${ROOT}/**/*-*.{js,d\\.ts}`).forEach((file) => {
      // eslint-disable-next-line no-console
      console.error(`Unexpected chunk: ${file}${os.EOL}`);

      if (!watchMode) {
        process.exit(1);
      }
    });
  } catch (error) {
    if (watchMode) {
      // eslint-disable-next-line no-console
      console.error(error);
    } else {
      throw error;
    }
  }
}

/**
 * Run all fix-ups in watch mode.
 */
function watch() {
  let timeout;
  let running = false;
  chokidar.watch(ROOT).on("all", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (!running) {
        running = true;
        try {
          fixup(true);
        } finally {
          running = false;
        }
      }
    }, 3_000);
  });
}

/**
 * Main entrypoint.
 */
function main() {
  if ([...process.argv].includes("-w")) {
    watch();
  } else {
    fixup();
  }
}

main();
