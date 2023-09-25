import { useState, Dispatch, SetStateAction } from "react";

import { MAX_DAYS } from '../../../../utils/consts';
import { getDateDisplayStr } from '../../../../utils/dateAndTimeHelpers';
import { capitalise } from '../../../../utils/formatting';
import { T_GameState, T_TimeRemainingDHM } from "../../../../utils/types";

import Select from '../../subcomponents/select';
import { Button } from '../../subcomponents/buttons';
import { formatValueStr, getUpgradeOptions, InputNumberAsText, Label } from "../gameState"
import FieldsetWrapper from "../../subcomponents/fieldsetWrapper";


export interface I_InputGeneral extends I_TimeRemainingFieldset, I_Entered, I_AllEggs, I_AdBoost {}
export default function InputGeneral({timeRemaining, setTimeRemaining, timeEntered, setStateOnChange, setTimeEntered, gameState, handleLevelChange, hasAdBoost, toggleAdBoost } 
    : I_InputGeneral)
    : JSX.Element {

    return  <div className={"flex flex-col gap-6 mt-1"}>
                <TimeRemainingFieldset timeRemaining={timeRemaining} setTimeRemaining={setTimeRemaining} />
                <Entered timeEntered={timeEntered} setStateOnChange={setStateOnChange} setTimeEntered={setTimeEntered} />
                <AllEggs gameState={gameState} handleLevelChange={handleLevelChange} />
                <AdBoost hasAdBoost={hasAdBoost} toggleAdBoost={toggleAdBoost} />
            </div>

}


interface I_AllEggs {
    gameState : T_GameState, 
    handleLevelChange : (e : React.ChangeEvent<HTMLSelectElement>) => void,
}
function AllEggs({gameState, handleLevelChange} 
    : I_AllEggs) 
    : JSX.Element {

    return  <div className={"flex gap-2"}>
                <Label htmlFor={"id_AllEggs"}>All Eggs</Label>
                <Select 
                    selectExtraCSS={undefined} 
                    id={"id_AllEggs"} 
                    initValue={gameState === null ? undefined : formatValueStr("All", gameState.premiumInfo.allEggs)} 
                    options={getUpgradeOptions({ name: "All", max: 5 })} handleChange={handleLevelChange} 
                    />
            </div>
}


interface I_AdBoost {
    hasAdBoost : boolean, 
    toggleAdBoost : () => void,
}
function AdBoost({hasAdBoost, toggleAdBoost}
    : I_AdBoost)
    : JSX.Element {

    return  <div className={"flex gap-2"}>
                <Label htmlFor={"id_adBoost"}>Ad Boost</Label>
                <input type="checkbox" id="id_adBoost" checked={hasAdBoost} onChange={ toggleAdBoost } />
            </div>
}


interface I_Entered {
    timeEntered : Date | null, 
    setStateOnChange : (e : React.ChangeEvent<any>, setFunction : Dispatch<SetStateAction<any>>) => void, 
    setTimeEntered : Dispatch<SetStateAction<Date>>
}
function Entered({timeEntered, setStateOnChange, setTimeEntered} 
    : I_Entered)
    : JSX.Element {

    timeEntered = timeEntered ?? new Date();

    return(
        <div className={"flex items-center gap-2"}>
            <Label htmlFor={"id_timeEntered"}>
                Entered
            </Label>
            <Button 
                htmlType={"button"}
                onClick={() => { setTimeEntered(new Date()) }}
                colours={"secondary"}
                size={"inline"}
                extraCSS={"w-min"}
                >
                now
            </Button>
            <p 
                suppressHydrationWarning={true} 
                className={"ml-2"}
                >
                { getDateDisplayStr(timeEntered) }
            </p>
            <input 
                hidden 
                type="datetime-local" 
                id={"id_timeEntered"} 
                value={timeEntered == null ? "" : `${timeEntered}`} 
                onChange={(e) => setStateOnChange(e, setTimeEntered)}
            />
        </div>
    )
}


interface I_TimeRemainingFieldset {
    timeRemaining: T_TimeRemainingDHM,
    setTimeRemaining: React.Dispatch<React.SetStateAction<T_TimeRemainingDHM>>
}
function TimeRemainingFieldset({timeRemaining, setTimeRemaining} 
    : I_TimeRemainingFieldset)
    : JSX.Element {

    const { isError, message, handleChangeDays, handleChangeHours, handleChangeMinutes } = useTimeRemainingFieldset({timeRemaining, setTimeRemaining});

    return (
        <FieldsetWrapper>
            <Label extraCSS={"font-semibold w-min px-1"} htmlFor={''} tagName={'legend'}>Time&nbsp;Remaining</Label>
            <div className={'w-full relative flex flex-col items-center gap-1 px-3 ml-1'}>
                <div className={'w-full flex gap-2 mt-1  py-1 px-2 rounded-md'}>
                    <TimeRemainingUnit unitName={"days"} value={timeRemaining == null ? 0 : timeRemaining.days} handleChange={handleChangeDays} />
                    <TimeRemainingUnit unitName={"hours"} value={timeRemaining == null ? 0 : timeRemaining.hours} handleChange={handleChangeHours} />
                    <TimeRemainingUnit unitName={"minutes"} value={timeRemaining == null ? 0 : timeRemaining.minutes} handleChange={handleChangeMinutes} />
                </div>
                { isError ?
                    <div className={"text-xs border-1 text-neutral-700 px-1 py-1 w-56"}>{capitalise(message)}</div>
                    : null
                }
            </div>
        </FieldsetWrapper>
    )
}


interface I_TimeRemainingUnitProps {
    unitName : string, 
    value : number, 
    handleChange : (e : React.ChangeEvent<HTMLInputElement>) => void
}
function TimeRemainingUnit({unitName, value, handleChange} 
    : I_TimeRemainingUnitProps)
    : JSX.Element {

    if(isNaN(value)){
        value = 0;
    }

    const idStr = `id_${unitName}`;
    return (
        <div className={'flex items-center justify-items-stretch w-1/3'}>
            <InputNumberAsText cssStr={"w-12 pl-1 bg-white"} idStr={idStr} value={value} handleChange={handleChange} />
            <label className={"pl-1 pr-2 w-4"} htmlFor={idStr}>{unitName.charAt(0)}</label>
        </div>
    )
}


type T_OutputUseTimeRemainingFieldset = {
    isError : boolean, 
    message : string, 
    handleChangeDays : (e : React.ChangeEvent<HTMLInputElement>) => void, 
    handleChangeHours : (e : React.ChangeEvent<HTMLInputElement>) => void, 
    handleChangeMinutes : (e : React.ChangeEvent<HTMLInputElement>) => void, 
}
function useTimeRemainingFieldset({timeRemaining, setTimeRemaining}
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

    return { isError, message, handleChangeDays, handleChangeHours, handleChangeMinutes }
}
