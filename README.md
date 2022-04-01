# React Photo Album

React Photo Album is a responsive photo gallery component for React. React Photo Album supports rows, columns, and
masonry layouts. Inspired by [react-photo-gallery](https://github.com/neptunian/react-photo-gallery), re-engineered from
the ground up.

## Overview

[![NPM Version](https://img.shields.io/npm/v/react-photo-album?color=blue)](https://www.npmjs.com/package/react-photo-album)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-photo-album?color=blue)](https://bundlephobia.com/package/react-photo-album)
[![License MIT](https://img.shields.io/npm/l/react-photo-album?color=blue)](LICENSE)

- **Built for React:** works with React 18, 17 and 16.14.0+
- **SSR friendly:** produces server-side rendered markup that looks pixel perfect on the client even before hydration.
- **Responsive images:** responsive images with automatic resolution switching are supported out of the box.
- **Feature packed:** supports 3 layout options (rows, columns and masonry), responsive images, custom data attributes
  and is fully configurable and customizable.
- **TypeScript:** type definitions come built-in in the package.
- **Performance:** it was built with performance in mind in order to support large photo albums and silky smooth layout
  adjustments.

## Examples

### Rows

![Rows layout](https://react-photo-album.com/images/layouts/rows.jpg)

### Columns

![Columns layout](https://react-photo-album.com/images/layouts/columns.jpg)

### Masonry

![Masonry layout](https://react-photo-album.com/images/layouts/masonry.jpg)

All examples are available on [CodeSandbox](https://codesandbox.io/examples/package/react-photo-album).

## Documentation

[https://react-photo-album.com/](https://react-photo-album.com/)

## Installation

```shell
npm install react-photo-album
```

or

```shell
yarn add react-photo-album
```

## Minimal Setup Example

```javascript
import PhotoAlbum from "react-photo-album";

const photos = [
    {
        src: "/images/image1.jpg",
        width: 800,
        height: 600
    },
    {
        src: "/images/image2.jpg",
        width: 1600,
        height: 900
    }
];

<PhotoAlbum layout="rows" photos={photos} />
```

## How It Works

### Rows Layout

Rows layout fills the rectangular container space by arranging photos into rows that are similar in size, with the
height of each row being as close to the `targetRowHeight` as possible. This layout uses an algorithm adapted from the
Knuth and Plass line breaking algorithm. To calculate the single best layout, it uses Dijkstra's algorithm to find the
shortest past in a graph where each photo to break on represents a node, and each row represents an edge. The cost of
each edge is calculated as the squared deviation from the `targetRowHeight`. This algorithm produces rows that are
similar in height and photos that are not being stretched or shrunken abnormally (as is what happens in a naive
implementation). It solves the issue of panoramas shrinking rows or having stragglers or stretched images in the last
row, instead creating a justified grid. The graph is being built as the shortest path is being calculated to improve
algorithm's performance, so the entire adjacency list is not calculated ahead of time.

### Columns Layout

Columns layout fills the rectangular container space by arranging photos into a predefined number of columns, determined
by the `columns` parameter. This layout uses an algorithm very similar to the one described above, but instead of
Dijkstra's algorithm, it uses a dynamic programming algorithm to find the shortest path of length N in a directed
weighted graph.

### Masonry Layout

Masonry layout arranges photos into columns of equal width by placing each photo into the shortest column. This layout
does not completely fill the rectangular container space, but the columns end up being as close in height to each other
as possible.

### Responsive Images

React Photo Album automatically generates `sizes` and `srcset` image attributes. In the case of SSR, React Photo Album
includes `sizes` and `srcset` image attributes in the server-rendered markup, allowing browsers to pick images of the
most appropriate resolution depending on their viewport size.

### SSR

React Photo Album extensively uses CSS flexbox and CSS `calc` function to calculate the dimensions of images on the
client. Unlike its predecessor, React Photo Album avoids setting the exact dimensions of images in pixels. Thanks to
this approach, server-side rendered markup looks pixel-perfect on the client even before hydration (or even when
JavaScript is completely disabled in the browser). React Photo Album calculates `spacing`, `padding`, `columns`, and
other responsive parameters on the server-side using the `defaultContainerWidth` value, which is set to 800px by
default. Keep in mind that responsive parameters may contribute to cumulative layout shifts during the initial page
load. If CLS becomes an issue in your case, you may want to consider using hard-coded values for `columns`, `spacing`
, `padding`, etc., instead of the default responsive values.

### ResizeObserver

React Photo Album relies on [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) to respond
to container size changes (i.e., when the browser window gets resized, device orientation changes or page layout causes
a shift in container dimensions). React Photo Album no longer bundles ResizeObserver polyfill as part of the library
since, as of January 2022, over 91% of browsers support it natively. If your use case requires you to support some older
browsers, you can accomplish this by either installing a global ResizeObserver polyfill or by supplying a ponyfill via
the `resizeObserverProvider` parameter.

## Credits

- Thanks to Sandra G (aka [neptunian](https://github.com/neptunian)) for authoring the
  original [react-photo-gallery](https://github.com/neptunian/react-photo-gallery) library that served as inspiration
  and foundation for [react-photo-album](https://github.com/igordanchenko/react-photo-album).
