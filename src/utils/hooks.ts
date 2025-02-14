import { useEffect, useState } from "react"

export const useDebounce = (cb: string, delay: number) => {
    const [debunceVal, setDebounceVal] = useState<string>(cb);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceVal(cb);
        }, delay);

        return () => {
            clearTimeout(handler);
        }
    }, [cb, delay]);

    return debunceVal;
}