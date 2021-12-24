import * as React from "react";

import PhotoDecorator from "./PhotoDecorator";
import ColumnContainer from "./ColumnContainer";
import computeMasonryLayout from "../layouts/masonry";
import { ColumnsLayoutOptions, Instrumentation, Photo, RenderColumnContainer, RenderPhoto } from "../types";

type MasonryLayoutProps<T extends Photo = Photo> = {
    photos: T[];
    layoutOptions: ColumnsLayoutOptions;
    renderPhoto?: RenderPhoto<T>;
    renderColumnContainer?: RenderColumnContainer;
    instrumentation?: Instrumentation;
};

const MasonryLayout = <T extends Photo = Photo>(props: MasonryLayoutProps<T>): JSX.Element => {
    const { photos, layoutOptions, renderPhoto, renderColumnContainer, instrumentation } = props;
    const { onClick } = layoutOptions;

    const masonryLayout = computeMasonryLayout({ photos, layoutOptions, instrumentation });

    if (masonryLayout === undefined) return <></>;

    const Container = renderColumnContainer || ColumnContainer;

    return (
        <>
            {masonryLayout.map((column, columnIndex) => (
                <Container
                    key={`masonry-column-${columnIndex}`}
                    layoutOptions={layoutOptions}
                    columnsCount={masonryLayout.length}
                    columnIndex={columnIndex}
                >
                    {column.map(({ photo, layout }) => (
                        <PhotoDecorator
                            key={photo.key || photo.src}
                            photoProps={{
                                photo,
                                layout,
                                onClick,
                                layoutOptions,
                            }}
                            renderPhoto={renderPhoto}
                        />
                    ))}
                </Container>
            ))}
        </>
    );
};

export default MasonryLayout;
