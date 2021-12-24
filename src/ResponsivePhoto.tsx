import * as React from "react";

import { Photo, PhotoProps } from "./types";

const ResponsivePhoto = <T extends Photo = Photo>({
    layout,
    layoutOptions: { containerWidth },
    photo: { src, width, height, alt, title, images },
    style,
    onClick,
}: PhotoProps<T>) => {
    let srcSet;
    let sizes;
    if (images && images.length > 0) {
        srcSet = images
            .concat([
                {
                    src,
                    width,
                    height,
                },
            ])
            .sort((first, second) => first.width - second.width)
            .map((image) => `${image.src} ${image.width}w`)
            .join(", ");
        const viewportWidth = (typeof window !== "undefined" ? window.innerWidth : undefined) ?? containerWidth;
        sizes = `${Math.ceil((layout.width / viewportWidth) * 100)}vw`;
    }

    return (
        <img
            src={src}
            alt={alt}
            title={title}
            style={style}
            onClick={onClick}
            sizes={sizes}
            srcSet={srcSet}
            className={"react-photo-album--photo"}
        />
    );
};

export default ResponsivePhoto;
