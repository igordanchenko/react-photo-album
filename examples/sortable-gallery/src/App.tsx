import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import SortableGallery from "./components/SortableGallery";
import photoSet from "./components/photos";

export default function App() {
  const [photos, setPhotos] = useState(photoSet);

  return (
    <SortableGallery
      gallery={RowsPhotoAlbum}
      spacing={16}
      padding={10}
      photos={photos}
      movePhoto={(oldIndex, newIndex) => setPhotos(arrayMove(photos, oldIndex, newIndex))}
    />
  );
}
