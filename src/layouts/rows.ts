import ratio from "../utils/ratio";
import round from "../utils/round";
import findShortestPath from "../utils/dijkstra";
import { Photo, PhotoLayout, RowConstraints, RowsLayoutOptions } from "../types";

// guesstimate how many neighboring nodes should be searched based on
// the aspect columnRatio of the container with images and minimal aspect columnRatio of all photos
// as the maximum amount of photos per row, plus some nodes
function findIdealNodeSearch({
  photos,
  targetRowHeight,
  containerWidth,
}: {
  photos: Photo[];
  targetRowHeight: number;
  containerWidth: number;
}): number {
  const minRatio = photos.reduce((acc, photo) => Math.min(ratio(photo), acc), Number.MAX_VALUE);
  return round(containerWidth / targetRowHeight / minRatio) + 2;
}

// get the height for a set of photos in a potential row
function getCommonHeight(row: Array<Photo>, containerWidth: number, spacing: number, padding: number) {
  const rowWidth = containerWidth - (row.length - 1) * spacing - 2 * padding * row.length;
  const totalAspectRatio = row.reduce((acc, photo) => acc + ratio(photo), 0);
  return rowWidth / totalAspectRatio;
}

// calculate the cost of breaking at this node (edge weight)
function cost(
  photos: Photo[],
  i: number,
  j: number,
  width: number,
  targetRowHeight: number,
  spacing: number,
  padding: number,
) {
  const row = photos.slice(i, j);
  const commonHeight = getCommonHeight(row, width, spacing, padding);
  return commonHeight > 0 ? (commonHeight - targetRowHeight) ** 2 * row.length : undefined;
}

// return function that gets the neighboring nodes of node and returns costs
function makeGetRowNeighbors<T extends Photo = Photo>({
  photos,
  layoutOptions,
  targetRowHeight,
  limitNodeSearch,
  rowConstraints,
}: {
  photos: T[];
  layoutOptions: RowsLayoutOptions<T>;
  targetRowHeight: number;
  limitNodeSearch: number;
  rowConstraints?: RowConstraints;
}) {
  return (node: number) => {
    const { containerWidth, spacing, padding } = layoutOptions;
    const results = new Map<number, number>();
    results.set(node, 0);
    const startOffset = rowConstraints?.minPhotos ?? 1;
    const endOffset = Math.min(limitNodeSearch, rowConstraints?.maxPhotos ?? Infinity);
    for (let i = node + startOffset; i < photos.length + 1; i += 1) {
      if (i - node > endOffset) break;
      const currentCost = cost(photos, node, i, containerWidth, targetRowHeight, spacing, padding);
      if (currentCost === undefined) break;
      results.set(i, currentCost);
    }
    return results;
  };
}

export type RowsLayoutModel<T extends Photo = Photo> = { photo: T; layout: PhotoLayout }[][] | undefined;

// compute sizes by creating a graph with rows as edges and photo to break on as nodes
// to calculate the single best layout using Dijkstra's findShortestPath
export default function computeRowsLayout<T extends Photo = Photo>({
  photos,
  layoutOptions,
}: {
  photos: T[];
  layoutOptions: RowsLayoutOptions<T>;
}): RowsLayoutModel<T> {
  const { spacing, padding, containerWidth, targetRowHeight, rowConstraints } = layoutOptions;

  const limitNodeSearch = findIdealNodeSearch({ photos, containerWidth, targetRowHeight });

  const getNeighbors = makeGetRowNeighbors({
    photos,
    layoutOptions,
    targetRowHeight,
    limitNodeSearch,
    rowConstraints,
  });

  const path = findShortestPath(getNeighbors, 0, photos.length);

  // impossible layout
  if (path === undefined) return undefined;

  const layout = [];

  for (let i = 1; i < path.length; i += 1) {
    const row = photos.map((photo, index) => ({ photo, index })).slice(path[i - 1], path[i]);
    const height = getCommonHeight(
      row.map(({ photo }) => photo),
      containerWidth,
      spacing,
      padding,
    );
    layout.push(
      row.map(({ photo, index }, photoIndex) => ({
        photo,
        layout: {
          height,
          width: height * ratio(photo),
          index,
          photoIndex,
          photosCount: row.length,
        },
      })),
    );
  }

  return layout;
}
