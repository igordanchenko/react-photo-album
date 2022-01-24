import {
    ForwardRefExoticComponent,
    HTMLAttributes,
    ImgHTMLAttributes,
    MouseEvent,
    PropsWithChildren,
    PropsWithoutRef,
    RefAttributes,
} from "react";

export type LayoutType = "columns" | "rows" | "masonry";

export type ClickHandler = (event: MouseEvent, photo: Photo) => void;

export type ResponsiveParameterProvider = (containerWidth: number) => number;

export type ResponsiveParameter = number | ResponsiveParameterProvider;

export type ResponsiveSizes = {
    /** default size e.g. 100vw or calc(100vw - 200px) */
    size: string;
    /** array of sizes at various breakpoint */
    sizes?: {
        /** viewport size media query e.g. (max-width: 600px)  */
        viewport: string;
        /** photo album width at given viewport size e.g. calc(100vw - 50px) */
        size: string;
    }[];
};

export interface Image {
    /** Image source. */
    src: string;
    /** Image width in pixels. */
    width: number;
    /** Image height in pixels. */
    height: number;
}

export interface Photo extends Image {
    /** Optional `key` attribute. */
    key?: string;
    /** Optional image `alt` attribute. */
    alt?: string;
    /** Optional image `title` attribute. */
    title?: string;
    /** Optional array of alternative images to be included in the `srcset` attribute. */
    images?: Image[];
}

export type PhotoLayout = {
    /** photo width */
    width: number;
    /** photo height */
    height: number;
    /** photo index in a given row/column */
    photoIndex: number;
    /** number of photos in a given row/column */
    photosCount: number;
};

export type PhotoProps<T extends Photo = Photo> = {
    /** photo object */
    photo: T;
    /** computed photo layout */
    layout: PhotoLayout;
    /** photo album layout options */
    layoutOptions: LayoutOptions;
    /** pre-populated 'img' element attributes */
    imageProps: ImgHTMLAttributes<HTMLImageElement> &
        Required<Pick<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "style">>;
};

export type PhotoAlbumProps<T extends Photo = Photo> = {
    /** An array of photos to display in the photo album. */
    photos: Array<T>;
    /** Photo album layout type. */
    layout: LayoutType;
    /** A number of columns in the `columns` or `masonry` layout. */
    columns?: ResponsiveParameter;
    /** Spacing between images. */
    spacing?: ResponsiveParameter;
    /** Padding around each image in the photo album. */
    padding?: ResponsiveParameter;
    /** Target row height in the 'rows' layout. */
    targetRowHeight?: ResponsiveParameter;
    /** Photo album width at various viewport sizes. */
    sizes?: ResponsiveSizes;
    /** Photo click callback function. */
    onClick?: ClickHandler;
    /** Default container width to be used in the server-side render. */
    defaultContainerWidth?: number;
    /** Custom photo rendering function. */
    renderPhoto?: RenderPhoto<T>;
    /** Custom container rendering function. */
    renderContainer?: RenderContainer;
    /** Custom row container rendering function. */
    renderRowContainer?: RenderRowContainer;
    /** Custom column container rendering function. */
    renderColumnContainer?: RenderColumnContainer;
    /** ResizeObserver factory to be used when global ResizeObserver is unavailable. */
    resizeObserverProvider?: ResizeObserverProvider;
    /** Internal instrumentation - use on your own risk. */
    instrumentation?: Instrumentation;
};

export type RenderPhoto<T extends Photo = Photo> = (props: PhotoProps<T>) => JSX.Element;

export type GenericLayoutOptions = {
    /** layout spacing (gaps between photos) */
    spacing: number;
    /** padding around each photo */
    padding: number;
    /** current photo album container width */
    containerWidth: number;
    /** current viewport width */
    viewportWidth?: number;
    /** photo click handler */
    onClick?: ClickHandler;
    /** photo album size at various viewport sizes */
    sizes?: ResponsiveSizes;
};

export type RowsLayoutOptions = GenericLayoutOptions & {
    /** layout type */
    layout: Extract<LayoutType, "rows">;
    /** target row height in 'rows' layout */
    targetRowHeight: number;
};

export type ColumnsLayoutOptions = GenericLayoutOptions & {
    /** layout type */
    layout: Extract<LayoutType, "columns" | "masonry">;
    /** number of columns in 'columns' or 'masonry' layout */
    columns: number;
};

export type LayoutOptions = ColumnsLayoutOptions | RowsLayoutOptions;

export type ContainerProps = {
    /** layout options */
    layoutOptions: LayoutOptions;
    /** pre-populated default container attributes */
    containerProps: HTMLAttributes<HTMLDivElement>;
};

export type RenderContainer = ForwardRefExoticComponent<
    PropsWithoutRef<PropsWithChildren<ContainerProps>> & RefAttributes<HTMLDivElement>
>;

export type RowContainerProps = {
    /** layout options */
    layoutOptions: RowsLayoutOptions;
    /** row number */
    rowIndex: number;
    /** total number of rows */
    rowsCount: number;
    /** pre-populated default row container attributes */
    rowContainerProps: HTMLAttributes<HTMLDivElement>;
};

export type RenderRowContainer = (props: PropsWithChildren<RowContainerProps>) => JSX.Element;

export type ColumnContainerProps = {
    layoutOptions: ColumnsLayoutOptions;
    /** column number */
    columnIndex: number;
    /** total number of columns */
    columnsCount: number;
    /** sum of spacing and paddings in each column */
    columnsGaps?: number[];
    /** width adjustment ratio for each column */
    columnsRatios?: number[];
    /** pre-populated default column container attributes */
    columnContainerProps: HTMLAttributes<HTMLDivElement>;
};

export type RenderColumnContainer = (props: PropsWithChildren<ColumnContainerProps>) => JSX.Element;

export type ResizeObserverProvider = (
    callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void
) => ResizeObserver;

/** internal instrumentation for research and performance testing purposes, subject to change without notice */
export type Instrumentation = {
    fullGraphSearch?: boolean;
    onStartLayoutComputation?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFinishLayoutComputation?: (...params: any) => void;
};
