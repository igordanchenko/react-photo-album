import { UnstableServerPhotoAlbum as ServerPhotoAlbum } from "react-photo-album/server";
import "react-photo-album/rows.css";

import photos from "@/app/photos";

export default function Home() {
  return (
    <ServerPhotoAlbum
      layout="rows"
      photos={photos}
      targetRowHeight={200}
      breakpoints={[300, 600, 900]}
      sizes={{
        size: "1168px",
        sizes: [{ viewport: "(max-width: 1200px)", size: "calc(100vw - 32px)" }],
      }}
    />
  );
}
