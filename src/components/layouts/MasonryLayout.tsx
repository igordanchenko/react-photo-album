import * as React from "react";

import computeMasonryLayout from "../../layouts/masonry";
import PhotoRenderer from "../renderers/PhotoRenderer";
import ColumnContainerRenderer from "../renderers/ColumnContainerRenderer";
import { ColumnsLayoutOptions, Instrumentation, Photo, RenderColumnContainer, RenderPhoto } from "../../types";

type MasonryLayoutProps<T extends Photo = Photo> = {
    photos: T[];
    layoutOptions: ColumnsLayoutOptions;
    renderPhoto?: RenderPhoto<T>;
    renderColumnContainer?: RenderColumnContainer;
    instrumentation?: Instrumentation;
};

const MasonryLayout = <T extends Photo = Photo>(props: MasonryLayoutProps<T>): JSX.Element => {
    const { photos, layoutOptions, renderPhoto, renderColumnContainer, instrumentation } = props;

    const masonryLayout = computeMasonryLayout({ photos, layoutOptions, instrumentation });

    if (masonryLayout === undefined) return <></>;

    return (
        <>
            {masonryLayout.map((column, columnIndex) => (
                <ColumnContainerRenderer
                    key={`masonry-column-${columnIndex}`}
                    layoutOptions={layoutOptions}
                    columnsCount={masonryLayout.length}
                    columnIndex={columnIndex}
                    renderColumnContainer={renderColumnContainer}
                >
                    {column.map(({ photo, layout }) => (
                        <PhotoRenderer
                            key={photo.key || photo.src}
                            photo={photo}
                            layout={layout}
                            layoutOptions={layoutOptions}
                            renderPhoto={renderPhoto}
                        />
                    ))}
                </ColumnContainerRenderer>
            ))}
        </>
    );
};

export default MasonryLayout;
