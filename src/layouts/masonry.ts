import ratio from "../utils/ratio";
import { ColumnsLayoutOptions, Photo, PhotoLayout } from "../types";

export type ComputeMasonryLayoutProps<T extends Photo = Photo> = {
  photos: T[];
  layoutOptions: ColumnsLayoutOptions<T>;
};

export type MasonryColumnsModel<T extends Photo = Photo> = { photo: T; layout: PhotoLayout }[][] | undefined;

export default function computeMasonryLayout<T extends Photo = Photo>(
  props: ComputeMasonryLayoutProps<T>,
): MasonryColumnsModel<T> {
  const { photos, layoutOptions } = props;
  const { columns, spacing, padding, containerWidth } = layoutOptions;

  // calculate column width based on total width and columns count
  const columnWidth = (containerWidth - spacing * (columns - 1) - 2 * padding * columns) / columns;

  // encountered impossible layout
  if (columnWidth <= 0) {
    // will try to find a solution recursively with fewer columns
    return columns > 1
      ? computeMasonryLayout({
          ...props,
          layoutOptions: { ...layoutOptions, columns: columns - 1 },
        })
      : undefined;
  }

  // store current top positions for each column
  const columnsCurrentTopPositions: number[] = [];
  for (let i = 0; i < columns; i += 1) {
    columnsCurrentTopPositions[i] = 0;
  }

  // group photos by column
  const columnsModel = photos.reduce<{ photo: T; index: number }[][]>(
    (model, photo, index) => {
      // find the shortest column
      const shortestColumn = columnsCurrentTopPositions.reduce(
        (currentShortestColumn, item, i) =>
          // subtracting 1 here to compensate for floating point precision errors
          // when two columns have identical height their floating point values can be slightly off
          // in subsequent re-renders, leading to images jumping between columns
          item < columnsCurrentTopPositions[currentShortestColumn] - 1 ? i : currentShortestColumn,
        0,
      );

      // update top position of the shortest column
      columnsCurrentTopPositions[shortestColumn] =
        columnsCurrentTopPositions[shortestColumn] + columnWidth / ratio(photo) + spacing + 2 * padding;

      // place a photo into the shortest column
      model[shortestColumn].push({ photo, index });

      return model;
    },
    Array.from({ length: columns }).map(() => []),
  );

  // map through each column and photo and add layout properties
  return columnsModel.map((column) =>
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
