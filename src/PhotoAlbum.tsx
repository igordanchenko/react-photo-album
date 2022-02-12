import RowsLayout from "./components/layouts/RowsLayout";
import ColumnsLayout from "./components/layouts/ColumnsLayout";
import MasonryLayout from "./components/layouts/MasonryLayout";
import ContainerRenderer from "./components/renderers/ContainerRenderer";
import useMounted from "./hooks/mounted";
import useContainerWidth from "./hooks/containerWidth";
import resolveResponsiveParameter from "./utils/responsive";
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
        renderPhoto,
        renderContainer,
        renderRowContainer,
        renderColumnContainer,
        defaultContainerWidth,
        resizeObserverProvider,
        breakpoints,
        instrumentation,
    } = props;

    const mounted = useMounted();
    const { ref, width } = useContainerWidth(resizeObserverProvider, breakpoints);

    // safeguard against incorrect usage
    if (!layout || !Array.isArray(photos)) return <></>;

    const layoutOptions = resolveLayoutOptions({
        containerWidth: (mounted && width) || defaultContainerWidth || 800,
        viewportWidth: (mounted && window.innerWidth) || undefined,
        ...props,
    });

    const commonLayoutProps = { photos, renderPhoto, instrumentation };

    return (
        <ContainerRenderer ref={ref} layoutOptions={layoutOptions} renderContainer={renderContainer}>
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
