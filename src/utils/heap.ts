export type Comparator<T> = (a: T, b: T) => number;

export function rankingFunctionComparator<T>(rank: (element: T) => number) {
  return (a: T, b: T) => rank(b) - rank(a);
}

/**
 * Min heap implementation.
 * Comparator function is expected to return a positive number, zero or a negative number if a > b, a === b or a < b.
 */
export default class MinHeap<T> {
  // heap-ordered complete binary tree in heap[1..n] with heap[0] unused
  protected heap: T[] = [];

  protected n = 0;

  constructor(protected comparator: Comparator<T>) {}

  // comparator function
  protected greater(i: number, j: number) {
    return this.comparator(this.heap[i], this.heap[j]) < 0;
  }

  // swap two elements
  protected swap(i: number, j: number) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  // bubble i-th element up
  protected swim(i: number) {
    let k = i;
    let k2 = Math.floor(k / 2);
    while (k > 1 && this.greater(k2, k)) {
      this.swap(k2, k);
      k = k2;
      k2 = Math.floor(k / 2);
    }
  }

  // bubble i-th element down
  protected sink(i: number) {
    let k = i;
    let k2 = k * 2;
    while (k2 <= this.n) {
      if (k2 < this.n && this.greater(k2, k2 + 1)) k2 += 1;
      if (!this.greater(k, k2)) break;
      this.swap(k, k2);
      k = k2;
      k2 = k * 2;
    }
  }

  /** add element to the heap */
  public push(element: T) {
    this.n += 1;
    this.heap[this.n] = element;
    this.swim(this.n);
  }

  /** remove the first element from the heap */
  public pop() {
    if (this.n === 0) return undefined;
    this.swap(1, this.n);
    this.n -= 1;
    const max = this.heap.pop();
    this.sink(1);
    return max;
  }

  /** heap size */
  public size() {
    return this.n;
  }
}
