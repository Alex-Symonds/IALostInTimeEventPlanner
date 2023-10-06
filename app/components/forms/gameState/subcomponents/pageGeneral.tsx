import { Dispatch, SetStateAction } from "react";

import { calcDateDisplayStr } from '../../../../utils/dateAndTimeHelpers';
import { capitalise } from '../../../../utils/formatting';

import { Button } from '../../subcomponents/buttons';
import FieldsetWrapper from "../../subcomponents/fieldsetWrapper";

import { useTimeRemainingFieldset, I_TimeRemainingFieldset } from "../utils/useTimeRemainingFieldset";

import { InputNumberAsText, Label } from "../gameState"

import AllEggs, { I_AllEggs } from "./fieldAllEggs";
import AdBoost, { I_AdBoostInputEle } from "./fieldAdBoost";


export interface I_InputGeneral extends I_TimeRemainingFieldset, I_Entered, I_AllEggs, I_AdBoostInputEle {}
export default function InputGeneral({timeRemaining, setTimeRemaining, timeEntered, setStateOnChange, setTimeEntered, gameState, handleLevelChange, hasAdBoost, toggleAdBoost } 
    : I_InputGeneral)
    : JSX.Element {

    return  <div className={"flex flex-col gap-6 mt-2"}>
                <TimeRemainingFieldset timeRemaining={timeRemaining} setTimeRemaining={setTimeRemaining} />
                <Entered timeEntered={timeEntered} setStateOnChange={setStateOnChange} setTimeEntered={setTimeEntered} />
                <AllEggs gameState={gameState} handleLevelChange={handleLevelChange} />
                <AdBoost hasAdBoost={hasAdBoost} toggleAdBoost={toggleAdBoost} />
            </div>

}


interface I_Entered {
    timeEntered : Date, 
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
                { calcDateDisplayStr(timeEntered) }
            </p>
            <input 
                hidden 
                type="datetime-local" 
                id={"id_timeEntered"} 
                value={`${timeEntered}`} 
                onChange={(e) => setStateOnChange(e, setTimeEntered)}
            />
        </div>
    )
}


function TimeRemainingFieldset({timeRemaining, setTimeRemaining} 
    : I_TimeRemainingFieldset)
    : JSX.Element {

    const { 
        isError, 
        message, 
        handleChangeDays, 
        handleChangeHours, 
        handleChangeMinutes 
    } = useTimeRemainingFieldset({timeRemaining, setTimeRemaining});

    return (
        <FieldsetWrapper>
            <Label extraCSS={"font-semibold w-min px-1"} htmlFor={''} tagName={'legend'}>
                Time&nbsp;Remaining
            </Label>
            <div className={'w-full relative flex flex-col items-center gap-1 px-3 ml-1'}>
                <div className={'w-full flex gap-2 mt-1  py-1 px-2 rounded-md'}>
                    <TimeRemainingUnit 
                        unitName={"days"} 
                        value={timeRemaining == null ? 0 : timeRemaining.days} 
                        handleChange={handleChangeDays} 
                    />
                    <TimeRemainingUnit 
                        unitName={"hours"} 
                        value={timeRemaining == null ? 0 : timeRemaining.hours} 
                        handleChange={handleChangeHours} 
                    />
                    <TimeRemainingUnit 
                        unitName={"minutes"} 
                        value={timeRemaining == null ? 0 : timeRemaining.minutes} 
                        handleChange={handleChangeMinutes} 
                    />
                </div>
                { isError ?
                    <div data-testid={"timeRemainingInputErrorMessage"} className={"text-xs border-1 text-neutral-700 px-1 py-1 w-56"}>
                        {capitalise(message)}
                    </div>
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


