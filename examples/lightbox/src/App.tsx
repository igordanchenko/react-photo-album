import { useState } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

import photos from "./photos";

const App = () => {
    const [index, setIndex] = useState<number>(-1);

    return (
        <>
            <PhotoAlbum
                photos={photos}
                layout="rows"
                onClick={(event, photo, index) => {
                    setIndex(index);
                }}
            />
            {index >= 0 && (
                <Lightbox
                    enableZoom={false}
                    clickOutsideToClose={false}
                    mainSrc={photos[index].src}
                    nextSrc={photos[(index + 1) % photos.length].src}
                    prevSrc={photos[(index + photos.length - 1) % photos.length].src}
                    onCloseRequest={() => setIndex(-1)}
                    onMovePrevRequest={() => setIndex((index + photos.length - 1) % photos.length)}
                    onMoveNextRequest={() => setIndex((index + 1) % photos.length)}
                />
            )}
        </>
    );
};

export default App;
