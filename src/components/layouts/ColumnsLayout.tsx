import React from "react";

import PhotoRenderer from "../renderers/PhotoRenderer";
import ColumnContainerRenderer from "../renderers/ColumnContainerRenderer";
import computeColumnsLayout from "../../layouts/columns";
import { ColumnsLayoutOptions, Instrumentation, Photo, RenderColumnContainer, RenderPhoto } from "../../types";

type ColumnsLayoutProps<T extends Photo = Photo> = {
    photos: T[];
    layoutOptions: ColumnsLayoutOptions;
    renderPhoto?: RenderPhoto<T>;
    renderColumnContainer?: RenderColumnContainer;
    instrumentation?: Instrumentation;
};

const ColumnsLayout = <T extends Photo = Photo>(props: ColumnsLayoutProps<T>): JSX.Element => {
    const { photos, layoutOptions, renderPhoto, renderColumnContainer, instrumentation } = props;

    const columnsLayout = computeColumnsLayout({ photos, layoutOptions, instrumentation });

    if (columnsLayout === undefined) return <></>;

    const { columnsModel, columnsRatios, columnsGaps } = columnsLayout;

    return (
        <>
            {columnsModel.map((column, columnIndex) => (
                <ColumnContainerRenderer
                    key={`column-${columnIndex}`}
                    layoutOptions={layoutOptions}
                    columnIndex={columnIndex}
                    columnsCount={columnsModel.length}
                    columnsGaps={columnsGaps}
                    columnsRatios={columnsRatios}
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

export default ColumnsLayout;
