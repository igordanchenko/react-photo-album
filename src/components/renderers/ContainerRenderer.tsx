import * as React from "react";
import { CSSProperties, ForwardRefExoticComponent, PropsWithChildren, RefAttributes } from "react";

import { ContainerProps, RenderContainer, RenderContainerProps } from "../../types";

const defaultRenderContainer = ({ containerProps, children, containerRef }: RenderContainerProps) => (
    <div ref={containerRef} {...containerProps}>
        {children}
    </div>
);

type ContainerRendererProps = Omit<RenderContainerProps, "containerProps"> & { renderContainer?: RenderContainer };

const ContainerRenderer = ({
    layoutOptions,
    renderContainer,
    children,
    containerRef,
    ...rest
}: ContainerRendererProps) => {
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

    // we are dealing with deprecated exotic component returned by forwardRef
    if (renderContainer && typeof renderContainer === "object") {
        const Component = renderContainer as ForwardRefExoticComponent<
            PropsWithChildren<ContainerProps> & RefAttributes<HTMLDivElement>
        >;

        return (
            <Component ref={containerRef} layoutOptions={layoutOptions} containerProps={containerProps} {...rest}>
                {children}
            </Component>
        );
    }

    return (renderContainer ?? defaultRenderContainer)({
        containerProps,
        containerRef,
        layoutOptions,
        children,
        ...rest,
    });
};

export default ContainerRenderer;
