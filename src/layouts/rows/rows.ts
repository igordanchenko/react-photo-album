import findShortestPath from "./dijkstra";
import { ratio, round } from "../../core/utils";
import { LayoutModel, Photo } from "../../types";

// guesstimate how many neighboring nodes should be searched based on
// the aspect columnRatio of the container with images and minimal aspect columnRatio of all photos
// as the maximum amount of photos per row, plus some nodes
function findIdealNodeSearch(photos: Photo[], containerWidth: number, targetRowHeight: number) {
  return round(containerWidth / targetRowHeight / Math.min(...photos.map((photo) => ratio(photo)))) + 2;
}

// get the height for a set of photos in a potential row
function getCommonHeight(photos: Photo[], containerWidth: number, spacing: number, padding: number) {
  return (
    (containerWidth - (photos.length - 1) * spacing - 2 * padding * photos.length) /
    photos.reduce((acc, photo) => acc + ratio(photo), 0)
  );
}

// calculate the cost of breaking at this node (edge weight)
function cost(
  photos: Photo[],
  i: number,
  j: number,
  width: number,
  spacing: number,
  padding: number,
  targetRowHeight: number,
) {
  const row = photos.slice(i, j);
  const commonHeight = getCommonHeight(row, width, spacing, padding);
  return commonHeight > 0 ? (commonHeight - targetRowHeight) ** 2 * row.length : undefined;
}

// return function that gets the neighboring nodes of node and returns costs
function makeGetRowNeighbors(
  photos: Photo[],
  spacing: number,
  padding: number,
  containerWidth: number,
  targetRowHeight: number,
  limitNodeSearch: number,
  minPhotos?: number,
  maxPhotos?: number,
) {
  return (node: number) => {
    const results = new Map<number, number>();
    results.set(node, 0);
    const startOffset = minPhotos || 1;
    const endOffset = Math.min(limitNodeSearch, maxPhotos || Infinity);
    for (let i = node + startOffset; i < photos.length + 1; i += 1) {
      if (i - node > endOffset) break;
      const currentCost = cost(photos, node, i, containerWidth, spacing, padding, targetRowHeight);
      if (currentCost === undefined) break;
      results.set(i, currentCost);
    }
    return results;
  };
}

// compute sizes by creating a graph with rows as edges and photo to break on as nodes
// to calculate the single best layout using Dijkstra's findShortestPath
export default function computeRowsLayout<TPhoto extends Photo>(
  photos: TPhoto[],
  spacing: number,
  padding: number,
  containerWidth: number,
  targetRowHeight: number,
  minPhotos?: number,
  maxPhotos?: number,
): LayoutModel<TPhoto> | undefined {
  const limitNodeSearch = findIdealNodeSearch(photos, containerWidth, targetRowHeight);

  const getNeighbors = makeGetRowNeighbors(
    photos,
    spacing,
    padding,
    containerWidth,
    targetRowHeight,
    limitNodeSearch,
    minPhotos,
    maxPhotos,
  );

  const path = findShortestPath(getNeighbors, 0, photos.length);

  // impossible layout
  if (!path) return undefined;

  const tracks = [];

  for (let i = 1; i < path.length; i += 1) {
    const row = photos.map((photo, index) => ({ photo, index })).slice(path[i - 1], path[i]);
    const height = getCommonHeight(
      row.map(({ photo }) => photo),
      containerWidth,
      spacing,
      padding,
    );
    tracks.push({
      photos: row.map(({ photo, index }) => ({
        photo,
        index,
        width: height * ratio(photo),
        height,
      })),
    });
  }

  return { spacing, padding, containerWidth, tracks, horizontal: true };
}
