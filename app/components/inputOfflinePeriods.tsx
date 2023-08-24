import {useState, useId } from 'react';

import { deepCopy } from '../utils/consts';
import { defaultOfflinePeriodStart, defaultOfflinePeriodEnd } from '../utils/defaults';
import { printOfflineTime, getStartTime, getMonthName, convertOfflineTimeToTimeId } from '../utils/dateAndTimeHelpers';
import { buttonDeleteCSS, buttonPrimaryCSSColours } from '../utils/formatting';
import { T_OfflinePeriod, T_GameState, T_TimeOfflinePeriod } from '../utils/types';
import { generateKey } from '../utils/uniqueKeys';

import Modal, { ModalSubmitButton, CloseButton } from './modal';
import Select, { T_OptionData } from './select';

/*
    Note: the dates on offline period times must be stored as an offset to the 
    startTime date.

    This is to support the use case "user wishes to plan their game in advance",
    where the user spreads their planning over several days. In this case, the
    offline periods should "move with" the altering startTime and the user
    should only need to adjust them if their schedule would alter.
*/


interface I_OfflineForm {
    closeForm : () => void,
    offlinePeriod: T_OfflinePeriod | null,
    updateOfflinePeriod: (data : T_OfflinePeriod) => void,
    removeOfflinePeriod: () => void,
    gameState : T_GameState,
    pos : number
}

type T_OfflinePeriodForm = 
    T_OfflinePeriod & {
        id: string,
        isValid : boolean
}
export default function OfflineForm({closeForm, offlinePeriod, updateOfflinePeriod, removeOfflinePeriod, gameState, pos} 
    : I_OfflineForm)
    : JSX.Element {

    let initValue = offlinePeriod === null ?
                    defaultOfflinePeriodForm() 
                    : {
                        ...offlinePeriod, 
                        isValid: true, 
                        id: generateKey(`${printOfflineTime(offlinePeriod.start)}_${printOfflineTime(offlinePeriod.end)}`)
                    };

    const [formOfflinePeriod, setFormOfflinePeriod] = useState<T_OfflinePeriodForm>(initValue);
    const [showError, setShowError] = useState(false);

    function handleSubmit(e : React.SyntheticEvent){
        e.preventDefault();
        if(formOfflinePeriod.isValid){
            let newOfflinePeriod = deepCopy(formOfflinePeriod);
            delete newOfflinePeriod['id'];
            delete newOfflinePeriod['isValid'];
            updateOfflinePeriod(newOfflinePeriod);
            closeForm();
        }
        else{
            setShowError(true);
        }
    }

    function handleChange(newData : T_OfflinePeriodForm){
        if(showError && newData.isValid){
            setShowError(false);
        }
        setFormOfflinePeriod(newData);
    }

    return (
        <OfflinePeriodInput data={formOfflinePeriod} closeForm={closeForm} handleSubmit={handleSubmit} handleChange={handleChange} removeOfflinePeriod={removeOfflinePeriod} gameState={gameState} showError={showError} pos={pos} />
    )
}

function defaultOfflinePeriodForm()
    : T_OfflinePeriodForm {
        
    return {
        id: generateKey(`${printOfflineTime(defaultOfflinePeriodStart)}_${printOfflineTime(defaultOfflinePeriodEnd)}`),
        start: defaultOfflinePeriodStart,
        end: defaultOfflinePeriodEnd,
        isValid: true
    }
}

function ErrorMessage(){
    return <p>Error: offline period ends before it starts</p>
}


interface I_OfflinePeriodInput extends Pick<I_OfflineForm, "closeForm" | "removeOfflinePeriod" | "pos" | "gameState"> {
    data: T_OfflinePeriodForm, 
    handleSubmit : (e : React.SyntheticEvent) => void, 
    handleChange : (data : T_OfflinePeriodForm) => void, 
    showError : boolean
}
function OfflinePeriodInput({data, handleSubmit, handleChange, pos, gameState, showError, removeOfflinePeriod, closeForm} 
    : I_OfflinePeriodInput)
    : JSX.Element {

    function handleSingleKeyChange(roleKey : string, unitKey : string, newValue : number){
        let newDataDeepCopy = deepCopy(data);
        newDataDeepCopy[roleKey][unitKey] = newValue;

        const startedAt = getStartTime(gameState);
        let startTimeId = convertOfflineTimeToTimeId(newDataDeepCopy.start, startedAt);
        let endTimeId = convertOfflineTimeToTimeId(newDataDeepCopy.end, startedAt);

        newDataDeepCopy.isValid = startTimeId < endTimeId;
        handleChange(newDataDeepCopy);
    }

    const conditionalCss = showError && !data.isValid ?
                            " bg-red-100"
                            : ""

    const id = useId();
    const sharedButtonCSS = "w-20 text-sm rounded";

    return(
        <section className={"relative bg-neutral-100 border-2 border-neutral-200 px-2 pb-2 pt-1 rounded flex flex-col items-center gap-1 mb-2 mt-5" + " " + conditionalCss}>
            <CloseButton extraCSS={"top-1 right-1"} close={() => closeForm()} />
            <form onSubmit={ (e) => handleSubmit(e) } className={"mt-2"}>
                <fieldset className={"max-w-max"}>
                    <legend className={"font-bold mb-1"}>Offline Period #{pos}</legend>
                    <OfflineTimeInput legend={"from"} idStr={id} roleKey={"start"} dhm={data.start} handleSingleKeyChange={handleSingleKeyChange} gameState={gameState} showError={showError && !data.isValid} />
                    <OfflineTimeInput legend={"to"} idStr={id} roleKey={"end"} dhm={data.end} handleSingleKeyChange={handleSingleKeyChange} gameState={gameState} showError={showError && !data.isValid} />
                    <div className={"flex justify-between mt-5"}>
                        <button className={buttonPrimaryCSSColours + " " + sharedButtonCSS }>submit</button>
                        <button type={"button"} className={buttonDeleteCSS + " " + sharedButtonCSS + " " + "self-end"} onClick={() => removeOfflinePeriod()}>remove</button>
                    </div>
                </fieldset>
            </form>
        </section>
    )
}


