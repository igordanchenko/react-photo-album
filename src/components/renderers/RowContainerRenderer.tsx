import * as React from "react";
import { CSSProperties, PropsWithChildren } from "react";

import { RenderRowContainer, RowContainerProps } from "../../types";

const defaultRenderRowContainer: RenderRowContainer = ({ rowContainerProps, children }) => (
    <div {...rowContainerProps}>{children}</div>
);

type RowContainerRendererProps = PropsWithChildren<
    Omit<RowContainerProps, "rowContainerProps"> & Pick<Partial<RowContainerProps>, "rowContainerProps">
> & {
    renderRowContainer?: RenderRowContainer;
};

const RowContainerRenderer = (props: RowContainerRendererProps) => {
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
        } as CSSProperties,
        ...restRowContainerProps,
    };

    return (renderRowContainer ?? defaultRenderRowContainer)({
        layoutOptions,
        rowIndex,
        rowsCount,
        rowContainerProps,
        children,
    });
};

export default RowContainerRenderer;
