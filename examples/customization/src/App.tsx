import { useState } from "react";

// yet-another-react-lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// react-photo-album
import { Photo, RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import { SelectIcon, StyledLink } from "./components";
import allPhotos from "./photos";

type SelectablePhoto = Photo & {
  selected?: boolean;
};

export default function App() {
  // photos array
  const [photos, setPhotos] = useState<SelectablePhoto[]>(() =>
    allPhotos.map((photo) => ({
      ...photo,
      href: photo.src,
      label: "Open image in a lightbox",
    })),
  );
  // lightbox photo
  const [lightboxPhoto, setLightboxPhoto] = useState<SelectablePhoto>();

  return (
    <>
      <RowsPhotoAlbum
        photos={photos}
        targetRowHeight={150}
        // custom render functions
        render={{
          // render custom styled link
          link: (props) => <StyledLink {...props} />,
          // render image selection icon
          extras: (_, { photo: { selected }, index }) => (
            <SelectIcon
              selected={selected}
              onClick={(event) => {
                setPhotos((prevPhotos) => {
                  const newPhotos = [...prevPhotos];
                  newPhotos[index].selected = !selected;
                  return newPhotos;
                });

                // prevent the event from propagating to the parent link element
                event.preventDefault();
                event.stopPropagation();
              }}
            />
          ),
        }}
        // custom components' props
        componentsProps={{
          link: ({ photo: { href } }) =>
            // add target="_blank" and rel="noreferrer noopener" to external links
            href?.startsWith("http") ? { target: "_blank", rel: "noreferrer noopener" } : undefined,
        }}
        // on click callback
        onClick={({ event, photo }) => {
          // let a link open in a new tab / new window / download
          if (event.shiftKey || event.altKey || event.metaKey) return;

          // prevent the default link behavior
          event.preventDefault();

          // open photo in a lightbox
          setLightboxPhoto(photo);
        }}
        // describe photo album size in different viewports
        sizes={{
          size: "1168px",
          sizes: [{ viewport: "(max-width: 1200px)", size: "calc(100vw - 32px)" }],
        }}
        // re-calculate the layout only at specific breakpoints
        breakpoints={[220, 360, 480, 600, 900, 1200]}
      />

      <Lightbox
        open={Boolean(lightboxPhoto)}
        close={() => setLightboxPhoto(undefined)}
        slides={lightboxPhoto ? [lightboxPhoto] : undefined}
        carousel={{ finite: true }}
        render={{ buttonPrev: () => null, buttonNext: () => null }}
        styles={{ root: { "--yarl__color_backdrop": "rgba(0, 0, 0, .8)" } }}
        controller={{ closeOnBackdropClick: true, closeOnPullUp: true, closeOnPullDown: true }}
      />
    </>
  );
}
