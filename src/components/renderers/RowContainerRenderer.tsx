import * as React from "react";

import { Optional, Photo, RenderRowContainer, RenderRowContainerProps } from "../../types";

function defaultRenderRowContainer<T extends Photo = Photo>({
    rowContainerProps,
    children,
}: RenderRowContainerProps<T>) {
    return <div {...rowContainerProps}>{children}</div>;
}

export type RowContainerRendererProps<T extends Photo = Photo> = Optional<
    RenderRowContainerProps<T>,
    "rowContainerProps"
> & {
    renderRowContainer?: RenderRowContainer<T>;
};

export default function RowContainerRenderer<T extends Photo = Photo>(props: RowContainerRendererProps<T>) {
    const {
        layoutOptions,
        rowIndex,
        rowsCount,
        renderRowContainer,
        rowContainerProps: { style, ...restRowContainerProps } = {},
        children,
    } = props;

    const rowContainerProps = {
        className: "react-photo-album--row",
        style: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            ...(rowIndex < rowsCount - 1 ? { marginBottom: `${layoutOptions.spacing}px` } : null),
            ...style,
        } as const,
        ...restRowContainerProps,
    };

    return (
        <>
            {(renderRowContainer ?? defaultRenderRowContainer)({
                layoutOptions,
                rowIndex,
                rowsCount,
                rowContainerProps,
                children,
            })}
        </>
    );
}
