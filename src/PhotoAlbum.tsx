import * as React from "react";

import RowsLayout from "./components/layouts/RowsLayout";
import ColumnsLayout from "./components/layouts/ColumnsLayout";
import MasonryLayout from "./components/layouts/MasonryLayout";
import ContainerRenderer from "./components/renderers/ContainerRenderer";
import useContainerWidth from "./hooks/useContainerWidth";
import { resolveResponsiveParameter, unwrapParameter } from "./utils/responsive";
import { ComponentsProps, ComponentsPropsParameter, Photo, PhotoAlbumProps } from "./types";

const resolveLayoutOptions = <T extends Photo>({
    layout,
    onClick,
    containerWidth,
    targetRowHeight,
    rowConstraints,
    columns,
    spacing,
    padding,
    sizes,
}: Omit<PhotoAlbumProps<T>, "photos"> & {
    containerWidth: number;
}) => ({
    layout,
    onClick,
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
    sizes,
});

const resolveComponentsProps = (componentsProps: ComponentsPropsParameter | undefined, containerWidth?: number) =>
    typeof componentsProps === "function" ? componentsProps(containerWidth) : componentsProps;

const renderLayout = <T extends Photo>(
    props: PhotoAlbumProps<T>,
    containerWidth: number,
    componentsProps: ComponentsProps | undefined
) => {
    const { photos, layout, renderPhoto, renderRowContainer, renderColumnContainer } = props;

    const layoutOptions = resolveLayoutOptions({ containerWidth, ...props });

    const commonLayoutProps = { photos, renderPhoto, componentsProps };

    if (layout === "rows") {
        return (
            <RowsLayout
                layoutOptions={layoutOptions as typeof layoutOptions & { layout: "rows" }}
                renderRowContainer={renderRowContainer}
                {...commonLayoutProps}
            />
        );
    }

    if (layout === "columns") {
        return (
            <ColumnsLayout
                layoutOptions={layoutOptions as typeof layoutOptions & { layout: "columns" }}
                renderColumnContainer={renderColumnContainer}
                {...commonLayoutProps}
            />
        );
    }

    return (
        <MasonryLayout
            layoutOptions={layoutOptions as typeof layoutOptions & { layout: "masonry" }}
            renderColumnContainer={renderColumnContainer}
            {...commonLayoutProps}
        />
    );
};

const PhotoAlbum = <T extends Photo>(props: PhotoAlbumProps<T>) => {
    const { photos, layout, renderContainer, defaultContainerWidth, breakpoints } = props;

    const { containerRef, containerWidth } = useContainerWidth(breakpoints, defaultContainerWidth);

    // safeguard against incorrect usage
    if (!layout || !["rows", "columns", "masonry"].includes(layout) || !Array.isArray(photos)) return null;

    // eslint-disable-next-line react/destructuring-assignment
    const componentsProps = resolveComponentsProps(props.componentsProps, containerWidth);

    return (
        <ContainerRenderer
            layout={layout}
            containerRef={containerRef}
            renderContainer={renderContainer}
            containerProps={componentsProps?.containerProps}
        >
            {containerWidth ? renderLayout(props, containerWidth, componentsProps) : null}
        </ContainerRenderer>
    );
};

export default PhotoAlbum;
