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
});
