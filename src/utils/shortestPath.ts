type GraphFunction = (node: number) => Array<{ neighbor: number; weight: number }>;

type Comp = number[][][];

const computeShortestPath = (graph: GraphFunction, pathLength: number, startNode: number, endNode: number) => {
    // computation matrix: node id x path length x [previous node id, path weight]
    // i.e. element in comp[X][k] represents previous node and path weight of the best path of length k
    // from the starting node to node X
    const comp: Comp = [];

    // sorted set of neighboring nodes that need to be visited
    // i.e. queue[k][X] represents node X with partial path of length k
    const queue: { [key: number]: { [key: number]: object | null } } = { 0: { [startNode]: null } };

    for (let length = 0; length < pathLength; length += 1) {
        Object.keys(queue[length]).forEach((n) => {
            const node = +n;
            const accumulatedWeight = length > 0 && comp[node][length] ? comp[node][length][1] : 0;

            graph(node).forEach(({ neighbor, weight }) => {
                if (!comp[neighbor]) {
                    comp[neighbor] = [];
                }

                // introducing deterministic tiebreaker to guard against edge cases where path weight difference can be
                // as low as 1e-12, which leads to visual flickering during subsequent re-renders as layout continues to
                // shift back and forth
                const newTotalWeight = accumulatedWeight + weight;
                if (
                    !comp[neighbor][length + 1] ||
                    (comp[neighbor][length + 1][1] > newTotalWeight &&
                        (comp[neighbor][length + 1][1] / newTotalWeight > 1.0001 ||
                            node < comp[neighbor][length + 1][0]))
                ) {
                    comp[neighbor][length + 1] = [node, newTotalWeight];
                }

                if (length < pathLength - 1 && neighbor !== endNode) {
                    if (!queue[length + 1]) {
                        queue[length + 1] = {};
                    }
                    queue[length + 1][neighbor] = null;
                }
            });
        });
    }
    return comp;
};

const reconstructShortestPath = (comp: Comp, pathLength: number, endNode: number) => {
    const path = [endNode];
    for (let node = endNode, length = pathLength; length > 0; length -= 1) {
        const [prevNode] = comp[node][length];
        node = prevNode;
        path.push(node);
    }
    return path.reverse();
};

// Find the shortest path of length N in a weighted directed graph using dynamic programming algorithm.
const findShortestPathLengthN = (graph: GraphFunction, pathLength: number, startNode: number, endNode: number) =>
    reconstructShortestPath(computeShortestPath(graph, pathLength, startNode, endNode), pathLength, endNode);

export default findShortestPathLengthN;
