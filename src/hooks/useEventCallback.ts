import * as React from "react";

import useLayoutEffect from "./useLayoutEffect";

const useEventCallback = <Args extends unknown[], Return>(
    fn: (...args: Args) => Return
): ((...args: Args) => Return) => {
    const ref = React.useRef(fn);
    useLayoutEffect(() => {
        ref.current = fn;
    });
    /* istanbul ignore next */
    return React.useCallback((...args: Args) => ref.current?.(...args), []);
};

export default useEventCallback;
