# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

React Photo Album is a responsive photo gallery component library for React
(18, 19) with three layout modes: rows, columns, and masonry. It supports SSR,
infinite scroll, and ships with full TypeScript types.

## Common Commands

- **Build**: `npm run build` (clean + tsc + vite + rollup dts + sass + postcss)
- **Dev server**: `npm run dev` (vite dev server using `dev/vite.config.ts`)
- **Watch mode**: `npm start` (clean + parallel watch builds)
- **Test**: `npm test` (vitest run, 100% coverage threshold required)
- **Test with UI**: `npm run test:ui`
- **Lint**: `npm run lint` (eslint flat config)
- **Full CI**: `npm run ci` (build + test + lint)

## Architecture

### Layout Algorithms (`src/layouts/`)

Pure functions that compute photo positions without React dependencies:

- **Rows** (`rows/`): Dijkstra's shortest path algorithm to find optimal row
  breaks minimizing squared deviation from target row height
- **Columns** (`columns/`): Dynamic programming for fixed-column layout
  optimization
- **Masonry** (`masonry/`): Greedy algorithm placing each photo in the shortest
  column

### Component Layers

1. **Static layer** (`src/static/`): Core rendering logic with no hooks,
   SSR-compatible. `StaticPhotoAlbum` renders the computed layout.
2. **Client layer** (`src/client/`): Adds `useContainerWidth` hook
   (ResizeObserver) for responsive behavior. Exports `RowsPhotoAlbum`,
   `ColumnsPhotoAlbum`, `MasonryPhotoAlbum`, and a generic `PhotoAlbum` with a
   `layout` prop.
3. **SSR layer** (`src/ssr/`): Breakpoint-based rendering for zero-CLS
   server-side rendering.
4. **Server layer** (`src/server/`): Server-only component utilities.
5. **Scroll layer** (`src/scroll/`): Infinite scroll with offscreen rendering
   optimization.

### Package Entry Points

The library ships multiple entry points: `.` (main), `./ssr`, `./scroll`,
`./server`, plus CSS files (`./rows.css`, `./columns.css`, `./masonry.css`,
`./styles.css`).

### Build Pipeline

TypeScript check → Vite library build (multiple entries, no minification,
`"use client"` directives via inline Rollup plugin) → Rollup DTS bundling → Sass
compilation → PostCSS (autoprefixer + cssnano).

## Testing

- Tests live in `test/` and use vitest with jsdom environment
- `vitest.setup.ts` stubs `ResizeObserver`, `IntersectionObserver`, and
  `HTMLElement` dimensions
- Coverage thresholds: 100% on all `src/**` files (excluding `index.ts`,
  `types.ts`)

## Code Conventions

- `no-console: error` — no console statements
- Unused variables must be prefixed with `_`
- Prettier: 120 char width (80 for markdown)
- Conventional commits enforced via commitlint
- Types are centralized in `src/types.ts`
