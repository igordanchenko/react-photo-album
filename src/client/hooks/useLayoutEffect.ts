import { useEffect as reactUseEffect, useLayoutEffect as reactUseLayoutEffect } from "react";

const useLayoutEffect = typeof window !== "undefined" ? reactUseLayoutEffect : reactUseEffect;

export default useLayoutEffect;
