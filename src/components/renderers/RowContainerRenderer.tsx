import { CSSProperties, PropsWithChildren } from "react";

import { Photo, RenderRowContainer, RowContainerProps } from "../../types";
import Optional from "../../types/Optional";

const defaultRenderRowContainer = <T extends Photo = Photo>({
    rowContainerProps,
    children,
}: PropsWithChildren<RowContainerProps<T>>) => <div {...rowContainerProps}>{children}</div>;

type RowContainerRendererProps<T extends Photo = Photo> = PropsWithChildren<
    Optional<RowContainerProps<T>, "rowContainerProps">
> & {
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
        } as CSSProperties,
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
