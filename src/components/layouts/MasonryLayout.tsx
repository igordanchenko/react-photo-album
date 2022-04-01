import computeMasonryLayout from "../../layouts/masonry";
import PhotoRenderer from "../renderers/PhotoRenderer";
import ColumnContainerRenderer from "../renderers/ColumnContainerRenderer";
import {
    ColumnsLayoutOptions,
    ComponentsProps,
    Instrumentation,
    Photo,
    RenderColumnContainer,
    RenderPhoto,
} from "../../types";

type MasonryLayoutProps<T extends Photo = Photo> = {
    photos: T[];
    layoutOptions: ColumnsLayoutOptions;
    renderPhoto?: RenderPhoto<T>;
    renderColumnContainer?: RenderColumnContainer;
    componentsProps?: ComponentsProps;
    instrumentation?: Instrumentation;
};

const MasonryLayout = <T extends Photo = Photo>(props: MasonryLayoutProps<T>): JSX.Element => {
    const { photos, layoutOptions, renderPhoto, renderColumnContainer, componentsProps, instrumentation } = props;

    const masonryLayout = computeMasonryLayout({ photos, layoutOptions, instrumentation });

    if (masonryLayout === undefined) return <></>;

    return (
        <>
            {masonryLayout.map((column, columnIndex) => (
                <ColumnContainerRenderer
                    key={`masonry-column-${columnIndex}`}
                    layoutOptions={layoutOptions}
                    columnsCount={masonryLayout.length}
                    columnIndex={columnIndex}
                    renderColumnContainer={renderColumnContainer}
                    columnContainerProps={componentsProps?.columnContainerProps}
                >
                    {column.map(({ photo, layout }) => (
                        <PhotoRenderer
                            key={photo.key || photo.src}
                            photo={photo}
                            layout={layout}
                            layoutOptions={layoutOptions}
                            renderPhoto={renderPhoto}
                            imageProps={componentsProps?.imageProps}
                        />
                    ))}
                </ColumnContainerRenderer>
            ))}
        </>
    );
};

export default MasonryLayout;
