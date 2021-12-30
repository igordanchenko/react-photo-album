import * as React from "react";

import Layout from "../../Layout";
import round from "../../utils/round";
import { LayoutOptions, Photo, PhotoLayout, RenderPhoto } from "../../types";

const cssWidth = (photoLayout: PhotoLayout, layoutOptions: LayoutOptions) => {
    const { width } = photoLayout;
    const { spacing, padding, layout, containerWidth } = layoutOptions;

    if (layout !== Layout.Rows) {
        return `calc(100% - ${2 * padding}px)`;
    }

    const rowSize = photoLayout.photosCount;
    return `calc((100% - ${spacing * (rowSize - 1) + 2 * padding * rowSize}px) / ${round(
        (containerWidth - spacing * (rowSize - 1) - 2 * padding * rowSize) / width,
        5
    )})`;
};

const srcSetAndSizes = <T extends Photo = Photo>({
    photo,
    layout,
    layoutOptions,
}: {
    photo: T;
    layout: PhotoLayout;
    layoutOptions: LayoutOptions;
}) => {
    let srcSet;
    let sizes;

    if (photo.images && photo.images.length > 0) {
        srcSet = photo.images
            .concat([
                {
                    src: photo.src,
                    width: photo.width,
                    height: photo.height,
                },
            ])
            .sort((first, second) => first.width - second.width)
            .map((image) => `${image.src} ${image.width}w`)
            .join(", ");
        sizes = `${Math.ceil((layout.width / (layoutOptions.viewportWidth || layoutOptions.containerWidth)) * 100)}vw`;
    }

    return { srcSet, sizes };
};

const DefaultPhotoRenderer = ({ imageProps }: { imageProps: React.ImgHTMLAttributes<HTMLImageElement> }) => {
    const { alt, ...rest } = imageProps;
    return <img alt={alt || ""} {...rest} />;
};

type PhotoRendererProps<T extends Photo = Photo> = {
    photo: T;
    layout: PhotoLayout;
    layoutOptions: LayoutOptions;
    renderPhoto?: RenderPhoto<T>;
};

const PhotoRenderer = <T extends Photo = Photo>(props: PhotoRendererProps<T>) => {
    const { photo, layout, layoutOptions, renderPhoto } = props;
    const { onClick } = layoutOptions;

    const style = {
        display: "block",
        boxSizing: "content-box",
        width: cssWidth(layout, layoutOptions),
        height: "auto",
        aspectRatio: `${photo.width} / ${photo.height}`,
        ...(layoutOptions.padding ? { padding: `${layoutOptions.padding}px` } : null),
        ...((layoutOptions.layout === Layout.Columns || layoutOptions.layout === Layout.Masonry) &&
        layout.photoIndex < layout.photosCount - 1
            ? { marginBottom: `${layoutOptions.spacing}px` }
            : null),
        ...(onClick ? { cursor: "pointer" } : null),
    } as React.CSSProperties;

    const handleClick = onClick
        ? (event: React.MouseEvent) => {
              onClick(event, photo);
          }
        : undefined;

    const { srcSet, sizes } = srcSetAndSizes({ photo, layout, layoutOptions });

    const imageProps = {
        src: photo.src,
        alt: photo.alt,
        title: photo.title,
        onClick: handleClick,
        style,
        sizes,
        srcSet,
        className: "react-photo-album--photo",
    };

    const Component = renderPhoto || DefaultPhotoRenderer;

    return <Component photo={photo} layoutOptions={layoutOptions} layout={layout} imageProps={imageProps} />;
};

export default PhotoRenderer;
