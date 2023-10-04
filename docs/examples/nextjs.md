# Next.js Image

If your project is based on [Next.js](https://nextjs.org/) and you'd like to use
the `next/image` component instead of the standard `<img>` element, you can
easily accomplish this with the `renderPhoto` function:

```tsx
import Image from "next/image";
import type { RenderPhotoProps } from "react-photo-album";

export default function NextJsImage({
  photo,
  imageProps: { alt, title, sizes, className, onClick },
  wrapperStyle,
}: RenderPhotoProps) {
  return (
    <div style={{ ...wrapperStyle, position: "relative" }}>
      <Image
        fill
        src={photo}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
        {...{ alt, title, sizes, className, onClick }}
      />
    </div>
  );
}
```

To have the library produce an accurate `sizes` attribute for each image, you
must provide the `sizes` prop describing your photo album's width at various
viewport conditions.

Examples:

- `sizes={{ size: "100vw" }}`
- `sizes={{ size: "calc(100vw - 240px)" }}`
- `sizes={{ size: "calc(100vw - 240px)", sizes: [{ viewport: "(max-width: 960px)", size: "100vw" }] }}`

```tsx
import PhotoAlbum from "react-photo-album";
import NextJsImage from "./NextJsImage";
import photos from "./photos";

export default function Gallery() {
  return (
    <PhotoAlbum
      layout="rows"
      photos={photos}
      renderPhoto={NextJsImage}
      defaultContainerWidth={1200}
      sizes={{ size: "calc(100vw - 240px)" }}
    />
  );
}
```

## Live Demo

<NextJsExample />

## CodeSandbox

<CodeSandboxLink suffix="nextjs" file="components/PhotoGallery.tsx" />

## Source Code

<GitHubLink suffix="nextjs" />
