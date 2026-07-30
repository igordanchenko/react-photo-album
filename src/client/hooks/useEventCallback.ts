import { useCallback, useRef } from "react";

import useLayoutEffect from "./useLayoutEffect";

export default function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
): (...args: Args) => Return {
  const ref = useRef(fn);
  useLayoutEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args: Args) => ref.current?.(...args), []);
}
