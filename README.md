# React Photo Album

Responsive photo album component for React. Inspired
by [react-photo-gallery](https://github.com/neptunian/react-photo-gallery), re-engineered from the ground up.

## Overview

- **Built for React**: works with React 17 and 16.8.0+
- **SSR friendly**: produces server-side rendered markup that looks pixel perfect on the client.
- **Feature packed**: supports 3 layout options (rows, columns and masonry), responsive images, custom data attributes
  and is fully customizable.
- **Performance**: it was built with performance in mind in order to support large photo albums and silky smooth layout
  adjustments.

## Examples

### Rows Layout

<img src="https://react-photo-album-docs.vercel.app/images/layouts/rows.png" alt="Rows layout"/>

### Columns Layout

<img src="https://react-photo-album-docs.vercel.app/images/layouts/columns.png" alt="Columns layout"/>

### Masonry Layout

<img src="https://react-photo-album-docs.vercel.app/images/layouts/masonry.png" alt="Masonry layout"/>

## Installation

```shell
npm install react-photo-album
```

or

```shell
yarn add react-photo-album
```

## Documentation

[https://react-photo-album-docs.vercel.app/documentation](https://react-photo-album-docs.vercel.app/documentation)

## Minimal Setup Example

```javascript
import PhotoAlbum from 'react-photo-album';

const photos = [
    {
        src: 'https://example.com/example/image1.jpg',
        width: 800,
        height: 600
    },
    {
        src: 'https://example.com/example/image2.jpg',
        width: 1600,
        height: 900
    }
];

<PhotoAlbum layout='rows' photos={photos} />;
```

## Credits

- Thanks to Sandra G (aka [neptunian](https://github.com/neptunian)) for authoring the
  original [react-photo-gallery](https://github.com/neptunian/react-photo-gallery) library that served as inspiration
  and foundation for [react-photo-album](https://github.com/igordanchenko/react-photo-album).
