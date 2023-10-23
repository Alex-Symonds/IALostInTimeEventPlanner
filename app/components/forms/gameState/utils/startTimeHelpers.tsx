import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { deepCopy } from '@/app/utils/utils';

export interface I_StartTimeKit {
    startTime : Date, 
    setStartTime: Dispatch<SetStateAction<Date>> 
}


export function startTimeKit({startTime, setStartTime}
    : I_StartTimeKit){

    function handleHourChange(e : ChangeEvent<HTMLSelectElement>){
        let newTime = deepCopy(startTime);
        newTime.setHours(parseInt(e.target.value));
        setStartTime(newTime);
    }

    function handleMinuteChange(e : ChangeEvent<HTMLSelectElement>){
        let newTime = structuredClone(startTime);
        newTime.setMinutes(parseInt(e.target.value));
        setStartTime(newTime);
    }

    return {
        handleHourChange,
        handleMinuteChange
    }
}