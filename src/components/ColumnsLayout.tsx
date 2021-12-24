import React from "react";

import PhotoDecorator from "./PhotoDecorator";
import ColumnContainer from "./ColumnContainer";
import computeColumnsLayout from "../layouts/columns";
import { ColumnsLayoutOptions, Instrumentation, Photo, RenderColumnContainer, RenderPhoto } from "../types";

type ColumnsLayoutProps<T extends Photo = Photo> = {
    photos: T[];
    layoutOptions: ColumnsLayoutOptions;
    renderPhoto?: RenderPhoto<T>;
    renderColumnContainer?: RenderColumnContainer;
    instrumentation?: Instrumentation;
};

const ColumnsLayout = <T extends Photo = Photo>(props: ColumnsLayoutProps<T>): JSX.Element => {
    const { photos, layoutOptions, renderPhoto, renderColumnContainer, instrumentation } = props;
    const { onClick } = layoutOptions;

    const Container = renderColumnContainer || ColumnContainer;

    const columnsLayout = computeColumnsLayout({ photos, layoutOptions, instrumentation });

    if (columnsLayout === undefined) return <></>;

    const { columnsModel, columnsRatios, columnsGaps } = columnsLayout;

    return (
        <>
            {columnsModel.map((column, columnIndex) => (
                <Container
                    key={`column-${columnIndex}`}
                    layoutOptions={layoutOptions}
                    columnIndex={columnIndex}
                    columnsCount={columnsModel.length}
                    columnsGaps={columnsGaps}
                    columnsRatios={columnsRatios}
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

export default ColumnsLayout;
