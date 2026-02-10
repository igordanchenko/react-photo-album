import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import useIntersectionObserver from "../../src/scroll/useIntersectionObserver";
import { triggerIntersection } from "../test-utils";

describe("useIntersectionObserver", () => {
  it("supports multiple listeners", async () => {
    const { result } = renderHook(() => useIntersectionObserver("100px"));
    const { observe, unobserve } = result.current;

    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const target = document.createElement("div");

    act(() => {
      observe(target, callback1);
      observe(target, callback2);
    });

    await triggerIntersection();

    act(() => {
      unobserve();
    });

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
  });

  it("supports custom scroll container", async () => {
    const callback = vi.fn();

    const target = document.createElement("div");
    const scrollContainer1 = document.createElement("div");
    const scrollContainer2 = document.createElement("div");

    const { result: observer1 } = renderHook(() => useIntersectionObserver("50px", () => scrollContainer1));
    const { result: observer2 } = renderHook(() => useIntersectionObserver("50px", () => scrollContainer2));
    const { result: observer3 } = renderHook(() => useIntersectionObserver("50px", () => scrollContainer2));

    act(() => {
      observer1.current.observe(target, callback);
      observer2.current.observe(target, callback);
      observer3.current.observe(target, callback);
    });

    await triggerIntersection();

    act(() => {
      observer1.current.unobserve();
      observer2.current.unobserve();
      observer3.current.unobserve();
    });

    // 2 calls because:
    // - observer1 uses scrollContainer1 → unique observer "1_50px" → 1 call
    // - observer2 and observer3 both use scrollContainer2 → shared observer "2_50px"
    //   with the same callback deduplicated by Set → 1 call
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
