import * as React from "react";

/* istanbul ignore next */
const useLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export default useLayoutEffect;
