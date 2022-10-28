import PhotoAlbum from "react-photo-album";
import photos from "./photos";

const App = () => (
    <PhotoAlbum
        photos={photos}
        layout="columns"
        componentsProps={{ containerProps: { style: { maxWidth: 1200, margin: "0 auto" } } }}
        defaultContainerWidth={800}
        columns={4}
        spacing={10}
        padding={0}
    />
);

export default App;
