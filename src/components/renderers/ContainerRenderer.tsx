import { CSSProperties, ForwardRefExoticComponent, PropsWithChildren, RefAttributes } from "react";

import { ContainerProps, Photo, RenderContainer, RenderContainerProps } from "../../types";
import Optional from "../../types/Optional";

const defaultRenderContainer = <T extends Photo = Photo>({
    containerProps,
    children,
    containerRef,
}: RenderContainerProps<T>) => (
    <div ref={containerRef} {...containerProps}>
        {children}
    </div>
);

type ContainerRendererProps<T extends Photo = Photo> = Optional<RenderContainerProps<T>, "containerProps"> & {
    renderContainer?: RenderContainer<T>;
};

const ContainerRenderer = <T extends Photo = Photo>(props: ContainerRendererProps<T>) => {
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
            PropsWithChildren<ContainerProps<T>> & RefAttributes<HTMLDivElement>
        >;

        return (
            <Component ref={containerRef} layoutOptions={layoutOptions} containerProps={containerProps}>
                {children}
            </Component>
        );
    }

    return (
        <>
            {(renderContainer ?? defaultRenderContainer)({
                containerProps,
                containerRef,
                layoutOptions,
                children,
            })}
        </>
    );
};

export default ContainerRenderer;
