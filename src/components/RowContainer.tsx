import * as React from "react";
import { PropsWithChildren } from "react";

import { RowContainerProps } from "../types";

const RowContainer = ({
    layoutOptions: { spacing },
    rowIndex,
    rowsCount,
    children,
}: PropsWithChildren<RowContainerProps>) => (
    <div
        className="react-photo-album--row"
        style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            boxSizing: "border-box",
            ...(rowIndex < rowsCount - 1 ? { marginBottom: `${spacing}px` } : null),
        }}
    >
        {children}
    </div>
);

export default RowContainer;
