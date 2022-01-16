import * as React from "react";

import RowsLayout from "./components/layouts/RowsLayout";
import ColumnsLayout from "./components/layouts/ColumnsLayout";
import MasonryLayout from "./components/layouts/MasonryLayout";
import ContainerRenderer from "./components/renderers/ContainerRenderer";
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
    sizes,
}: Omit<PhotoAlbumProps<T>, "photos"> & {
    viewportWidth?: number;
    containerWidth: number;
}): RowsLayoutOptions | ColumnsLayoutOptions => ({
    layout,
    onClick,
    viewportWidth,
    containerWidth,
    columns: resolveResponsiveParameter(columns, containerWidth, [5, 4, 3, 2]),
    spacing: resolveResponsiveParameter(spacing, containerWidth, [20, 15, 10, 5]),
    padding: resolveResponsiveParameter(padding, containerWidth, [0, 0, 0, 0, 0]),
    targetRowHeight: resolveResponsiveParameter(targetRowHeight, containerWidth, [
        (w) => w / 5,
        (w) => w / 4,
        (w) => w / 3,
        (w) => w / 2,
    ]),
    sizes,
});

const PhotoAlbum = <T extends Photo>(props: PhotoAlbumProps<T>): JSX.Element => {
    const {
        photos,
        layout,
        columns,
        spacing,
        padding,
        sizes,
        onClick,
        targetRowHeight,
        defaultContainerWidth = 800,
        renderPhoto,
        renderContainer,
        renderRowContainer,
        renderColumnContainer,
        resizeObserverProvider,
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

    const setContainerRef = React.useCallback((node) => {
        if (observerRef.current && containerRef.current) {
            observerRef.current.unobserve(containerRef.current);
        }

        containerRef.current = node;

        if (node && observerRef.current) {
            observerRef.current.observe(node);
        }
    }, []);

    useLayoutEffect(() => {
        updateDimensions();

        const observerCallback = () => updateDimensions();
        if (typeof ResizeObserver !== "undefined") {
            observerRef.current = new ResizeObserver(observerCallback);
        } else if (resizeObserverProvider) {
            observerRef.current = resizeObserverProvider(observerCallback);
        }

        if (observerRef.current && containerRef.current) {
            observerRef.current.observe(containerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        };
    }, [updateDimensions, resizeObserverProvider]);

    const layoutOptions = resolveLayoutOptions({
        containerWidth: containerWidth || defaultContainerWidth,
        viewportWidth,
        layout,
        onClick,
        spacing,
        padding,
        columns,
        targetRowHeight,
        sizes,
    });

    const commonLayoutProps = { photos, renderPhoto, instrumentation };

    return (
        <ContainerRenderer ref={setContainerRef} layoutOptions={layoutOptions} renderContainer={renderContainer}>
            {layout === "rows" ? (
                <RowsLayout<T>
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
