import { useRef, useEffect } from 'react';
import isEqual from 'lodash.isequal';

const useDeepEffect = (effectFunc: () => void, deps: Array<any>) => {
    const isFirst = useRef(true);
    const prevDeps = useRef(deps);

    useEffect(() => {
        const isSame = prevDeps.current.every((obj, index) => isEqual(obj, deps[index]));
        if (isFirst || !isSame) {
            effectFunc();
        }
        isFirst.current = false;
        prevDeps.current = deps;
    }, deps);
};

export default useDeepEffect;
