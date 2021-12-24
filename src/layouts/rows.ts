import ratio from "../utils/ratio";
import round from "../utils/round";
import { findShortestPath } from "../utils/dijkstra";
import { Instrumentation, Photo, PhotoLayout, RowsLayoutOptions } from "../types";

// guesstimate how many neighboring nodes should be searched based on
// the aspect columnRatio of the container with images and minimal aspect columnRatio of all photos
// as the maximum amount of photos per row, plus some nodes
const findIdealNodeSearch = ({
    photos,
    targetRowHeight,
    containerWidth,
}: {
    photos: Array<Photo>;
    targetRowHeight: number;
    containerWidth: number;
}): number => {
    const minRatio = photos.reduce((acc, photo) => Math.min(ratio(photo), acc), Number.MAX_VALUE);
    return round(containerWidth / targetRowHeight / minRatio) + 2;
};

// compute sizes by creating a graph with rows as edges and photo to break on as nodes
// to calculate the single best layout using Dijkstra's findShortestPat

// get the height for a set of photos in a potential row
const getCommonHeight = (row: Array<Photo>, containerWidth: number, spacing: number, padding: number) => {
    const rowWidth = containerWidth - (row.length - 1) * spacing - 2 * padding * row.length;
    const totalAspectRatio = row.reduce((acc, photo) => acc + ratio(photo), 0);
    return rowWidth / totalAspectRatio;
};

// calculate the cost of breaking at this node (edge weight)
const cost = (
    photos: Array<Photo>,
    i: number,
    j: number,
    width: number,
    targetRowHeight: number,
    spacing: number,
    padding: number
) => {
    const row = photos.slice(i, j);
    const commonHeight = getCommonHeight(row, width, spacing, padding);
    return commonHeight > 0 ? (commonHeight - targetRowHeight) ** 2 : undefined;
};

// return function that gets the neighboring nodes of node and returns costs
const makeGetNeighbors =
    ({
        photos,
        layoutOptions,
        targetRowHeight,
        limitNodeSearch,
        instrumentation,
    }: {
        photos: Array<Photo>;
        layoutOptions: RowsLayoutOptions;
        targetRowHeight: number;
        limitNodeSearch: number;
        instrumentation?: Instrumentation;
    }) =>
    (node: string) => {
        const { containerWidth, spacing, padding } = layoutOptions;
        const results: { [key: string]: number } = {};
        const start = +node;
        results[+start] = 0;
        for (let i = start + 1; i < photos.length + 1; i += 1) {
            if (i - start > limitNodeSearch && !instrumentation?.fullGraphSearch) break;
            const currentCost = cost(photos, start, i, containerWidth, targetRowHeight, spacing, padding);
            if (currentCost === undefined) break;
            results[i.toString()] = currentCost;
        }
        return results;
    };

type RowsLayoutModel<T extends Photo = Photo> = { photo: T; layout: PhotoLayout }[][] | undefined;

const computeRowsLayout = <T extends Photo = Photo>({
    photos,
    layoutOptions,
    instrumentation,
}: {
    photos: T[];
    layoutOptions: RowsLayoutOptions;
    instrumentation?: Instrumentation;
}): RowsLayoutModel<T> => {
    const { spacing, padding, containerWidth, targetRowHeight } = layoutOptions;

    instrumentation?.onStartLayoutComputation?.();

    const limitNodeSearch = findIdealNodeSearch({ photos, containerWidth, targetRowHeight });

    const getNeighbors = makeGetNeighbors({
        photos,
        layoutOptions,
        targetRowHeight,
        limitNodeSearch,
        instrumentation,
    });

    const path = findShortestPath(getNeighbors, "0", `${photos.length}`);

    // impossible layout
    if (path === undefined) return undefined;

    const result = [];

    for (let i = 1; i < path.length; i += 1) {
        const row = photos.slice(+path[i - 1], +path[i]);
        const height = getCommonHeight(row, containerWidth, spacing, padding);
        result.push(
            row.map((photo, index) => ({
                photo,
                layout: {
                    height: height + 2 * padding,
                    width: height * ratio(photo) + 2 * padding,
                    photoIndex: index,
                    photosCount: row.length,
                },
            }))
        );
    }

    instrumentation?.onFinishLayoutComputation?.(result);

    return result;
};

export default computeRowsLayout;
