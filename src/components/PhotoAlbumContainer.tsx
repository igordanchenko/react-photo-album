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
                          flexDirection: "column",
                          flexWrap: "nowrap",
                          justifyContent: "space-between",
                      }
                    : {
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "nowrap",
                          justifyContent: "space-between",
                      }
            }
        >
            {children}
        </div>
    )
);

export default PhotoAlbumContainer;
