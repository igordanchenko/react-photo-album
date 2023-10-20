import * as React from "react";

import { PhotoAlbum } from "../src";
import photos from "./photos";

export default function App() {
  return <PhotoAlbum layout="rows" photos={photos} />;
}
