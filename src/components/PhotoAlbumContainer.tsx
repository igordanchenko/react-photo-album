import * as React from "react";

import Layout from "../Layout";
import { ContainerProps } from "../types";

const PhotoAlbumContainer = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ layoutOptions: { layout, spacing }, children }, ref) => (
        <div
            ref={ref}
            className={`react-photo-album react-photo-album--${layout}`}
            style={
                layout === Layout.Rows
                    ? {
                          display: "flex",
                          flexFlow: "column nowrap",
                          justifyContent: "space-between",
                          boxSizing: "border-box",
                      }
                    : {
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "nowrap",
                          justifyContent: "space-between",
                          boxSizing: "border-box",
                      }
            }
        >
            {children}
        </div>
    )
);

export default PhotoAlbumContainer;
