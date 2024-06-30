import { useEffect as reactUseEffect, useLayoutEffect as reactUseLayoutEffect } from "react";

/* c8 ignore next */
const useLayoutEffect = typeof window !== "undefined" ? reactUseLayoutEffect : reactUseEffect;

export default useLayoutEffect;
