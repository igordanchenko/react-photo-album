/*
 * If this example does not work correctly in a sandbox,
 * you can download and run it locally
 */

"use client";

import { RowsPhotoAlbum } from "react-photo-album";
import SSR from "react-photo-album/ssr";
import "react-photo-album/rows.css";

import photos from "@/components/photos";

export default function PhotoGallery() {
  return (
    <SSR breakpoints={[240, 380, 600, 900]}>
      <RowsPhotoAlbum
        photos={photos}
        targetRowHeight={200}
        sizes={{
          size: "1168px",
          sizes: [{ viewport: "(max-width: 1200px)", size: "calc(100vw - 32px)" }],
        }}
      />
    </SSR>
  );
}
