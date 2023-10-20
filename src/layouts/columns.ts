import ratio from "../utils/ratio";
import findShortestPathLengthN from "../utils/shortestPath";
import { ColumnsLayoutOptions, Photo, PhotoLayout } from "../types";

// return function that gets the neighboring nodes of node and returns costs
function makeGetColumnNeighbors({
  photos,
  spacing,
  padding,
  targetColumnWidth,
  targetColumnHeight,
}: {
  photos: Photo[];
  spacing: number;
  padding: number;
  targetColumnWidth: number;
  targetColumnHeight: number;
}) {
  return (node: number): Array<{ neighbor: number; weight: number }> => {
    const results = [];
    const cutOffHeight = targetColumnHeight * 1.5;
    let height = targetColumnWidth / ratio(photos[node]) + 2 * padding;
    for (let i = node + 1; i < photos.length + 1; i += 1) {
      results.push({ neighbor: i, weight: (targetColumnHeight - height) ** 2 });
      if (height > cutOffHeight || i === photos.length) {
        break;
      }
      height += targetColumnWidth / ratio(photos[i]) + spacing + 2 * padding;
    }
    return results;
  };
}

function buildColumnsModel<T extends Photo = Photo>({
  path,
  photos,
  containerWidth,
  columnsGaps,
  columnsRatios,
  spacing,
  padding,
}: {
  path: number[];
  photos: T[];
  containerWidth: number;
  columnsGaps: number[];
  columnsRatios: number[];
  spacing: number;
  padding: number;
}) {
  const columnsModel = [];

  const totalRatio = columnsRatios.reduce((total, columnRatio) => total + columnRatio, 0);

  for (let i = 0; i < path.length - 1; i += 1) {
    const column = photos.map((photo, index) => ({ photo, index })).slice(path[i], path[i + 1]);

    const totalAdjustedGaps = columnsRatios.reduce(
      (total, columnRatio, index) => total + (columnsGaps[i] - columnsGaps[index]) * columnRatio,
      0,
    );

    const columnWidth =
      ((containerWidth - (path.length - 2) * spacing - 2 * (path.length - 1) * padding - totalAdjustedGaps) *
        columnsRatios[i]) /
      totalRatio;

    columnsModel.push(
      column.map(({ photo, index }, photoIndex) => ({
        photo,
        layout: {
          width: columnWidth,
          height: columnWidth / ratio(photo),
          index,
          photoIndex,
          photosCount: column.length,
        },
      })),
    );
  }

  return columnsModel;
}

function computeColumnsModel<T extends Photo = Photo>({
  photos,
  layoutOptions,
  targetColumnWidth,
}: {
  photos: T[];
  layoutOptions: ColumnsLayoutOptions<T>;
  targetColumnWidth: number;
}) {
  const { columns, spacing, padding, containerWidth } = layoutOptions;

  const columnsGaps: number[] = [];
  const columnsRatios: number[] = [];

  // fill first available columns if there are not enough photos
  if (photos.length <= columns) {
    const averageRatio = photos.length > 0 ? photos.reduce((acc, photo) => acc + ratio(photo), 0) / photos.length : 1;

    for (let i = 0; i < columns; i += 1) {
      columnsGaps[i] = 2 * padding;
      columnsRatios[i] = i < photos.length ? ratio(photos[i]) : averageRatio;
    }

    const columnsModel = buildColumnsModel({
      path: Array.from({ length: columns + 1 }).map((_, index) => Math.min(index, photos.length)),
      photos,
      columnsRatios,
      columnsGaps,
      containerWidth,
      spacing,
      padding,
    });

    return { columnsGaps, columnsRatios, columnsModel };
  }

  // target column height including spacing and padding
  const targetColumnHeight =
    (photos.reduce((acc, photo) => acc + targetColumnWidth / ratio(photo), 0) +
      spacing * (photos.length - columns) +
      2 * padding * photos.length) /
    columns;

  const getNeighbors = makeGetColumnNeighbors({
    photos,
    targetColumnWidth,
    targetColumnHeight,
    spacing,
    padding,
  });

  const path = findShortestPathLengthN(getNeighbors, columns, 0, photos.length);

  for (let i = 0; i < path.length - 1; i += 1) {
    const column = photos.slice(path[i], path[i + 1]);
    columnsGaps[i] = spacing * (column.length - 1) + 2 * padding * column.length;
    columnsRatios[i] = 1 / column.reduce((acc, photo) => acc + 1 / ratio(photo), 0);
  }

  const columnsModel = buildColumnsModel({
    path,
    photos,
    columnsRatios,
    columnsGaps,
    containerWidth,
    spacing,
    padding,
  });

  return { columnsGaps, columnsRatios, columnsModel };
}

export type ComputeColumnsLayoutProps<T extends Photo = Photo> = {
  photos: T[];
  layoutOptions: ColumnsLayoutOptions<T>;
};

export type ColumnsLayoutModel<T extends Photo = Photo> =
  | {
      columnsModel: { photo: T; layout: PhotoLayout }[][];
      columnsRatios: number[];
      columnsGaps: number[];
    }
  | undefined;

function computeLayout<T extends Photo = Photo>(props: ComputeColumnsLayoutProps<T>): ColumnsLayoutModel<T> {
  const { photos, layoutOptions } = props;
  const { columns, spacing, padding, containerWidth } = layoutOptions;

  const targetColumnWidth = (containerWidth - spacing * (columns - 1) - 2 * padding * columns) / columns;

  const { columnsGaps, columnsRatios, columnsModel } = computeColumnsModel({
    photos,
    layoutOptions,
    targetColumnWidth,
  });

  if (
    columnsModel.findIndex(
      (columnModel) => columnModel.findIndex(({ layout: { width, height } }) => width < 0 || height < 0) >= 0,
    ) >= 0
  ) {
    // encountered impossible layout
    if (columns > 1) {
      // will try to find a solution recursively with fewer columns
      return computeLayout({ photos, layoutOptions: { ...layoutOptions, columns: columns - 1 } });
    }

    // bailing out
    return undefined;
  }

  return { columnsModel, columnsGaps, columnsRatios };
}

export default function computeColumnsLayout<T extends Photo = Photo>({
  photos,
  layoutOptions,
}: ComputeColumnsLayoutProps<T>): ColumnsLayoutModel<T> {
  return computeLayout({ photos, layoutOptions });
}
