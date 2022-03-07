import * as React from "react";
import { CSSProperties, PropsWithChildren } from "react";

import round from "../../utils/round";
import { ColumnContainerProps, RenderColumnContainer } from "../../types";
import Optional from "../../types/Optional";

const defaultRenderColumnContainer: RenderColumnContainer = ({ columnContainerProps, children }) => (
    <div {...columnContainerProps}>{children}</div>
);

const cssWidth = (props: ColumnContainerRendererProps) => {
    const { layoutOptions, columnIndex, columnsCount, columnsGaps, columnsRatios } = props;
    const { layout, spacing, padding } = layoutOptions;

    if (layout === "masonry" || !columnsGaps || !columnsRatios) {
        return `calc((100% - ${spacing * (columnsCount - 1)}px) / ${columnsCount})`;
    }

    const totalRatio = columnsRatios.reduce((acc, ratio) => acc + ratio, 0);
    const totalAdjustedGaps = columnsRatios.reduce(
        (acc, ratio, index) => acc + (columnsGaps[columnIndex] - columnsGaps[index]) * ratio,
        0
    );

    return `calc((100% - ${round(
        (columnsCount - 1) * spacing + 2 * columnsCount * padding + totalAdjustedGaps,
        3
    )}px) * ${round(columnsRatios[columnIndex] / totalRatio, 5)} + ${2 * padding}px)`;
};

type ColumnContainerRendererProps = PropsWithChildren<Optional<ColumnContainerProps, "columnContainerProps">> & {
    renderColumnContainer?: RenderColumnContainer;
};

const ColumnContainerRenderer = (props: ColumnContainerRendererProps) => {
    const {
        layoutOptions,
        renderColumnContainer,
        children,
        columnContainerProps: { style, ...restColumnContainerProps } = {},
        ...rest
    } = props;

    const columnContainerProps = {
        className: "react-photo-album--column",
        style: {
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            alignItems: "flex-start",
            width: cssWidth(props),
            justifyContent: layoutOptions.layout === "columns" ? "space-between" : "flex-start",
            ...style,
        } as CSSProperties,
        ...restColumnContainerProps,
    };

    return (renderColumnContainer ?? defaultRenderColumnContainer)({
        layoutOptions,
        columnContainerProps,
        children,
        ...rest,
    });
};

export default ColumnContainerRenderer;
