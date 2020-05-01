import { useState, useEffect } from 'react';

const getWindowSize = () => ({
    height: window.innerHeight,
    width: window.innerWidth,
});

export interface WindowSize {
    width: number;
    height: number;
}

const useWindowSize = (callback?: (size: WindowSize) => void) => {
    const [windowSize, setWindowSize] = useState(getWindowSize());

    const onResize = (event: any) => {
        if (event.target) {
            const { innerWidth, innerHeight } = event.target as Window;
            const size = { height: innerHeight, width: innerWidth };
            setWindowSize(size);
            if (callback) {
                callback(size);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('resize', onResize, { passive: true });
        return () => {
            window.removeEventListener('resize', onResize);
        };
    });

    return windowSize;
};

export default useWindowSize;
