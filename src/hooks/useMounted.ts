import { useState } from "react";
import useLayoutEffect from "./useLayoutEffect";

const useMounted = () => {
    const [mounted, setMounted] = useState(false);

    useLayoutEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    return mounted;
};

export default useMounted;
