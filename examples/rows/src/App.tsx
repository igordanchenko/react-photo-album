import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import photos from "./photos";

export default function App() {
  return <RowsPhotoAlbum photos={photos} />;
}
