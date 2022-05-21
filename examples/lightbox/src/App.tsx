import { useState } from "react";

import PhotoAlbum from "react-photo-album";
import { Lightbox } from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";
import photos from "./photos";

const slides = photos.map(({ src, width, height, images }) => ({
    src,
    aspectRatio: width / height,
    srcSet: images.map((image) => ({
        src: image.src,
        width: image.width,
    })),
}));

const App = () => {
    const [index, setIndex] = useState(-1);

    return (
        <>
            <PhotoAlbum
                photos={photos}
                layout="rows"
                targetRowHeight={150}
                onClick={(event, photo, index) => setIndex(index)}
            />

            <Lightbox slides={slides} open={index >= 0} index={index} close={() => setIndex(-1)} />
        </>
    );
};

export default App;
