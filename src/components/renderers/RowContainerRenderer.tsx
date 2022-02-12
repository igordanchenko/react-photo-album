import { CSSProperties, PropsWithChildren, PropsWithoutRef } from "react";

import { RenderRowContainer, RowContainerProps } from "../../types";

const RowContainer: RenderRowContainer = ({ rowContainerProps, children }) => (
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

    const Component = renderRowContainer || RowContainer;

    return (
        <Component
            layoutOptions={layoutOptions}
            rowIndex={rowIndex}
            rowsCount={rowsCount}
            rowContainerProps={rowContainerProps}
            {...rest}
        >
            {children}
        </Component>
    );
};

export default RowContainerRenderer;
