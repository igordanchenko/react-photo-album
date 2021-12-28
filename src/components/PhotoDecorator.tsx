import * as React from "react";
import { CSSProperties, MouseEvent } from "react";

import Layout from "../Layout";
import round from "../utils/round";
import ResponsivePhoto from "../ResponsivePhoto";
import { ClickHandler, LayoutOptions, Photo, PhotoLayout, PhotoProps, RenderPhoto } from "../types";

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

type PhotoDecoratorProps<T extends Photo = Photo> = {
    photoProps: Omit<PhotoProps<T>, "style" | "onClick"> & { onClick?: ClickHandler };
    renderPhoto?: RenderPhoto<T>;
};

const PhotoDecorator = <T extends Photo = Photo>(props: PhotoDecoratorProps<T>) => {
    const { photoProps, renderPhoto } = props;
    const { photo, layout, layoutOptions, onClick } = photoProps;

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
    } as CSSProperties;

    const handleClick = onClick
        ? (event: MouseEvent) => {
              onClick(event, photo);
          }
        : undefined;

    const Component = renderPhoto || ResponsivePhoto;

    return (
        <Component photo={photo} layoutOptions={layoutOptions} layout={layout} style={style} onClick={handleClick} />
    );
};

export default PhotoDecorator;