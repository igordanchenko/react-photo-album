import { useCallback, useRef } from "react";

import useLayoutEffect from "./useLayoutEffect";

const useEventCallback = <Args extends unknown[], Return>(
    fn: (...args: Args) => Return
): ((...args: Args) => Return) => {
    const ref = useRef(fn);
    useLayoutEffect(() => {
        ref.current = fn;
    });
    /* istanbul ignore next */
    return useCallback((...args: Args) => ref.current?.(...args), []);
};

export default useEventCallback;