interface I_OfflineFormProps extends Pick<I_OfflinePeriodInput, "gameState" | "showError" >{
    legend : string, 
    idStr : string, 
    roleKey : string, 
    dhm : T_TimeOfflinePeriod, 
    handleSingleKeyChange : (roleKey : string, unitKey : string, value : number) => void
}

function OfflineTimeInput({ legend, idStr, roleKey, dhm, handleSingleKeyChange, gameState, showError } 
    : I_OfflineFormProps)
    : JSX.Element {

    const ID_D = idStr + "-" + roleKey + "-d";
    const ID_H = idStr + "-" + roleKey + "-h";
    const ID_M = idStr + "-" + roleKey + "-m";

    const validDates = calcValidDates();

    function handleDateChange(e : React.ChangeEvent<HTMLSelectElement>){
        let idx = validDates.findIndex(ele => ele.date === parseInt(e.target.value));
        if(idx === -1){
            // TODO: error handling for if the date isn't in the list of dates, somehow
            return null;
        }
        handleSingleKeyChange(roleKey, 'date', idx);
    }

    function calcValidDates(){
        let startTime = getStartTime(gameState);
        let endTime = new Date(startTime.getTime() + 3 * 24 * 60 * 60 * 1000);

        let validDates : { date: number, month: number }[] = [];
        let loopTime = new Date(startTime.getTime());
        while(loopTime.getTime() <= endTime.getTime()){
            validDates.push({
                date: loopTime.getDate(), 
                month: loopTime.getMonth()
            });
            loopTime.setDate(loopTime.getDate() + 1);
        }

        return validDates;
    }

    function convertValidDatesToOptions(validDates 
        : { date : number, month : number }[])
        : T_OptionData[]{

        return validDates.map(ele => {
            return {
                valueStr: ele.date.toString(),
                displayStr: `${ele.date} ${getMonthName(ele.month)}`
            }
        });
    }

    function calcOptionsForNumberRange(firstNum : number, lastNum : number){
        let options : T_OptionData[] = [];
        for(let i = firstNum; i <= lastNum; i++){
            let iStr = i.toString();
            options.push({
                valueStr: iStr,
                displayStr: iStr.padStart(2, '0')
            });
        }
        return options;
    }

    return (
        <fieldset className={showError ? "" : "mt-2"}>
            <legend>{legend}</legend>
            <div className={"flex flex-nowrap"}>
            <Select
                id={ID_D}
                labelDisplay={"D"}
                labelExtraCSS={"pl-2 pr-1"}
                selectExtraCSS={undefined}
                handleChange={handleDateChange}
                initValue={validDates[dhm.dateOffset].date.toString()}
                options={convertValidDatesToOptions(validDates)} 
            />
            <Select
                id={ID_H}
                labelDisplay={"H"}
                labelExtraCSS={"pl-2 pr-1"}
                selectExtraCSS={undefined}
                handleChange={(e : React.ChangeEvent<HTMLSelectElement>) => handleSingleKeyChange(roleKey, 'hours', parseInt(e.target.value))}
                initValue={dhm.hours.toString()}
                options={calcOptionsForNumberRange(0, 23)} 
            />
            <Select
                id={ID_M}
                labelDisplay={"M"}
                labelExtraCSS={"pl-2 pr-1"}
                selectExtraCSS={undefined}
                handleChange={(e : React.ChangeEvent<HTMLSelectElement>) => handleSingleKeyChange(roleKey, 'minutes', parseInt(e.target.value))}
                initValue={dhm.minutes.toString()}
                options={calcOptionsForNumberRange(0, 59)} 
            />
            {
                showError ?
                    <span className={"ml-2 text-red-500 font-bold font-lg"}>X</span>
                    : null
            }
            </div>
        </fieldset>
    )
}