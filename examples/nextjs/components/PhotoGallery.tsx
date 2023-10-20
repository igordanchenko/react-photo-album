"use client";

import PhotoAlbum from "react-photo-album";

import NextJsImage from "@/components/NextJsImage";
import photos from "@/components/photos";

export default function PhotoGallery() {
  return (
    <PhotoAlbum
      photos={photos}
      layout="rows"
      renderPhoto={NextJsImage}
      defaultContainerWidth={1200}
      sizes={{
        size: "calc(100vw - 40px)",
        sizes: [
          { viewport: "(max-width: 299px)", size: "calc(100vw - 10px)" },
          { viewport: "(max-width: 599px)", size: "calc(100vw - 20px)" },
          { viewport: "(max-width: 1199px)", size: "calc(100vw - 30px)" },
        ],
      }}
    />
  );
}
