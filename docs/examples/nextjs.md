# Next.js Image

If your project is based on [Next.js](https://nextjs.org/) and you'd like to use
the `next/image` component instead of the standard `<img>` element, you can
easily accomplish this with the `render.image` function:

```tsx
"use client";

import Image from "next/image";
import {
  RenderImageContext,
  RenderImageProps,
  RowsPhotoAlbum,
} from "react-photo-album";
import "react-photo-album/rows.css";

import photos from "@/components/photos";

function renderNextImage(
  { alt = "", title, sizes }: RenderImageProps,
  { photo, width, height }: RenderImageContext,
) {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <Image
        fill
        src={photo}
        alt={alt}
        title={title}
        sizes={sizes}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
      />
    </div>
  );
}

export default function PhotoGallery() {
  return (
    <RowsPhotoAlbum
      photos={photos}
      render={{ image: renderNextImage }}
      defaultContainerWidth={1200}
      sizes={{
        size: "1168px",
        sizes: [
          { viewport: "(max-width: 1200px)", size: "calc(100vw - 32px)" },
        ],
      }}
    />
  );
}
```

## Live Demo

<NextJsExample />

## Sandbox

<StackBlitzLink href="github/igordanchenko/react-photo-album/tree/next/examples/nextjs" file="components/PhotoGallery.tsx" title="react-photo-album-nextjs" description="react-photo-album Next.js example" />

## Source Code

<GitHubLink suffix="nextjs" />
