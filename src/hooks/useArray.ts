import * as React from "react";

const useArray = <T>(array: T[] | undefined) => {
    const ref = React.useRef(array);
    if (!array || !ref.current || array.join() !== ref.current.join()) {
        ref.current = array;
    }
    return ref.current;
};

export default useArray;
