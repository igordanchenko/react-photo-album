import { ratio, round } from "../../utils";
import type { LayoutModel, Photo } from "../../types";

// empirically determined threshold for deterministic tiebreaking
const TIEBREAKER_EPSILON = 1.005;

// guesstimate the maximum number of photos per row based on
// the aspect ratio of the container with images and minimal aspect ratio of all photos
function findMaxPhotosPerRow(
  photos: readonly Photo[],
  containerWidth: number,
  targetRowHeight: number,
  minPhotos?: number,
) {
  // reduce instead of Math.min(...spread) — spreading a large array overflows the call stack
  const minRatio = photos.reduce((min, photo) => Math.min(min, ratio(photo)), Infinity);
  return round(containerWidth / targetRowHeight / minRatio) + (minPhotos || 0) + 2;
}

// get the height for a set of photos in a potential row
function getCommonHeight(photos: readonly Photo[], containerWidth: number, spacing: number, padding: number) {
  return (
    (containerWidth - (photos.length - 1) * spacing - 2 * padding * photos.length) /
    photos.reduce((acc, photo) => acc + ratio(photo), 0)
  );
}

// get the height of a row containing photos[i..j) in O(1) using precomputed prefix sums
// of photo aspect ratios (ratioSums[j] - ratioSums[i] is the total ratio of photos[i..j))
//
// the subtraction carries ~1e-13 round-off relative to direct summation, which is immaterial
// when comparing candidate rows, so the final layout uses getCommonHeight instead to keep the
// emitted geometry (and the `sizes` estimate derived from it) free of the round-off
function getEstimatedHeight(
  ratioSums: readonly number[],
  i: number,
  j: number,
  containerWidth: number,
  spacing: number,
  padding: number,
) {
  const rowLength = j - i;
  return (containerWidth - (rowLength - 1) * spacing - 2 * padding * rowLength) / (ratioSums[j] - ratioSums[i]);
}

// calculate the cost of a row containing photos[i..j)
// returns undefined if the row is impossible (negative height)
function cost(
  ratioSums: readonly number[],
  i: number,
  j: number,
  width: number,
  spacing: number,
  padding: number,
  targetRowHeight: number,
) {
  const commonHeight = getEstimatedHeight(ratioSums, i, j, width, spacing, padding);
  return commonHeight > 0 ? (commonHeight - targetRowHeight) ** 2 * (j - i) : undefined;
}

// compute optimal row breaks using dynamic programming on the DAG of possible row configurations
//
// the problem is modeled as finding the shortest path in a DAG where:
// - nodes are photo indices 0..N (break points between rows)
// - an edge from i to j means photos[i..j) form a row
// - edge weight is the weighted squared deviation from targetRowHeight
//
// since edges only go forward (i < j), nodes in topological order are simply 0, 1, ..., N
// and we can find the shortest path with a single forward pass (no priority queue needed)
export default function computeRowsLayout<TPhoto extends Photo>(
  photos: readonly TPhoto[],
  spacing: number,
  padding: number,
  containerWidth: number,
  targetRowHeight: number,
  minPhotos?: number,
  maxPhotos?: number,
): LayoutModel<TPhoto> | undefined {
  const maxPerRow = Math.min(
    findMaxPhotosPerRow(photos, containerWidth, targetRowHeight, minPhotos),
    maxPhotos || Infinity,
  );
  const minPerRow = minPhotos || 1;

  const n = photos.length;

  // prefix sums of photo aspect ratios, making each candidate row cost O(1)
  // and the whole DP pass O(n·k) instead of O(n·k²) (k = max photos per row)
  const ratioSums = new Array(n + 1);
  ratioSums[0] = 0;
  for (let i = 0; i < n; i += 1) {
    ratioSums[i + 1] = ratioSums[i] + ratio(photos[i]);
  }

  // dp[j] = minimum cost to lay out photos 0..j-1 into rows
  const dp = new Array(n + 1).fill(Infinity);
  // prev[j] = the previous break point in the optimal layout ending at j
  const prev = new Array(n + 1).fill(-1);
  dp[0] = 0;

  for (let j = 1; j <= n; j += 1) {
    // try all valid row endings at j, starting from the shortest row (fewest photos)
    // and growing longer; once a row has negative height (too many photos for the
    // container width), all longer rows will too, so we can break early
    for (let i = j - minPerRow; i >= Math.max(0, j - maxPerRow); i -= 1) {
      // skip unreachable break points (no valid layout reaches i)
      if (dp[i] === Infinity) continue;

      const c = cost(ratioSums, i, j, containerWidth, spacing, padding, targetRowHeight);

      // impossible row (negative height) — longer rows will also be impossible
      if (c === undefined) break;

      const newCost = dp[i] + c;

      // deterministic tiebreaker to guard against edge cases where cost difference can be
      // as low as 1e-12, which leads to visual flickering during subsequent re-renders as
      // layout continues to shift back and forth
      //
      // since `i` iterates strictly downward, the first improving candidate (the row with
      // the fewest photos ending at j) wins, and a longer row only replaces it when it is
      // meaningfully better (beyond TIEBREAKER_EPSILON)
      if (dp[j] === Infinity || (dp[j] > newCost && dp[j] / newCost > TIEBREAKER_EPSILON)) {
        dp[j] = newCost;
        prev[j] = i;
      }
    }
  }

  // impossible layout — no valid way to arrange all photos into rows
  if (dp[n] === Infinity) return undefined;

  // reconstruct the optimal row breaks
  const path: number[] = [];
  for (let node = n; node !== 0; node = prev[node]) {
    path.push(node);
  }
  path.push(0);
  path.reverse();

  const tracks = [];

  for (let i = 1; i < path.length; i += 1) {
    const row = photos.slice(path[i - 1], path[i]);
    const height = getCommonHeight(row, containerWidth, spacing, padding);
    tracks.push({
      photos: row.map((photo, j) => ({
        photo,
        index: path[i - 1] + j,
        width: height * ratio(photo),
        height,
      })),
    });
  }

  return { spacing, padding, containerWidth, tracks, horizontal: true };
}
