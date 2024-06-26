export type Comparator<T> = (a: T, b: T) => number;

export function rankingFunctionComparator<T>(rank: (element: T) => number) {
  return (a: T, b: T) => rank(b) - rank(a);
}

/**
 * Min heap implementation.
 * Comparator function is expected to return a positive number, zero or a negative number if a > b, a === b or a < b.
 */
export default function MinHeap<T>(comparator: Comparator<T>) {
  // heap size
  let n = 0;

  // heap-ordered complete binary tree in heap[1..n] with heap[0] unused
  const heap: T[] = [];

  // comparator function
  const greater = (i: number, j: number) => comparator(heap[i], heap[j]) < 0;

  // swap two elements
  const swap = (i: number, j: number) => {
    const temp = heap[i];
    heap[i] = heap[j];
    heap[j] = temp;
  };

  // bubble i-th element up
  const swim = (i: number) => {
    let k = i;
    let k2 = Math.floor(k / 2);
    while (k > 1 && greater(k2, k)) {
      swap(k2, k);
      k = k2;
      k2 = Math.floor(k / 2);
    }
  };

  // bubble i-th element down
  const sink = (i: number) => {
    let k = i;
    let k2 = k * 2;
    while (k2 <= n) {
      if (k2 < n && greater(k2, k2 + 1)) k2 += 1;
      if (!greater(k, k2)) break;
      swap(k, k2);
      k = k2;
      k2 = k * 2;
    }
  };

  /** add element to the heap */
  const push = (element: T) => {
    n += 1;
    heap[n] = element;
    swim(n);
  };

  /** remove the first element from the heap */
  const pop = () => {
    if (n === 0) return undefined;
    swap(1, n);
    n -= 1;
    const max = heap.pop();
    sink(1);
    return max;
  };

  /** heap size */
  const size = () => n;

  return { push, pop, size };
}
