import * as React from "react";
import { CSSProperties, MouseEvent } from "react";

import Layout from "../Layout";
import round from "../utils/round";
import ResponsivePhoto from "../ResponsivePhoto";
import { ClickHandler, LayoutOptions, Photo, PhotoLayout, PhotoProps, RenderPhoto } from "../types";

const cssWidth = (photoLayout: PhotoLayout, layoutOptions: LayoutOptions) => {
    const rowSize = photoLayout.photosCount;
    return `calc((100% - ${layoutOptions.spacing * (rowSize - 1) + 2 * layoutOptions.padding * rowSize}px) / ${round(
        (layoutOptions.containerWidth - layoutOptions.spacing * (rowSize - 1) - 2 * layoutOptions.padding * rowSize) /
            (photoLayout.width - 2 * layoutOptions.padding),
        5
    )} + ${2 * layoutOptions.padding}px)`;
};

type PhotoDecoratorProps<T extends Photo = Photo> = {
    photoProps: Omit<PhotoProps<T>, "style" | "onClick"> & { onClick?: ClickHandler };
    renderPhoto?: RenderPhoto<T>;
};

const PhotoDecorator = <T extends Photo = Photo>(props: PhotoDecoratorProps<T>) => {
    const { photoProps, renderPhoto } = props;
    const { photo, layout, layoutOptions, onClick } = photoProps;

    const style = {
        ...(onClick ? { cursor: "pointer" } : null),
        boxSizing: "border-box",
        display: "block",
        height: "auto",
        width: layoutOptions.layout === Layout.Rows ? cssWidth(layout, layoutOptions) : "100%",
        aspectRatio: `${photo.width} / ${photo.height}`,
        ...(layoutOptions.padding ? { padding: `${layoutOptions.padding}px` } : null),
        ...((layoutOptions.layout === Layout.Columns || layoutOptions.layout === Layout.Masonry) &&
        layout.photoIndex < layout.photosCount - 1
            ? { marginBottom: `${layoutOptions.spacing}px` }
            : null),
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
