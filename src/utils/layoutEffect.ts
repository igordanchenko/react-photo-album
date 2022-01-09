import { useEffect, useLayoutEffect } from "react";

/* istanbul ignore next */
export default typeof document !== "undefined" ? useLayoutEffect : useEffect;
