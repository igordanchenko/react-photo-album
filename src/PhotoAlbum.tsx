import { useState } from "react";

import RowsLayout from "./components/layouts/RowsLayout";
import ColumnsLayout from "./components/layouts/ColumnsLayout";
import MasonryLayout from "./components/layouts/MasonryLayout";
import ContainerRenderer from "./components/renderers/ContainerRenderer";
import useLayoutEffect from "./hooks/useLayoutEffect";
import useContainerWidth from "./hooks/useContainerWidth";
import { resolveResponsiveParameter, unwrapParameter } from "./utils/responsive";
import {
    ColumnsLayoutOptions,
    ComponentsPropsParameter,
    LayoutOptions,
    Photo,
    PhotoAlbumProps,
    RowsLayoutOptions,
} from "./types";

const resolveLayoutOptions = <T extends Photo>({
    layout,
    onClick,
    viewportWidth,
    containerWidth,
    targetRowHeight,
    rowConstraints,
    columnConstraints,
    columns,
    spacing,
    padding,
    sizes,
}: Omit<PhotoAlbumProps<T>, "photos"> & {
    viewportWidth?: number;
    containerWidth: number;
}): LayoutOptions<T> => ({
    layout,
    onClick,
    viewportWidth,
    containerWidth,
    columns: resolveResponsiveParameter(columns, containerWidth, [5, 4, 3, 2], 1),
    spacing: resolveResponsiveParameter(spacing, containerWidth, [20, 15, 10, 5]),
    padding: resolveResponsiveParameter(padding, containerWidth, [0, 0, 0, 0, 0]),
    targetRowHeight: resolveResponsiveParameter(targetRowHeight, containerWidth, [
        (w) => w / 5,
        (w) => w / 4,
        (w) => w / 3,
        (w) => w / 2,
    ]),
    rowConstraints: unwrapParameter(rowConstraints, containerWidth),
    columnConstraints: unwrapParameter(columnConstraints, containerWidth),
    sizes,
});

const resolveComponentsProps = (componentsProps: ComponentsPropsParameter | undefined, containerWidth: number) =>
    typeof componentsProps === "function" ? componentsProps(containerWidth) : componentsProps;

const PhotoAlbum = <T extends Photo>(props: PhotoAlbumProps<T>): JSX.Element => {
    const {
        photos,
        layout,
        renderPhoto,
        renderContainer,
        renderRowContainer,
        renderColumnContainer,
        defaultContainerWidth,
        resizeObserverProvider,
        breakpoints,
        instrumentation,
    } = props;

    const [mounted, setMounted] = useState(false);
    const { containerRef, containerWidth } = useContainerWidth(resizeObserverProvider, breakpoints);

    useLayoutEffect(() => setMounted(true), []);

    // safeguard against incorrect usage
    if (!layout || !["rows", "columns", "masonry"].includes(layout) || !Array.isArray(photos)) return <></>;

    const layoutOptions = resolveLayoutOptions({
        containerWidth: (mounted && containerWidth) || defaultContainerWidth || 800,
        viewportWidth: (mounted && window.innerWidth) || undefined,
        ...props,
    });

    const componentsProps = resolveComponentsProps(props.componentsProps, layoutOptions.containerWidth);

    const commonLayoutProps = { photos, renderPhoto, componentsProps, instrumentation };

    return (
        <ContainerRenderer
            containerRef={containerRef}
            layoutOptions={layoutOptions}
            renderContainer={renderContainer}
            containerProps={componentsProps?.containerProps}
        >
            {layout === "rows" ? (
                <RowsLayout
                    layoutOptions={layoutOptions as RowsLayoutOptions}
                    renderRowContainer={renderRowContainer}
                    {...commonLayoutProps}
                />
            ) : layout === "columns" ? (
                <ColumnsLayout
                    layoutOptions={layoutOptions as ColumnsLayoutOptions}
                    renderColumnContainer={renderColumnContainer}
                    {...commonLayoutProps}
                />
            ) : (
                <MasonryLayout
                    layoutOptions={layoutOptions as ColumnsLayoutOptions}
                    renderColumnContainer={renderColumnContainer}
                    {...commonLayoutProps}
                />
            )}
        </ContainerRenderer>
    );
};

export default PhotoAlbum;
