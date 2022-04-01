import { useEffect, useLayoutEffect } from "react";

/* istanbul ignore next */
const useIsomorphicEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

export default useIsomorphicEffect;
