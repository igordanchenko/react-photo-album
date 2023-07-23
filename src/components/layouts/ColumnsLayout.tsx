import * as React from "react";

import computeColumnsLayout from "../../layouts/columns";
import PhotoRenderer from "../renderers/PhotoRenderer";
import ColumnContainerRenderer from "../renderers/ColumnContainerRenderer";
import { ColumnsLayoutOptions, ComponentsProps, Photo, RenderColumnContainer, RenderPhoto } from "../../types";

export type ColumnsLayoutProps<T extends Photo = Photo> = {
    photos: T[];
    layoutOptions: ColumnsLayoutOptions<T>;
    filterOptions?: string;
    renderPhoto?: RenderPhoto<T>;
    renderColumnContainer?: RenderColumnContainer<T>;
    componentsProps?: ComponentsProps;
};

export default function ColumnsLayout<T extends Photo = Photo>(props: ColumnsLayoutProps<T>) {
    const { photos, layoutOptions, filterOptions, renderPhoto, renderColumnContainer, componentsProps } = props;

    const columnsLayout = computeColumnsLayout({ photos, layoutOptions });

    if (!columnsLayout) return null;

    const { columnsModel, columnsRatios, columnsGaps } = columnsLayout;

    return (
        <>
            {columnsModel.map((column, columnIndex) => (
                <ColumnContainerRenderer
                    // eslint-disable-next-line react/no-array-index-key
                    key={`column-${columnIndex}`}
                    layoutOptions={layoutOptions}
                    columnIndex={columnIndex}
                    columnsCount={columnsModel.length}
                    columnsGaps={columnsGaps}
                    columnsRatios={columnsRatios}
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
