/*
 * If this example does not work correctly in a sandbox,
 * you can download and run it locally
 */

"use client";

import Image from "next/image";
import { RenderImageContext, RenderImageProps, RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import photos from "@/components/photos";

function renderNextImage({ alt = "", title, sizes }: RenderImageProps, { photo, width, height }: RenderImageContext) {
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
        sizes: [{ viewport: "(max-width: 1200px)", size: "calc(100vw - 32px)" }],
      }}
    />
  );
}
