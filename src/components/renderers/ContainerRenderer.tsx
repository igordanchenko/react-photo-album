import * as React from "react";
import { CSSProperties, forwardRef, PropsWithChildren, PropsWithoutRef } from "react";

import { ContainerProps, RenderContainer } from "../../types";

const PhotoAlbumContainer: RenderContainer = forwardRef(({ containerProps, children }, ref) => (
    <div ref={ref} {...containerProps}>
        {children}
    </div>
));
PhotoAlbumContainer.displayName = "PhotoAlbumContainer";

type ContainerRendererProps = Omit<ContainerProps, "containerProps"> & { renderContainer?: RenderContainer };

const ContainerRenderer = forwardRef<HTMLDivElement, PropsWithoutRef<PropsWithChildren<ContainerRendererProps>>>(
    ({ layoutOptions, renderContainer, children, ...rest }, ref) => {
        const { layout } = layoutOptions;

        const containerProps = {
            className: `react-photo-album react-photo-album--${layout}`,
            style:
                layout === "rows"
                    ? ({
                          display: "flex",
                          flexDirection: "column",
                          flexWrap: "nowrap",
                          justifyContent: "space-between",
                      } as CSSProperties)
                    : ({
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "nowrap",
                          justifyContent: "space-between",
                      } as CSSProperties),
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
