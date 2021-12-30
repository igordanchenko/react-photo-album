import * as React from "react";
import ResizeObserver from "resize-observer-polyfill";

import Layout from "./Layout";
import RowsLayout from "./components/RowsLayout";
import ColumnsLayout from "./components/ColumnsLayout";
import MasonryLayout from "./components/MasonryLayout";
import PhotoAlbumContainer from "./components/PhotoAlbumContainer";
import resolveResponsiveParameter from "./utils/responsive";
import useLayoutEffect from "./utils/layoutEffect";
import { ColumnsLayoutOptions, Photo, PhotoAlbumProps, RowsLayoutOptions } from "./types";

const resolveLayoutOptions = <T extends Photo>({
    layout,
    onClick,
    viewportWidth,
    containerWidth,
    targetRowHeight,
    columns,
    spacing,
    padding,
}: Omit<PhotoAlbumProps<T>, "photos"> & {
    viewportWidth?: number;
    containerWidth: number;
}): RowsLayoutOptions | ColumnsLayoutOptions => ({
    layout,
    onClick,
    viewportWidth,
    containerWidth,
    columns: resolveResponsiveParameter(columns, containerWidth, [6, 5, 4, 3, 2, 1]),
    spacing: resolveResponsiveParameter(spacing, containerWidth, [20, 16, 12, 8, 4, 2]),
    padding: resolveResponsiveParameter(padding, containerWidth, [0, 0, 0, 0, 0, 0]),
    targetRowHeight: resolveResponsiveParameter(targetRowHeight, containerWidth, [400, 300, 200, 150, 100, 80]),
});

const PhotoAlbum = <T extends Photo>(props: PhotoAlbumProps<T>): JSX.Element => {
    const {
        photos,
        layout,
        columns,
        spacing,
        padding,
        onClick,
        targetRowHeight,
        defaultContainerWidth = 800,
        renderPhoto,
        renderContainer,
        renderRowContainer,
        renderColumnContainer,
        instrumentation,
    } = props;

    const [viewportWidth, setViewportWidth] = React.useState<number>();
    const [containerWidth, setContainerWidth] = React.useState<number>();

    const observerRef = React.useRef<ResizeObserver | null>(null);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const updateDimensions = React.useCallback(() => {
        if (typeof window !== "undefined") {
            setViewportWidth(window.innerWidth);
        }
        if (containerRef.current) {
            setContainerWidth(containerRef.current.clientWidth);
        }
    }, []);

    const setContainerRef = React.useCallback(
        (node) => {
            if (observerRef.current && containerRef.current) {
                observerRef.current.unobserve(containerRef.current);
            }

            containerRef.current = node;

            if (node) {
                if (!observerRef.current) {
                    observerRef.current = new ResizeObserver(() => updateDimensions());
                }
                observerRef.current.observe(node);
            }
        },
        [updateDimensions]
    );

    useLayoutEffect(() => {
        updateDimensions();

        return () => {
            observerRef.current?.disconnect();
            observerRef.current = null;
        };
    }, [updateDimensions]);

    const layoutOptions = resolveLayoutOptions({
        containerWidth: containerWidth || defaultContainerWidth,
        viewportWidth,
        layout,
        onClick,
        spacing,
        padding,
        columns,
        targetRowHeight,
    });

    const commonLayoutProps = { photos, renderPhoto, instrumentation };

    const Container = renderContainer || PhotoAlbumContainer;

    return (
        <Container ref={setContainerRef} layoutOptions={layoutOptions}>
            {layout === Layout.Rows ? (
                <RowsLayout<T>
                    layoutOptions={layoutOptions as RowsLayoutOptions}
                    renderRowContainer={renderRowContainer}
                    {...commonLayoutProps}
                />
            ) : layout === Layout.Columns ? (
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
        </Container>
    );
};

export default PhotoAlbum;
