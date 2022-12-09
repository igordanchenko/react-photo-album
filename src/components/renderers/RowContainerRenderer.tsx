import * as React from "react";

import { Optional, Photo, RenderRowContainer, RenderRowContainerProps } from "../../types";

const defaultRenderRowContainer = <T extends Photo = Photo>({
    rowContainerProps,
    children,
}: RenderRowContainerProps<T>) => <div {...rowContainerProps}>{children}</div>;

type RowContainerRendererProps<T extends Photo = Photo> = Optional<RenderRowContainerProps<T>, "rowContainerProps"> & {
    renderRowContainer?: RenderRowContainer<T>;
};

const RowContainerRenderer = <T extends Photo = Photo>(props: RowContainerRendererProps<T>) => {
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
};

export default RowContainerRenderer;
