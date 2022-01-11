import * as React from "react";
import { PropsWithChildren, PropsWithoutRef } from "react";

import Layout from "../../Layout";
import { ContainerProps, RenderContainer } from "../../types";

const PhotoAlbumContainer = React.forwardRef<HTMLDivElement, PropsWithoutRef<PropsWithChildren<ContainerProps>>>(
    ({ containerProps, children }, ref) => (
        <div ref={ref} {...containerProps}>
            {children}
        </div>
    )
);
PhotoAlbumContainer.displayName = "PhotoAlbumContainer";

type ContainerRendererProps = Omit<ContainerProps, "containerProps"> & { renderContainer?: RenderContainer };

const ContainerRenderer = React.forwardRef<HTMLDivElement, PropsWithoutRef<PropsWithChildren<ContainerRendererProps>>>(
    ({ layoutOptions, renderContainer, children, ...rest }, ref) => {
        const { layout } = layoutOptions;

        const containerProps = {
            className: `react-photo-album react-photo-album--${layout}`,
            style:
                layout === Layout.Rows
                    ? ({
                          display: "flex",
                          flexDirection: "column",
                          flexWrap: "nowrap",
                          justifyContent: "space-between",
                      } as React.CSSProperties)
                    : ({
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "nowrap",
                          justifyContent: "space-between",
                      } as React.CSSProperties),
        };

        const Component = renderContainer || PhotoAlbumContainer;

        return (
            <Component ref={ref} layoutOptions={layoutOptions} containerProps={containerProps} {...rest}>
                {children}
            </Component>
        );
    }
);
ContainerRenderer.displayName = "ContainerRenderer";

export default ContainerRenderer;
