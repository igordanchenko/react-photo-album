import PhotoAlbum from "../src";
import photos from "./photos";

import "../src/styles/styles.scss";

export default function App() {
  return (
    <PhotoAlbum
      layout="rows"
      photos={photos}
      sizes={{
        size: "1168px",
        sizes: [{ viewport: "(max-width: 1200px)", size: "calc(100vw - 32px)" }],
      }}
    />
  );
}
