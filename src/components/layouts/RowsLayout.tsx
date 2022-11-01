import * as React from "react";

import computeRowsLayout from "../../layouts/rows";
import PhotoRenderer from "../renderers/PhotoRenderer";
import RowContainerRenderer from "../renderers/RowContainerRenderer";
import { ComponentsProps, Photo, RenderPhoto, RenderRowContainer, RowsLayoutOptions } from "../../types";

type RowsLayoutProps<T extends Photo = Photo> = {
    photos: T[];
    layoutOptions: RowsLayoutOptions<T>;
    renderPhoto?: RenderPhoto<T>;
    renderRowContainer?: RenderRowContainer<T>;
    componentsProps?: ComponentsProps;
};

const RowsLayout = <T extends Photo = Photo>(props: RowsLayoutProps<T>) => {
    const { photos, layoutOptions, renderPhoto, renderRowContainer, componentsProps } = props;

    const rowsLayout = computeRowsLayout({ photos, layoutOptions });

    if (!rowsLayout) return null;

    return (
        <>
            {rowsLayout.map((row, rowIndex) => (
                <RowContainerRenderer
                    key={`row-${rowIndex}`}
                    layoutOptions={layoutOptions}
                    rowIndex={rowIndex}
                    rowsCount={rowsLayout.length}
                    renderRowContainer={renderRowContainer}
                    rowContainerProps={componentsProps?.rowContainerProps}
                >
                    {row.map(({ photo, layout }) => (
                        <PhotoRenderer
                            key={photo.key || photo.src}
                            photo={photo}
                            layout={layout}
                            layoutOptions={layoutOptions}
                            renderPhoto={renderPhoto}
                            imageProps={componentsProps?.imageProps}
                        />
                    ))}
                </RowContainerRenderer>
            ))}
        </>
    );
};

export default RowsLayout;
