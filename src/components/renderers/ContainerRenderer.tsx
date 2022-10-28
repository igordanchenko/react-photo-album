import * as React from "react";

import { Optional, RenderContainer, RenderContainerProps } from "../../types";

const defaultRenderContainer = ({ containerProps, children, containerRef }: RenderContainerProps) => (
    <div ref={containerRef} {...containerProps}>
        {children}
    </div>
);

type ContainerRendererProps = Optional<RenderContainerProps, "containerProps"> & {
    renderContainer?: RenderContainer;
};

const ContainerRenderer = (props: ContainerRendererProps) => {
    const {
        layout,
        renderContainer,
        children,
        containerRef,
        containerProps: { style, ...restContainerProps } = {},
    } = props;

    const containerProps = {
        className: `react-photo-album react-photo-album--${layout}`,
        style: {
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            flexDirection: layout === "rows" ? "column" : "row",
            ...style,
        } as const,
        ...restContainerProps,
    };

    return (
        <>
            {(renderContainer ?? defaultRenderContainer)({
                containerProps,
                containerRef,
                layout,
                children,
            })}
        </>
    );
};

export default ContainerRenderer;
