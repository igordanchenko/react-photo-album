import { describe, expect, it } from "vitest";

import { clsx, ratio, resolveResponsiveParameter, round, srcSetAndSizes, unwrapParameter } from "../../src/utils";

describe("clsx", () => {
  it("joins truthy strings", () => {
    expect(clsx("a", "b", "c")).toBe("a b c");
  });

  it("filters falsy values", () => {
    expect(clsx("a", false, undefined, "b")).toBe("a b");
  });

  it("returns empty string when no truthy values", () => {
    expect(clsx()).toBe("");
    expect(clsx(false, undefined)).toBe("");
  });
});

describe("round", () => {
  it("rounds to integer by default", () => {
    expect(round(1.4)).toBe(1);
    expect(round(1.5)).toBe(2);
  });

  it("rounds to specified decimal places", () => {
    expect(round(1.2345, 2)).toBe(1.23);
    expect(round(1.2355, 2)).toBe(1.24);
  });

  it("corrects floating-point drift with EPSILON", () => {
    // 1.005 * 100 = 100.49999... in IEEE 754; EPSILON nudges it past 0.5
    expect(round(1.005, 2)).toBe(1.01);
  });
});

describe("ratio", () => {
  it("returns width / height", () => {
    expect(ratio({ width: 300, height: 200 })).toBe(1.5);
    expect(ratio({ width: 100, height: 100 })).toBe(1);
  });

  it("falls back to 1 for zero height (Infinity)", () => {
    expect(ratio({ width: 100, height: 0 })).toBe(1);
  });

  it("falls back to 1 for zero width and zero height (NaN)", () => {
    expect(ratio({ width: 0, height: 0 })).toBe(1);
  });

  it("returns 0 for zero width with non-zero height", () => {
    // 0 / height is 0, which is finite — not a fallback case
    expect(ratio({ width: 0, height: 100 })).toBe(0);
  });
});

describe("unwrapParameter", () => {
  it("returns undefined when containerWidth is undefined", () => {
    expect(unwrapParameter(10, undefined)).toBeUndefined();
    expect(unwrapParameter((w: number) => w * 2, undefined)).toBeUndefined();
  });

  it("returns a plain value when containerWidth is provided", () => {
    expect(unwrapParameter(10, 800)).toBe(10);
    expect(unwrapParameter(undefined, 800)).toBeUndefined();
  });

  it("calls function values with containerWidth", () => {
    expect(unwrapParameter((w: number) => w * 2, 400)).toBe(800);
  });
});

describe("resolveResponsiveParameter", () => {
  // mirrors the spacing defaults used in resolveCommonProps
  const defaults = [20, 15, 10, 5];

  it("returns undefined when containerWidth is undefined", () => {
    expect(resolveResponsiveParameter(undefined, undefined, defaults)).toBeUndefined();
  });

  it("selects responsive default by container width", () => {
    // breakpoints: [1200, 600, 300, 0]
    expect(resolveResponsiveParameter(undefined, 1200, defaults)).toBe(20);
    expect(resolveResponsiveParameter(undefined, 800, defaults)).toBe(15);
    expect(resolveResponsiveParameter(undefined, 400, defaults)).toBe(10);
    expect(resolveResponsiveParameter(undefined, 100, defaults)).toBe(5);
  });

  it("uses explicit parameter over responsive defaults", () => {
    expect(resolveResponsiveParameter(7, 800, defaults)).toBe(7);
    expect(resolveResponsiveParameter((w: number) => Math.floor(w / 100), 800, defaults)).toBe(8);
  });

  it("clamps result to minValue", () => {
    expect(resolveResponsiveParameter(-5, 800, defaults, 0)).toBe(0);
  });
});

describe("srcSetAndSizes", () => {
  const photo = { src: "photo.jpg", width: 800, height: 600 };

  it("produces a vw sizes approximation when no responsiveSizes given", () => {
    const { srcSet, sizes } = srcSetAndSizes(photo, undefined, 400, 800, 1, 0, 0);
    expect(srcSet).toBeUndefined();
    expect(sizes).toBe("50vw");
  });

  it("builds srcSet from photo.srcSet, appending original when absent", () => {
    const photoWithSrcSet = {
      ...photo,
      srcSet: [
        { src: "photo-400.jpg", width: 400, height: 300 },
        { src: "photo-1200.jpg", width: 1200, height: 900 },
      ],
    };
    const { srcSet } = srcSetAndSizes(photoWithSrcSet, undefined, 400, 800, 1, 0, 0);
    expect(srcSet).toBe("photo-400.jpg 400w, photo.jpg 800w, photo-1200.jpg 1200w");
  });

  it("does not duplicate original src when already present in srcSet", () => {
    const photoWithSrcSet = { ...photo, srcSet: [{ src: "photo.jpg", width: 800, height: 600 }] };
    const { srcSet } = srcSetAndSizes(photoWithSrcSet, undefined, 400, 800, 1, 0, 0);
    expect(srcSet).toBe("photo.jpg 800w");
  });

  it("produces calc sizes from responsiveSizes.size", () => {
    // gaps = spacing * (photosCount-1) + 2 * padding * photosCount
    //      = 10 * 1 + 2 * 5 * 2 = 30
    // ratio = round((800 - 30) / 400, 5) = 1.925
    const { sizes } = srcSetAndSizes(photo, { size: "100vw" }, 400, 800, 2, 10, 5);
    expect(sizes).toBe("calc((100vw - 30px) / 1.925)");
  });

  it("unwraps outer calc() wrapper in responsiveSizes.size", () => {
    // "calc(100vw - 200px)" → inner "100vw - 200px"
    // gaps = 0, ratio = round(800/400, 5) = 2
    const { sizes } = srcSetAndSizes(photo, { size: "calc(100vw - 200px)" }, 400, 800, 1, 0, 0);
    expect(sizes).toBe("calc((100vw - 200px - 0px) / 2)");
  });

  it("prepends per-breakpoint media queries to sizes", () => {
    const { sizes } = srcSetAndSizes(
      photo,
      { size: "100vw", sizes: [{ viewport: "(max-width: 600px)", size: "50vw" }] },
      400,
      800,
      1,
      0,
      0,
    );
    // "(max-width: 600px) calc((50vw - 0px) / 2), calc((100vw - 0px) / 2)"
    expect(sizes).toMatch(/^\(max-width: 600px\) calc\(.+\), calc\(.+\)$/);
  });
});
