import { ColumnsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";

import photos from "./photos";

export default function App() {
  return <ColumnsPhotoAlbum photos={photos} />;
}
