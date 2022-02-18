import PhotoAlbum from "react-photo-album";
import photos from "./photos";

const App = () => <PhotoAlbum photos={photos} layout="rows" targetRowHeight={100} />;

export default App;
