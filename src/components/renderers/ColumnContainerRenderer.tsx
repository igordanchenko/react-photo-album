import * as React from "react";
import { CSSProperties, PropsWithChildren, PropsWithoutRef } from "react";

import Layout from "../../Layout";
import round from "../../utils/round";
import { ColumnContainerProps, RenderColumnContainer } from "../../types";

const ColumnContainer = ({ columnContainerProps, children }: PropsWithChildren<ColumnContainerProps>) => (
    <div {...columnContainerProps}>{children}</div>
);

const cssWidth = (props: ColumnContainerRendererProps) => {
    const { layoutOptions, columnIndex, columnsCount, columnsGaps, columnsRatios } = props;
    const { layout, spacing, padding } = layoutOptions;

    if (layout === Layout.Masonry || !columnsGaps || !columnsRatios) {
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

type ColumnContainerRendererProps = PropsWithoutRef<
    PropsWithChildren<
        Omit<ColumnContainerProps, "columnContainerProps"> & { renderColumnContainer?: RenderColumnContainer }
    >
>;

const ColumnContainerRenderer = (props: ColumnContainerRendererProps) => {
    const { layoutOptions, renderColumnContainer, children, ...rest } = props;

    const columnContainerProps = {
        className: "react-photo-album--column",
        style: {
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            alignItems: "flex-start",
            width: cssWidth(props),
            justifyContent: layoutOptions.layout === Layout.Columns ? "space-between" : "flex-start",
        } as CSSProperties,
    };

    const Component = renderColumnContainer || ColumnContainer;

    return (
        <Component layoutOptions={layoutOptions} columnContainerProps={columnContainerProps} {...rest}>
            {children}
        </Component>
    );
};

export default ColumnContainerRenderer;
