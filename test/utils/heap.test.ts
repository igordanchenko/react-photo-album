import MinHeap, { rankingFunctionComparator } from "../../src/utils/heap";

const NumericComparator = rankingFunctionComparator<number>((x: number) => x);

describe("Heap", () => {
  it("accepts elements", () => {
    const heap = new MinHeap(NumericComparator);
    for (let i = 0; i < 100; i += 1) {
      heap.push(Math.round(Math.random() * 1_000));
      expect(heap.size()).toBe(i + 1);
    }
  });

  it("returns elements in ascending order", () => {
    const heap = new MinHeap(NumericComparator);
    for (let i = 0; i < 100; i += 1) {
      heap.push(Math.round(Math.random() * 1_000));
    }
    let previous;
    while (heap.size()) {
      const element = heap.pop();
      expect(element).not.toBeUndefined();
      if (element && previous) {
        expect(previous).toBeLessThanOrEqual(element);
      }
      previous = element;
    }
  });

  it("doesn't crash when trying to pop non-existent element", () => {
    expect(new MinHeap(NumericComparator).pop()).toBeUndefined();
  });
});
