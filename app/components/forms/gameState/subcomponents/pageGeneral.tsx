import { capitalise } from '../../../../utils/formatting';

import FieldsetWrapper from "../../subcomponents/fieldsetWrapper";

import { useTimeRemainingFieldset, I_TimeRemainingFieldset } from "../utils/useTimeRemainingFieldset";

import { InputNumberAsText, Label } from "../gameState"

import AllEggs, { I_AllEggs } from "./fieldAllEggs";
import AdBoost, { I_AdBoostInputEle } from "./fieldAdBoost";
import Select, { SelectHours, SelectMinutes } from '../../subcomponents/select';
import { ChangeEvent } from 'react';


export interface I_InputGeneral extends I_TimestampFieldset, I_TimeRemainingFieldset, I_AllEggs, I_AdBoostInputEle {}
export default function InputGeneral({timestamp, updateTimestamp, timeRemaining, updateTimeRemaining, gameState, handleLevelChange, hasAdBoost, toggleAdBoost } 
    : I_InputGeneral)
    : JSX.Element {

    return  <div className={"flex flex-col gap-6 mt-2"}>
                <TimestampFieldset timestamp={timestamp} updateTimestamp={updateTimestamp}/>
                <TimeRemainingFieldset timeRemaining={timeRemaining} updateTimeRemaining={updateTimeRemaining} />
                <AllEggs gameState={gameState} handleLevelChange={handleLevelChange} />
                <AdBoost hasAdBoost={hasAdBoost} toggleAdBoost={toggleAdBoost} />
            </div>

}


interface I_TimestampFieldset{
    timestamp : Date, 
    updateTimestamp : (e : ChangeEvent<HTMLSelectElement>, key : string) => void 
}
function TimestampFieldset({timestamp, updateTimestamp}
    : I_TimestampFieldset)
    : JSX.Element {

    const dayID = "id_timestampDay";

    return  <FieldsetWrapper>
                <Label extraCSS={"font-semibold w-min px-1"} htmlFor={''} tagName={'legend'}>
                    Status&nbsp;At
                </Label>

                <div className={"flex gap-2 w-full py-1 pl-4"}>
                    <label htmlFor={dayID} className={"sr-only"}>day</label>
                    <Select
                        id={dayID}
                        options={[
                            { valueStr:"today", displayStr:"today" },
                            { valueStr:"yesterday", displayStr:"yesterday" }
                        ]}
                        handleChange={ (e) => updateTimestamp(e, 'days') }
                        initValue={"today"}
                    />

                    <div className={"flex"}>
                        <SelectHours
                            id={"id_timestampHours"}
                            handleChange={ (e) => updateTimestamp(e, 'hours') }
                            initValue={timestamp.getHours().toString()}
                        />
                        <SelectMinutes
                            id={"id_timestampMinutes"}
                            handleChange={ (e) => updateTimestamp(e, 'minutes') }
                            initValue={timestamp.getMinutes().toString()}
                        />
                    </div>
                </div>
            </FieldsetWrapper>
}


function TimeRemainingFieldset({timeRemaining, updateTimeRemaining} 
    : I_TimeRemainingFieldset)
    : JSX.Element {

    const { 
        isError, 
        message, 
        handleChangeDays, 
        handleChangeHours, 
        handleChangeMinutes 
    } = useTimeRemainingFieldset({timeRemaining, updateTimeRemaining});

    return (
        <FieldsetWrapper>
            <Label extraCSS={"font-semibold w-min px-1"} htmlFor={''} tagName={'legend'}>
                Time&nbsp;Remaining
            </Label>
            <div className={'w-full relative flex flex-col items-center gap-1 px-2'}>
                <div className={'w-full flex gap-2 py-1 px-2 rounded-md'}>
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


