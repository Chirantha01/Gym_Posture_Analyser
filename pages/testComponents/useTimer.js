// useTimer.js
import { useEffect, useRef, useState } from 'react';

const useTimer = (isActive) => {
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => {
            clearInterval(timerRef.current);
        };
    }, [isActive]);

    return time;
};

export default useTimer;
