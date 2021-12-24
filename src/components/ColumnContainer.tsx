import * as React from "react";
import { PropsWithChildren, PropsWithoutRef } from "react";

import Layout from "../Layout";
import round from "../utils/round";
import { ColumnContainerProps } from "../types";

const cssWidth = (props: ColumnContainerProps) => {
    const { layoutOptions, columnIndex, columnsCount, columnsGaps, columnsRatios } = props;
    const { layout, spacing, padding } = layoutOptions;

    if (layout === Layout.Masonry) return `calc((100% - ${spacing * (columnsCount - 1)}px) / ${columnsCount})`;

    if (!columnsGaps || !columnsRatios) return "0";

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

const ColumnContainer = (props: PropsWithoutRef<PropsWithChildren<ColumnContainerProps>>) => {
    const { layoutOptions, children } = props;
    const { layout } = layoutOptions;

    return (
        <div
            className="react-photo-album--column"
            style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "nowrap",
                alignItems: "flex-start",
                width: cssWidth(props),
                justifyContent: layout === Layout.Columns ? "space-between" : "flex-start",
                boxSizing: "border-box",
            }}
        >
            {children}
        </div>
    );
};

export default ColumnContainer;
