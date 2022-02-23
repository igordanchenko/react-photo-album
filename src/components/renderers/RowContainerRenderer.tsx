import * as React from "react";
import { CSSProperties, PropsWithChildren, PropsWithoutRef } from "react";

import { RenderRowContainer, RowContainerProps } from "../../types";

const defaultRenderRowContainer: RenderRowContainer = ({ rowContainerProps, children }) => (
    <div {...rowContainerProps}>{children}</div>
);

type RowContainerRendererProps = PropsWithoutRef<
    PropsWithChildren<
        Omit<RowContainerProps, "rowContainerProps"> & {
            renderRowContainer?: RenderRowContainer;
        }
    >
>;

const RowContainerRenderer = ({
    layoutOptions,
    rowIndex,
    rowsCount,
    renderRowContainer,
    children,
    ...rest
}: RowContainerRendererProps) => {
    const rowContainerProps = {
        className: "react-photo-album--row",
        style: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            ...(rowIndex < rowsCount - 1 ? { marginBottom: `${layoutOptions.spacing}px` } : null),
        } as CSSProperties,
    };

    return (renderRowContainer ?? defaultRenderRowContainer)({
        layoutOptions,
        rowIndex,
        rowsCount,
        rowContainerProps,
        children,
        ...rest,
    });
};

export default RowContainerRenderer;
