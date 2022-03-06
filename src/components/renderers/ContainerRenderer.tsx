import * as React from "react";
import { CSSProperties, ForwardRefExoticComponent, PropsWithChildren, RefAttributes } from "react";

import { ContainerProps, RenderContainer, RenderContainerProps } from "../../types";

const defaultRenderContainer = ({ containerProps, children, containerRef }: RenderContainerProps) => (
    <div ref={containerRef} {...containerProps}>
        {children}
    </div>
);

type ContainerRendererProps = Omit<RenderContainerProps, "containerProps"> &
    Pick<Partial<RenderContainerProps>, "containerProps"> & { renderContainer?: RenderContainer };

const ContainerRenderer = (props: ContainerRendererProps) => {
    const {
        layoutOptions,
        renderContainer,
        children,
        containerRef,
        containerProps: { style, ...restContainerProps } = {},
    } = props;
    const { layout } = layoutOptions;

    const containerProps = {
        className: `react-photo-album react-photo-album--${layout}`,
        style: {
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "space-between",
            flexDirection: layout === "rows" ? "column" : "row",
            ...style,
        } as CSSProperties,
        ...restContainerProps,
    };

    // we are dealing with deprecated exotic component returned by forwardRef
    if (renderContainer && typeof renderContainer === "object") {
        const Component = renderContainer as ForwardRefExoticComponent<
            PropsWithChildren<ContainerProps> & RefAttributes<HTMLDivElement>
        >;

        return (
            <Component ref={containerRef} layoutOptions={layoutOptions} containerProps={containerProps}>
                {children}
            </Component>
        );
    }

    return (renderContainer ?? defaultRenderContainer)({
        containerProps,
        containerRef,
        layoutOptions,
        children,
    });
};

export default ContainerRenderer;
