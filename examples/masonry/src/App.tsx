import { MasonryPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";

import photos from "./photos";

export default function App() {
  return <MasonryPhotoAlbum photos={photos} />;
}
