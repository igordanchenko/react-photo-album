export type CostFunction = (splitPoint: number) => [next: number, cost: number][];

type DP = [splitPoint: number, cost: number][][];

// empirically determined threshold for deterministic tiebreaking
const TIEBREAKER_EPSILON = 1.0001;

function computePartition(costFn: CostFunction, partitions: number, items: number) {
  // dp matrix: item x partition index x { splitPoint: previous split point, cost: accumulated cost }
  // i.e. dp[X][k] represents the previous split point and accumulated cost of the best way
  // to partition items 0..X into k groups
  const dp: DP = Array.from({ length: items + 1 }, () => []);

  // split points that need to be visited, indexed by split point
  let queue = new Array<boolean>(items + 1).fill(false);
  queue[0] = true;

  for (let partition = 0; partition < partitions; partition += 1) {
    // swap in an empty queue for the next iteration
    const currentQueue = queue;
    queue = new Array<boolean>(items + 1).fill(false);

    for (let splitPoint = 0; splitPoint <= items; splitPoint += 1) {
      if (!currentQueue[splitPoint]) continue;

      const accumulatedCost = partition > 0 ? dp[splitPoint][partition][1] : 0;

      costFn(splitPoint).forEach(([next, cost]) => {
        // introducing deterministic tiebreaker to guard against edge cases where cost difference can be
        // as low as 1e-12, which leads to visual flickering during subsequent re-renders as layout continues to
        // shift back and forth
        //
        // since split points are visited in ascending order, the first candidate wins, and a later one
        // replaces it only when it is meaningfully better (beyond TIEBREAKER_EPSILON)
        const newCost = accumulatedCost + cost;
        const existing = dp[next][partition + 1];
        if (!existing || (existing[1] > newCost && existing[1] / newCost > TIEBREAKER_EPSILON)) {
          dp[next][partition + 1] = [splitPoint, newCost];
        }

        if (partition < partitions - 1 && next !== items) {
          queue[next] = true;
        }
      });
    }
  }

  return dp;
}

function reconstructPartition(dp: DP, partitions: number, items: number) {
  // the cost function caps how many items a group can hold, so when the container is too narrow
  // there may be no way to reach the end in exactly `partitions` groups
  if (!dp[items][partitions]) return undefined;

  const splitPoints = [items];
  for (let item = items, k = partitions; k > 0; k -= 1) {
    [item] = dp[item][k];
    splitPoints.push(item);
  }
  return splitPoints.reverse();
}

// Find the optimal partition of items into N groups in a weighted directed graph using dynamic programming.
// Returns undefined when no partition into exactly N groups exists.
export default function findOptimalPartition(costFn: CostFunction, partitions: number, items: number) {
  return reconstructPartition(computePartition(costFn, partitions, items), partitions, items);
}
