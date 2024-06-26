import findShortestPathLengthN from "./shortestPath";
import { ratio } from "../../core/utils";
import { LayoutModel, Photo } from "../../types";

// return function that gets the neighboring nodes of node and returns costs
function makeGetColumnNeighbors(
  photos: Photo[],
  spacing: number,
  padding: number,
  targetColumnWidth: number,
  targetColumnHeight: number,
) {
  return (node: number): [neighbor: number, weight: number][] => {
    const results: [neighbor: number, weight: number][] = [];
    const cutOffHeight = targetColumnHeight * 1.5;
    let height = targetColumnWidth / ratio(photos[node]) + 2 * padding;
    for (let i = node + 1; i < photos.length + 1; i += 1) {
      results.push([i, (targetColumnHeight - height) ** 2]);
      if (height > cutOffHeight || i === photos.length) {
        break;
      }
      height += targetColumnWidth / ratio(photos[i]) + spacing + 2 * padding;
    }
    return results;
  };
}

function buildColumnsModel<TPhoto extends Photo>(
  path: number[],
  photos: TPhoto[],
  spacing: number,
  padding: number,
  containerWidth: number,
  columnsGaps: number[],
  columnsRatios: number[],
) {
  const tracks = [];

  const totalRatio = columnsRatios.reduce((total, columnRatio) => total + columnRatio, 0);

  for (let i = 0; i < path.length - 1; i += 1) {
    const column = photos.map((photo, index) => ({ photo, index })).slice(path[i], path[i + 1]);

    const adjustedGaps = columnsRatios.reduce(
      (total, columnRatio, index) => total + (columnsGaps[i] - columnsGaps[index]) * columnRatio,
      0,
    );

    const columnWidth =
      ((containerWidth - (path.length - 2) * spacing - 2 * (path.length - 1) * padding - adjustedGaps) *
        columnsRatios[i]) /
      totalRatio;

    tracks.push({
      photos: column.map(({ photo, index }) => ({
        photo,
        index,
        width: columnWidth,
        height: columnWidth / ratio(photo),
      })),
      variables: { adjustedGaps, columnRatio: columnsRatios[i] },
    });
  }

  return { tracks, variables: { totalRatio } };
}

function computeColumnsModel<TPhoto extends Photo>(
  photos: TPhoto[],
  spacing: number,
  padding: number,
  containerWidth: number,
  targetColumnWidth: number,
  columns: number,
) {
  const columnsGaps: number[] = [];
  const columnsRatios: number[] = [];

  // fill first available columns if there are not enough photos
  if (photos.length <= columns) {
    const averageRatio = photos.length > 0 ? photos.reduce((acc, photo) => acc + ratio(photo), 0) / photos.length : 1;

    for (let i = 0; i < columns; i += 1) {
      columnsGaps[i] = 2 * padding;
      columnsRatios[i] = i < photos.length ? ratio(photos[i]) : averageRatio;
    }

    return buildColumnsModel(
      Array.from({ length: columns + 1 }, (_, index) => Math.min(index, photos.length)),
      photos,
      spacing,
      padding,
      containerWidth,
      columnsGaps,
      columnsRatios,
    );
  }

  // target column height including spacing and padding
  const targetColumnHeight =
    (photos.reduce((acc, photo) => acc + targetColumnWidth / ratio(photo), 0) +
      spacing * (photos.length - columns) +
      2 * padding * photos.length) /
    columns;

  const getNeighbors = makeGetColumnNeighbors(photos, spacing, padding, targetColumnWidth, targetColumnHeight);

  const path = findShortestPathLengthN(getNeighbors, columns, 0, photos.length);

  for (let i = 0; i < path.length - 1; i += 1) {
    const column = photos.slice(path[i], path[i + 1]);
    columnsGaps[i] = spacing * (column.length - 1) + 2 * padding * column.length;
    columnsRatios[i] = 1 / column.reduce((acc, photo) => acc + 1 / ratio(photo), 0);
  }

  return buildColumnsModel(path, photos, spacing, padding, containerWidth, columnsGaps, columnsRatios);
}

export default function computeColumnsLayout<TPhoto extends Photo>(
  photos: TPhoto[],
  spacing: number,
  padding: number,
  containerWidth: number,
  columns: number,
): LayoutModel<TPhoto> | undefined {
  const targetColumnWidth = (containerWidth - spacing * (columns - 1) - 2 * padding * columns) / columns;

  const { tracks, variables } = computeColumnsModel(
    photos,
    spacing,
    padding,
    containerWidth,
    targetColumnWidth,
    columns,
  );

  if (tracks.some((track) => track.photos.some(({ width, height }) => width < 0 || height < 0))) {
    // encountered impossible layout - try to find a solution recursively with fewer columns or bail out
    return columns > 1 ? computeColumnsLayout(photos, spacing, padding, containerWidth, columns - 1) : undefined;
  }

  return { tracks, spacing, padding, containerWidth, variables: { columns, ...variables } };
}
