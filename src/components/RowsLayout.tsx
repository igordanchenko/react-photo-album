import * as React from "react";

import RowContainer from "./RowContainer";
import PhotoDecorator from "./PhotoDecorator";
import computeRowsLayout from "../layouts/rows";
import { Instrumentation, Photo, RenderPhoto, RenderRowContainer, RowsLayoutOptions } from "../types";

type RowsLayoutProps<T extends Photo = Photo> = {
    photos: T[];
    layoutOptions: RowsLayoutOptions;
    renderPhoto?: RenderPhoto<T>;
    renderRowContainer?: RenderRowContainer;
    instrumentation?: Instrumentation;
};

const RowsLayout = <T extends Photo = Photo>(props: RowsLayoutProps<T>): JSX.Element => {
    const { photos, layoutOptions, renderPhoto, renderRowContainer, instrumentation } = props;
    const { onClick } = layoutOptions;

    const Container = renderRowContainer || RowContainer;

    const rowsLayout = computeRowsLayout({ photos, layoutOptions, instrumentation });

    if (rowsLayout === undefined) return <></>;

    return (
        <>
            {rowsLayout.map((row, rowIndex) => (
                <Container
                    key={`row-${rowIndex}`}
                    layoutOptions={layoutOptions}
                    rowIndex={rowIndex}
                    rowsCount={rowsLayout.length}
                >
                    {row.map(({ photo, layout }) => (
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

export default RowsLayout;
