import { useEffect, useState } from "react";

export function useCurrentMinute(){
    const [timeNow, setTimeNow] = useState<Date>(new Date());

    useEffect(() => {
        const intervalID = setInterval(() => {
            setTimeNow(new Date())
        }, 1000)

        return () => clearInterval(intervalID);
    }, [])

    return timeNow;
}