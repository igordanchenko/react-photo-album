import {
    CSSProperties,
    ForwardRefExoticComponent,
    HTMLAttributes,
    ImgHTMLAttributes,
    MouseEvent,
    PropsWithChildren,
    ReactNode,
    RefAttributes,
    RefCallback,
} from "react";

export type LayoutType = "columns" | "rows" | "masonry";

export type ClickHandler<T extends Photo = Photo> = (event: MouseEvent, photo: T, index: number) => void;

export type ResponsiveParameterProvider<T = number> = (containerWidth: number) => T;

export type ResponsiveParameter<T = number> = T | ResponsiveParameterProvider<T>;

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
    /** photo index in the original `photos` array */
    index: number;
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
    layoutOptions: LayoutOptions<T>;
    /** pre-populated 'img' element attributes */
    imageProps: ImgHTMLAttributes<HTMLImageElement> &
        Required<Pick<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "style">>;
    /** A callback to render the default photo implementation. If `wrapped` is `true`, the image will be styled
     * with `width` and `height` set to 100%. Use this option when you already sized image wrapper with image
     * dimensions (see `wrapperStyle`) */
    renderDefaultPhoto: (options?: { wrapped?: boolean }) => ReactNode;
    /** CSS styles to properly size image wrapper (i.e. <div> wrapper) */
    wrapperStyle: CSSProperties;
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
    /** Additional row constraints */
    rowConstraints?: ResponsiveParameter<RowConstraints>;
    /** Additional columnn constraints */
    columnConstraints?: ResponsiveParameter<ColumnConstraints>;
    /** Photo album width at various viewport sizes. */
    sizes?: ResponsiveSizes;
    /** Photo click callback function. */
    onClick?: ClickHandler<T>;
    /** Responsive breakpoints */
    breakpoints?: number[];
    /** Default container width to be used in the server-side render. */
    defaultContainerWidth?: number;
    /** Additional HTML attributes to be passed to the rendered elements */
    componentsProps?: ComponentsPropsParameter;
    /** Custom photo rendering function. */
    renderPhoto?: RenderPhoto<T>;
    /** Custom container rendering function. */
    renderContainer?: RenderContainer<T>;
    /** Custom row container rendering function. */
    renderRowContainer?: RenderRowContainer<T>;
    /** Custom column container rendering function. */
    renderColumnContainer?: RenderColumnContainer<T>;
    /** ResizeObserver factory to be used when global ResizeObserver is unavailable. */
    resizeObserverProvider?: ResizeObserverProvider;
    /** Internal instrumentation - use on your own risk. */
    instrumentation?: Instrumentation;
};

export type RenderPhoto<T extends Photo = Photo> = (props: PhotoProps<T>) => ReactNode;

export type GenericLayoutOptions<T extends Photo = Photo> = {
    /** layout spacing (gaps between photos) */
    spacing: number;
    /** padding around each photo */
    padding: number;
    /** current photo album container width */
    containerWidth: number;
    /** current viewport width */
    viewportWidth?: number;
    /** photo click handler */
    onClick?: ClickHandler<T>;
    /** photo album size at various viewport sizes */
    sizes?: ResponsiveSizes;
};

export type RowsLayoutOptions<T extends Photo = Photo> = GenericLayoutOptions<T> & {
    /** layout type */
    layout: Extract<LayoutType, "rows">;
    /** target row height in 'rows' layout */
    targetRowHeight: number;
    /** Additional row constraints */
    rowConstraints?: RowConstraints;
};

export type ColumnsLayoutOptions<T extends Photo = Photo> = GenericLayoutOptions<T> & {
    /** layout type */
    layout: Extract<LayoutType, "columns" | "masonry">;
    /** number of columns in 'columns' or 'masonry' layout */
    columns: number;
    /** Additional column constraints */
    columnConstraints?: ColumnConstraints;
};

export type LayoutOptions<T extends Photo = Photo> = ColumnsLayoutOptions<T> | RowsLayoutOptions<T>;

export type ComponentsProps = {
    /** Additional HTML attributes to be passed to the outer container `div` element */
    containerProps?: HTMLAttributes<HTMLDivElement>;
    /** Additional HTML attributes to be passed to the row container `div` element */
    rowContainerProps?: HTMLAttributes<HTMLDivElement>;
    /** Additional HTML attributes to be passed to the column container `div` element */
    columnContainerProps?: HTMLAttributes<HTMLDivElement>;
    /** Additional HTML attributes to be passed to the photo `img` element */
    imageProps?: HTMLAttributes<HTMLImageElement>;
};

export type ComponentsPropsParameter = ComponentsProps | ((containerWidth: number) => ComponentsProps);

export type ContainerProps<T extends Photo = Photo> = {
    /** layout options */
    layoutOptions: LayoutOptions<T>;
    /** pre-populated default container attributes */
    containerProps: HTMLAttributes<HTMLDivElement>;
};

export type RenderContainerProps<T extends Photo = Photo> = PropsWithChildren<ContainerProps<T>> & {
    containerRef?: RefCallback<HTMLDivElement>;
};

/** ForwardRefExoticComponent (forwardRef) variant is deprecated and will be removed in the next major release */
export type RenderContainer<T extends Photo = Photo> =
    | ((props: RenderContainerProps<T>) => ReactNode)
    | ForwardRefExoticComponent<PropsWithChildren<ContainerProps<T>> & RefAttributes<HTMLDivElement>>;

export type RowContainerProps<T extends Photo = Photo> = {
    /** layout options */
    layoutOptions: RowsLayoutOptions<T>;
    /** row number */
    rowIndex: number;
    /** total number of rows */
    rowsCount: number;
    /** pre-populated default row container attributes */
    rowContainerProps: HTMLAttributes<HTMLDivElement>;
};

export type RenderRowContainer<T extends Photo = Photo> = (props: PropsWithChildren<RowContainerProps<T>>) => ReactNode;

export type ColumnContainerProps<T extends Photo = Photo> = {
    layoutOptions: ColumnsLayoutOptions<T>;
    /** column number */
    columnIndex: number;
    /** total number of columns */
    columnsCount: number;
    /** sum of spacings and paddings in each column */
    columnsGaps?: number[];
    /** width adjustment ratios of each column */
    columnsRatios?: number[];
    /** pre-populated default column container attributes */
    columnContainerProps: HTMLAttributes<HTMLDivElement>;
};

export type RenderColumnContainer<T extends Photo = Photo> = (
    props: PropsWithChildren<ColumnContainerProps<T>>
) => ReactNode;

export type ResizeObserverProvider = (
    callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void
) => ResizeObserver;

export type RowConstraints = {
    /** minimum number of photos per row in 'rows' layout */
    minPhotos?: number;
    /** maximum number of photos per row in 'rows' layout */
    maxPhotos?: number;
};

export type ColumnConstraints = {
    /** minimum number of columns in 'masonry' or 'columns' layout when there isn't enough photos to fill all the columns */
    minColumns?: number;
};

/** internal instrumentation for research and performance testing purposes, subject to change without notice */
export type Instrumentation = {
    fullGraphSearch?: boolean;
    onStartLayoutComputation?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFinishLayoutComputation?: (...params: any) => void;
};
