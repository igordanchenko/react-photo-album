import PhotoAlbum from "react-photo-album";
import photos from "./photos";

export default function App() {
  return <PhotoAlbum layout="columns" photos={photos} />;
}
