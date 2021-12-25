import {
    CSSProperties,
    ForwardRefExoticComponent,
    MouseEvent,
    MouseEventHandler,
    PropsWithChildren,
    PropsWithoutRef,
    RefAttributes,
} from "react";

export type LayoutType = "columns" | "rows" | "masonry";

export type ClickHandler = (event: MouseEvent, photo: Photo) => void;

export type ResponsiveParameterProvider = (containerWidth: number) => number;

export type ResponsiveParameter = number | ResponsiveParameterProvider;

export interface Image {
    /** image source */
    src: string;
    /** image width */
    width: number;
    /** image height */
    height: number;
}

export interface Photo extends Image {
    /** option photo key */
    key?: string;
    /** photo alt text */
    alt?: string;
    /** photo title */
    title?: string;
    /** array of alternative image sizes */
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
    /** photo layout */
    layout: PhotoLayout;
    /** CSS styles to be applied to photo */
    style: CSSProperties;
    /** photo click handler */
    onClick?: MouseEventHandler;
    /** photo album layout options */
    layoutOptions: LayoutOptions;
};

export type PhotoAlbumProps<T extends Photo = Photo> = {
    /** photo album photos */
    photos: Array<T>;
    /** layout type */
    layout: LayoutType;
    /** number of columns in 'columns' or 'masonry' layout */
    columns?: ResponsiveParameter;
    /** layout spacing */
    spacing?: ResponsiveParameter;
    /** layout padding */
    padding?: ResponsiveParameter;
    /** target row height in 'rows' layout */
    targetRowHeight?: ResponsiveParameter;
    /** photo click handler */
    onClick?: ClickHandler;
    /** default container width to be used in SSR render */
    defaultContainerWidth?: number;
    /** custom photo rendering function  */
    renderPhoto?: RenderPhoto<T>;
    /** custom container rendering function  */
    renderContainer?: RenderContainer;
    /** custom row container rendering function  */
    renderRowContainer?: RenderRowContainer;
    /** custom column container rendering function  */
    renderColumnContainer?: RenderColumnContainer;
    /** internal instrumentation - use on your own risk */
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
    /** width adjustment ratio of each column */
    columnsRatios?: number[];
};

export type RenderColumnContainer = (props: PropsWithChildren<ColumnContainerProps>) => JSX.Element;

/** internal instrumentation for research and performance testing purposes, subject to change without notice */
export type Instrumentation = {
    fullGraphSearch?: boolean;
    onStartLayoutComputation?: () => void;
    onFinishLayoutComputation?: (...params: any) => void;
};
