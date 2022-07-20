import { useEffect, useLayoutEffect as useReactLayoutEffect } from "react";

/* istanbul ignore next */
const useLayoutEffect = typeof window !== "undefined" ? useReactLayoutEffect : useEffect;

export default useLayoutEffect;
