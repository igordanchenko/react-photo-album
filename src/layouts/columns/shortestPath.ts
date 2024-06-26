export type GraphFunction<T> = (node: T) => [neighbor: T, weight: number][];

type Matrix<T> = Map<T, [node: T, weight: number][]>;

function computeShortestPath<T>(graph: GraphFunction<T>, pathLength: number, startNode: T, endNode: T) {
  // computation matrix: node x path length x { node: previous node id, weight: path weight }
  // i.e. element in matrix.get(X)[k] represents previous node and path weight of the best path of length k
  // from the starting node to node X
  const matrix: Matrix<T> = new Map();

  // set of neighboring nodes that need to be visited
  const queue = new Set<T>();
  queue.add(startNode);

  for (let length = 0; length < pathLength; length += 1) {
    // make a copy of the current queue
    const currentQueue = [...queue.keys()];

    // clear the queue for the next iteration
    queue.clear();

    currentQueue.forEach((node) => {
      const accumulatedWeight = length > 0 ? matrix.get(node)![length][1] : 0;

      graph(node).forEach(([neighbor, weight]) => {
        let paths = matrix.get(neighbor);
        if (!paths) {
          paths = [];
          matrix.set(neighbor, paths);
        }

        // introducing deterministic tiebreaker to guard against edge cases where path weight difference can be
        // as low as 1e-12, which leads to visual flickering during subsequent re-renders as layout continues to
        // shift back and forth
        const newWeight = accumulatedWeight + weight;
        const nextPath = paths[length + 1];
        if (!nextPath || (nextPath[1] > newWeight && (nextPath[1] / newWeight > 1.0001 || node < nextPath[0]))) {
          paths[length + 1] = [node, newWeight];
        }

        if (length < pathLength - 1 && neighbor !== endNode) {
          queue.add(neighbor);
        }
      });
    });
  }

  return matrix;
}

function reconstructShortestPath<T>(matrix: Matrix<T>, pathLength: number, endNode: T) {
  const path = [endNode];
  for (let node = endNode, length = pathLength; length > 0; length -= 1) {
    [node] = matrix.get(node)![length];
    path.push(node);
  }
  return path.reverse();
}

// Find the shortest path of length N in a weighted directed graph using dynamic programming algorithm.
export default function findShortestPathLengthN<T>(
  graph: GraphFunction<T>,
  pathLength: number,
  startNode: T,
  endNode: T,
) {
  return reconstructShortestPath(computeShortestPath(graph, pathLength, startNode, endNode), pathLength, endNode);
}
