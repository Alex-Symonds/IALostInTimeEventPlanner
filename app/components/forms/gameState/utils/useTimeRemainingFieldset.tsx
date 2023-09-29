import { useState } from "react";

import { MAX_DAYS } from "@/app/utils/consts";
import { T_TimeRemainingDHM } from "@/app/utils/types";


export interface I_TimeRemainingFieldset {
    timeRemaining: T_TimeRemainingDHM,
    setTimeRemaining: React.Dispatch<React.SetStateAction<T_TimeRemainingDHM>>
}

type T_OutputUseTimeRemainingFieldset = {
    isError : boolean, 
    message : string, 
    handleChangeDays : (e : React.ChangeEvent<HTMLInputElement>) => void, 
    handleChangeHours : (e : React.ChangeEvent<HTMLInputElement>) => void, 
    handleChangeMinutes : (e : React.ChangeEvent<HTMLInputElement>) => void, 
}
export function useTimeRemainingFieldset({timeRemaining, setTimeRemaining}
    : I_TimeRemainingFieldset)
    : T_OutputUseTimeRemainingFieldset {

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");

    const MAX_HOURS = 23;
    const MAX_MINUTES = 59;

    function handleChangeDays(e : React.ChangeEvent<HTMLInputElement>){
        let newDaysStr = e.target.value;
        let newDays = parseInt(newDaysStr);

        newDays = validateDays(newDays);

        if(newDays === MAX_DAYS){
            setTimeRemaining({
                days: MAX_DAYS,
                hours: 0,
                minutes: 0
            });
            return;
        }

        setTimeRemaining(prev => {
            return {
                ...prev,
                days: newDays
            }
        });
    }

    function validateDays(newDays : number){
        const rangeStr = `days can be 0 - ${MAX_DAYS}`;

        if(newDays > MAX_DAYS){
            setMessage(rangeStr);
            setIsError(true);
            newDays = MAX_DAYS;
        }
        else if(newDays === MAX_DAYS 
                && ( timeRemaining.hours > 0 || timeRemaining.minutes > 0)
            ){
            setIsError(true);
            setMessage(`${MAX_DAYS} days is the maximum: hours and minutes set to 0`);
        }
        else if(newDays < 0){
            setIsError(true);
            setMessage(rangeStr);
            newDays = 0;
        }
        else if(isError){
            setIsError(false);
        }

        return newDays;
    }


    function handleChangeHours(e: React.ChangeEvent<HTMLInputElement>){
        let newHoursStr = e.target.value;
        let newHours = parseInt(newHoursStr);
        newHours = validateHours(newHours);

        setTimeRemaining((prev) => {
            return {
                ...prev,
                hours: newHours
            }
        });
    }

    function validateHours(newHours : number){
        const rangeStr = `hours can be 0 - ${MAX_HOURS} (inclusive)`;

        if(timeRemaining.days === MAX_DAYS && newHours !== 0){
            setIsError(true);
            setMessage(`can't go above ${MAX_DAYS} days`);
            newHours = 0;
        }
        else if(newHours > MAX_HOURS){
            setIsError(true);
            setMessage(rangeStr);
            newHours = MAX_HOURS;
        }
        else if(newHours < 0){
            setIsError(true);
            setMessage(rangeStr);
            newHours = 0;
        }
        else{
            setIsError(false);
        }

        return newHours;
    }


    function handleChangeMinutes(e: React.ChangeEvent<HTMLInputElement>){
        let newMinutesStr = e.target.value;
        let newMinutes = parseInt(newMinutesStr);
        newMinutes = validateMinutes(newMinutes);

        setTimeRemaining((prev) => {
            return {
                ...prev,
                minutes: newMinutes
            }
        });
    }


    function validateMinutes(newMinutes : number){
        const rangeStr = `minutes can be 0 - ${MAX_MINUTES}`;
        if(timeRemaining.days === MAX_DAYS && newMinutes !== 0){
            setIsError(true);
            setMessage(`can't go above ${MAX_DAYS} days`);
            newMinutes = 0;
        }
        else if(newMinutes > MAX_MINUTES){
            setIsError(true);
            setMessage(rangeStr);
            newMinutes = MAX_MINUTES;
        }
        else if(newMinutes < 0){
            setIsError(true);
            setMessage(rangeStr);
            newMinutes = 0;
        }
        else{
            setIsError(false);
        }
        return newMinutes;
    }

    
    return { 
        isError, 
        message, 
        handleChangeDays, 
        handleChangeHours, 
        handleChangeMinutes 
    }
}
