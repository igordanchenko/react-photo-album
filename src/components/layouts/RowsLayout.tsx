import computeRowsLayout from "../../layouts/rows";
import PhotoRenderer from "../renderers/PhotoRenderer";
import RowContainerRenderer from "../renderers/RowContainerRenderer";
import {
    ComponentsProps,
    Instrumentation,
    Photo,
    RenderPhoto,
    RenderRowContainer,
    RowsLayoutOptions,
} from "../../types";

type RowsLayoutProps<T extends Photo = Photo> = {
    photos: T[];
    layoutOptions: RowsLayoutOptions;
    renderPhoto?: RenderPhoto<T>;
    renderRowContainer?: RenderRowContainer;
    componentsProps?: ComponentsProps;
    instrumentation?: Instrumentation;
};

const RowsLayout = <T extends Photo = Photo>(props: RowsLayoutProps<T>): JSX.Element => {
    const { photos, layoutOptions, renderPhoto, renderRowContainer, componentsProps, instrumentation } = props;

    const rowsLayout = computeRowsLayout({ photos, layoutOptions, instrumentation });

    if (rowsLayout === undefined) return <></>;

    return (
        <>
            {rowsLayout.map((row, rowIndex) => (
                <RowContainerRenderer
                    key={`row-${rowIndex}`}
                    layoutOptions={layoutOptions}
                    rowIndex={rowIndex}
                    rowsCount={rowsLayout.length}
                    renderRowContainer={renderRowContainer}
                    rowContainerProps={componentsProps?.rowContainerProps}
                >
                    {row.map(({ photo, layout }) => (
                        <PhotoRenderer
                            key={photo.key || photo.src}
                            photo={photo}
                            layout={layout}
                            layoutOptions={layoutOptions}
                            renderPhoto={renderPhoto}
                            imageProps={componentsProps?.imageProps}
                        />
                    ))}
                </RowContainerRenderer>
            ))}
        </>
    );
};

export default RowsLayout;
