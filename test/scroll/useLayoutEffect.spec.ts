import { useEffect, useLayoutEffect } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("useLayoutEffect", () => {
  // clear the module cache after each test
  afterEach(vi.resetModules);

  it("imports React.useLayoutEffect on the client", async () => {
    expect((await import("../../src/scroll/useLayoutEffect")).default).toBe(useLayoutEffect);
  });

  it("imports React.useEffect on the server", async () => {
    const globalWindow = global.window;
    global.window = undefined as unknown as typeof global.window;

    expect((await import("../../src/scroll/useLayoutEffect")).default).toBe(useEffect);

    global.window = globalWindow;
  });
});
