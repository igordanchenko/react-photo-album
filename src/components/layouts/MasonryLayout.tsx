import * as React from "react";

import computeMasonryLayout from "../../layouts/masonry";
import PhotoRenderer from "../renderers/PhotoRenderer";
import ColumnContainerRenderer from "../renderers/ColumnContainerRenderer";
import { ColumnsLayoutOptions, ComponentsProps, Photo, RenderColumnContainer, RenderPhoto } from "../../types";

export type MasonryLayoutProps<T extends Photo = Photo> = {
    photos: T[];
    layoutOptions: ColumnsLayoutOptions<T>;
    filterOptions?: string;
    renderPhoto?: RenderPhoto<T>;
    renderColumnContainer?: RenderColumnContainer<T>;
    componentsProps?: ComponentsProps;
};

export default function MasonryLayout<T extends Photo = Photo>(props: MasonryLayoutProps<T>) {
    const { photos, layoutOptions, filterOptions, renderPhoto, renderColumnContainer, componentsProps } = props;

    const masonryLayout = computeMasonryLayout({ photos, layoutOptions });

    if (!masonryLayout) return null;

    return (
        <>
            {masonryLayout.map((column, columnIndex) => (
                <ColumnContainerRenderer
                    // eslint-disable-next-line react/no-array-index-key
                    key={`masonry-column-${columnIndex}`}
                    layoutOptions={layoutOptions}
                    columnsCount={masonryLayout.length}
                    columnIndex={columnIndex}
                    renderColumnContainer={renderColumnContainer}
                    columnContainerProps={componentsProps?.columnContainerProps}
                >
                    {column.map(({ photo, layout }) => (
                        <PhotoRenderer
                            key={photo.key || photo.src}
                            photo={photo}
                            layout={layout}
                            layoutOptions={layoutOptions}
                            filterOptions={filterOptions}
                            renderPhoto={renderPhoto}
                            imageProps={componentsProps?.imageProps}
                        />
                    ))}
                </ColumnContainerRenderer>
            ))}
        </>
    );
}
