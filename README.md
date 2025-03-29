# React Photo Album

React Photo Album is a responsive photo gallery component for React. React Photo
Album supports rows, columns, and masonry layouts. Inspired by
[react-photo-gallery](https://github.com/neptunian/react-photo-gallery),
re-engineered from the ground up.

## Overview

[![NPM Version](https://img.shields.io/npm/v/react-photo-album.svg?color=blue)](https://www.npmjs.com/package/react-photo-album)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-photo-album.svg?color=blue)](https://bundlephobia.com/package/react-photo-album)
[![License MIT](https://img.shields.io/npm/l/react-photo-album.svg?color=blue)](https://github.com/igordanchenko/react-photo-album/blob/main/LICENSE)

- **Built for React:** works with React 18+
- **SSR friendly:** produces server-side rendered markup that looks pixel
  perfect on the client even before hydration
- **Responsive images:** responsive images with automatic resolution switching
  are supported out of the box
- **Feature packed:** supports 3 layout options (rows, columns and masonry),
  responsive images, custom data attributes and is fully configurable and
  customizable
- **TypeScript:** type definitions come built-in in the package
- **Performance:** it was built with performance in mind in order to support
  large photo albums

## Layouts

### Rows

![Rows layout](https://images.react-photo-album.com/layouts/rows.jpg)

### Columns

![Columns layout](https://images.react-photo-album.com/layouts/columns.jpg)

### Masonry

![Masonry layout](https://images.react-photo-album.com/layouts/masonry.jpg)

## Documentation

[https://react-photo-album.com/documentation](https://react-photo-album.com/documentation)

## Examples

[https://react-photo-album.com/examples](https://react-photo-album.com/examples)

## Changelog

[https://github.com/igordanchenko/react-photo-album/releases](https://github.com/igordanchenko/react-photo-album/releases)

## Installation

```shell
npm install react-photo-album
```

## Requirements

- React 18+
- Node 18+
- modern ESM-compatible bundler

## Minimal Setup Example

```tsx
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

const photos = [
  { src: "/image1.jpg", width: 800, height: 600 },
  { src: "/image2.jpg", width: 1600, height: 900 },
];

export default function Gallery() {
  return <RowsPhotoAlbum photos={photos} />;
}
```

## How It Works

### Rows Layout

Rows layout fills the container space by arranging photos into rows that are
similar in height, with the height of each row being as close to the
`targetRowHeight` as possible. This layout uses an algorithm adapted from the
Knuth and Plass line-breaking algorithm. To calculate the optimal layout, it
uses Dijkstra's algorithm to find the shortest path in a graph where each photo
to break on represents a node, and each row represents an edge. The cost of each
edge is calculated as a squared deviation from the `targetRowHeight`. This
algorithm produces rows that are similar in height and photos that are not
stretched or abnormally shrunk (as what happens in a naive implementation). It
solves the issue of panoramas shrinking rows or having stragglers or stretched
images in the last row.

### Columns Layout

Columns layout fills the container space by arranging photos into a predefined
number of columns, determined by the `columns` parameter. This layout uses an
algorithm very similar to the one described above, with the only difference
being that instead of Dijkstra's algorithm, it uses a dynamic programming
algorithm to find the shortest path of length N in a directed weighted graph.

### Masonry Layout

Masonry layout arranges photos into columns of equal width by placing each photo
into the shortest column. This layout does not fill the container space flush to
its bottom edge, but the columns end up being as close in height to each other
as possible.

### Responsive Images

React Photo Album can automatically produce `sizes` and `srcset` image
attributes. In the case of SSR, React Photo Album includes `sizes` and `srcset`
image attributes in the server-rendered markup, allowing browsers to pick images
of the most appropriate resolution depending on the end-user viewport size. To
utilize images with automatic resolution switching, provide images of different
resolutions in the photo `srcSet` attribute. To further improve app
responsiveness and bandwidth utilization, you can specify the `sizes` prop that
describes the width of the photo album in various viewports.

```tsx
import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

const photos = [
  {
    src: "/image1_800x600.jpg",
    width: 800,
    height: 600,
    srcSet: [
      { src: "/image1_400x300.jpg", width: 400, height: 300 },
      { src: "/image1_200x150.jpg", width: 200, height: 150 },
    ],
  },
  {
    src: "/image2_1600x900.jpg",
    width: 1600,
    height: 900,
    srcSet: [
      { src: "/image2_800x450.jpg", width: 800, height: 450 },
      { src: "/image2_400x225.jpg", width: 400, height: 225 },
    ],
  },
];

export default function Gallery() {
  return (
    <RowsPhotoAlbum
      photos={photos}
      sizes={{
        size: "1168px",
        sizes: [
          {
            viewport: "(max-width: 1200px)",
            size: "calc(100vw - 32px)",
          },
        ],
      }}
    />
  );
}
```

### SSR

React Photo Album extensively uses CSS flexbox and CSS `calc` functions to
calculate images' dimensions on the client. Thanks to this approach, server-side
rendered markup looks pixel-perfect on the client even before hydration. To
enable server-side rendering, specify the `defaultContainerWidth` prop.
Otherwise, React Photo Album produces an empty markup on the server and renders
on the client only after hydration. Please note that unless your photo album is
of constant width that always matches the `defaultContainerWidth` value, you
will most likely see a layout shift immediately after hydration. Alternatively,
you can provide a fallback skeleton in the `skeleton` prop that will be rendered
in SSR and swapped with the actual photo album markup after hydration. Please
also refer to the
[Server-Side Rendering](<https://react-photo-album.com/documentation#Server-SideRendering(SSR)>)
documentation for a comprehensive list of available solutions.

## Credits

Thanks to Sandra G (aka [neptunian](https://github.com/neptunian)) for authoring
the original
[react-photo-gallery](https://github.com/neptunian/react-photo-gallery) library
that served as inspiration and foundation for
[react-photo-album](https://github.com/igordanchenko/react-photo-album).

## License

MIT © 2021 [Igor Danchenko](https://github.com/igordanchenko)
