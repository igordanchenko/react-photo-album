import MinHeap, { NumericComparator } from "../../src/utils/heap";

describe("Heap", () => {
    it("accepts elements", () => {
        const heap = MinHeap<number>(NumericComparator);
        for (let i = 0; i < 100; i++) {
            heap.push(Math.round(Math.random() * 1_000));
            expect(heap.size()).toBe(i + 1);
        }
    });

    it("returns elements in ascending order", () => {
        const heap = MinHeap<number>(NumericComparator);
        for (let i = 0; i < 100; i++) {
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
        const heap = MinHeap<number>(NumericComparator);
        expect(heap.pop()).toBeUndefined();
    });
});
