import {useState, useId, ChangeEvent, SyntheticEvent } from 'react';

import { deepCopy } from '../utils/consts';
import { defaultOfflinePeriodStart, defaultOfflinePeriodEnd } from '../utils/defaults';
import { printOfflineTime, calcStartTime, getMonthName } from '../utils/dateAndTimeHelpers';
import { convertOfflineTimeToTimeID } from '../utils/offlinePeriodHelpers';
import { T_OfflinePeriod, T_GameState, T_TimeOfflinePeriod } from '../utils/types';
import { generateKey } from '../utils/uniqueKeys';

import Modal, { ModalHeading, ModalLegend, ModalFieldsWrapper } from './modal';
import Select, { I_SelectProps, T_OptionData } from './select';
import { Button } from './buttons';
import FieldsetWrapper from './fieldsetWrapper';

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
    gameState : T_GameState,
    pos : number,

    setOfflinePeriods : React.Dispatch<React.SetStateAction<T_OfflinePeriod[]>>,
    idxToEdit : number | null,
    offlinePeriods : T_OfflinePeriod[] | null
}

type T_AriaError = {
    isInvalid : boolean,
    errorMessageId : string,
}

type T_OfflinePeriodForm = 
    T_OfflinePeriod & {
        id: string,
        isValid : boolean
}
export default function OfflineForm({closeForm, offlinePeriod, gameState, pos, setOfflinePeriods, idxToEdit, offlinePeriods} 
    : I_OfflineForm)
    : JSX.Element {


    let isNewOfflinePeriod = offlinePeriod === null;
    let initValue = offlinePeriod === null ?
                    defaultOfflinePeriodForm() 
                    : {
                        ...offlinePeriod, 
                        isValid: true, 
                        id: generateKey(`${printOfflineTime(offlinePeriod.start)}_${printOfflineTime(offlinePeriod.end)}`)
                    };
    const {
            formOfflinePeriod,
            handleSubmit,
            handleSingleKeyChange,
            removeOfflinePeriod,
            showError,
        } = useOfflineForm({initValue, idxToEdit, setOfflinePeriods, closeForm, offlinePeriods, gameState});
    
    const id = useId();
    const ariaError : T_AriaError = {
        isInvalid: showError,
        errorMessageId: "offlinePeriodsError"
    }
    return  <Modal closeModal={closeForm}>
                <ModalHeading>
                    { isNewOfflinePeriod ? `New Offline Period` : `Offline Period ${pos}` }
                </ModalHeading>
                <form onSubmit={ (e) => handleSubmit(e) } >
                    <ModalFieldsWrapper>
                        <fieldset
                            aria-invalid={ariaError.isInvalid}
                            aria-errormessage={ariaError.errorMessageId}
                            >
                            <ModalLegend>
                                Set time range
                            </ModalLegend>
                            <div className={"flex flex-col gap-5 items-center"}>
                                <OfflineTimeInput 
                                    legend={"from"} 
                                    idStr={id} 
                                    roleKey={"start"} 
                                    dhm={formOfflinePeriod.start} 
                                    handleSingleKeyChange={handleSingleKeyChange} 
                                    gameState={gameState} 
                                    showError={showError && !formOfflinePeriod.isValid} 
                                />
                                <OfflineTimeInput 
                                    legend={"to"} 
                                    idStr={id} 
                                    roleKey={"end"} 
                                    dhm={formOfflinePeriod.end} 
                                    handleSingleKeyChange={handleSingleKeyChange} 
                                    gameState={gameState} 
                                    showError={showError && !formOfflinePeriod.isValid} 
                                />
                            
                                {showError && !formOfflinePeriod.isValid ?
                                    <ErrorMessage idStr={ariaError.errorMessageId} />
                                    : null
                                }
                            </div>
                        </fieldset>
                    </ModalFieldsWrapper>
                    <div className={"flex justify-between"}>
                            <Button 
                                size={'twin'} 
                                colours={'primary'}
                                disabled={showError && !formOfflinePeriod.isValid}
                                extraCSS={isNewOfflinePeriod ? "border-2" : undefined}
                                >
                                {  isNewOfflinePeriod ? "add" : "update" }
                            </Button>
                            { isNewOfflinePeriod ?
                                null :
                                <Button 
                                    size={'twin'}
                                    colours={'warning'}
                                    htmlType={'button'}
                                    onClick={() => removeOfflinePeriod()}
                                    >
                                    delete
                                </Button>
                            }
                        </div>
                </form>
            </Modal>
}


function ErrorMessage({idStr} 
    : { idStr : string })
    : JSX.Element {

    return  <p 
                id={idStr}
                className={"text-sm border-l-4 border-red-500 bg-red-200 bg-opacity-30 text-black px-3 py-2"}
                aria-live={"polite"}
                >
                Invalid input: offline period ends before it begins
            </p>
}


interface I_OfflineFormProps extends Pick<I_OfflineForm, "gameState">{
    showError : boolean,
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

    const {
        handleDateChange,
        validDates,
        convertValidDatesToOptions,
        calcOptionsForNumberRange,
    } = offlineTimesInputKit({ handleSingleKeyChange, roleKey, gameState });

    return (
        <FieldsetWrapper>
            <legend className={"font-semibold ml-2 mb-1 px-1"}>{legend}</legend>
            <div className={"flex flex-nowrap text-sm items-center"}>
                <SelectOffline
                    id={ID_D}
                    selectExtraCSS={undefined}
                    handleChange={handleDateChange}
                    initValue={validDates[dhm.dateOffset].date.toString()}
                    options={convertValidDatesToOptions(validDates)} 
                    visualLabel={""}
                    srLabel={"date"}
                    extraCSS={"pl-2 pr-1"}
                />
                <SelectOffline
                    id={ID_H}
                    selectExtraCSS={undefined}
                    handleChange={(e : ChangeEvent<HTMLSelectElement>) => handleSingleKeyChange(roleKey, 'hours', parseInt(e.target.value))}
                    initValue={dhm.hours.toString()}
                    options={calcOptionsForNumberRange(0, 23)} 
                    visualLabel={""}
                    srLabel={"time: hour"}
                    extraCSS={"px-2"}
                />
                <SelectOffline
                    id={ID_M}
                    selectExtraCSS={undefined}
                    handleChange={(e : ChangeEvent<HTMLSelectElement>) => handleSingleKeyChange(roleKey, 'minutes', parseInt(e.target.value))}
                    initValue={dhm.minutes.toString()}
                    options={calcOptionsForNumberRange(0, 59)} 
                    visualLabel={":"}
                    srLabel={"time: minute"}
                    extraCSS={"px-1"}
                />
                {
                    showError ?
                        <span className={"ml-3 text-red-500 font-bold text-xl"}>X</span>
                        : null
                }
            </div>
        </FieldsetWrapper>
    )
}


interface I_SelectOffline extends I_SelectProps {
    visualLabel: string,
    srLabel : string,
    extraCSS? : string,
}
function SelectOffline({id, selectExtraCSS, options, handleChange, initValue, visualLabel, srLabel, extraCSS}
    : I_SelectOffline)
    : JSX.Element {

    return <div>
                <label htmlFor={id} className={"text-sm" + " " + extraCSS}>
                    <span className={"sr-only"}>{srLabel}</span>
                    <span aria-hidden={true}>{visualLabel}</span>
                </label>
                <Select id={id} selectExtraCSS={selectExtraCSS} options={options} handleChange={handleChange} initValue={initValue} />
            </div>
}


type T_OutputUseOfflineForm = {
    formOfflinePeriod : T_OfflinePeriodForm,
    handleSubmit : (e : SyntheticEvent) => void,
    removeOfflinePeriod : () => void,
    showError : boolean,
    handleSingleKeyChange : (roleKey : string, unitKey : string, newValue : number) => void,
}

function useOfflineForm({initValue, idxToEdit, setOfflinePeriods, closeForm, offlinePeriods, gameState}
    : { initValue : T_OfflinePeriodForm } & Pick<I_OfflineForm, "closeForm" | "idxToEdit" | "setOfflinePeriods" | "offlinePeriods" | "gameState">)
    : T_OutputUseOfflineForm {

    const [formOfflinePeriod, setFormOfflinePeriod] = useState<T_OfflinePeriodForm>(initValue);
    const [showError, setShowError] = useState(false);

    function updateOfflinePeriod(newOfflinePeriod : T_OfflinePeriod) : void {
        if(idxToEdit === null){
            // add a new offline period at the end
            setOfflinePeriods((prev : T_OfflinePeriod[]) => [
                ...prev,
                newOfflinePeriod
            ]);
            closeForm();
        }
        else{
            // update existing offline period
            let deepCopyData : T_OfflinePeriod[] = deepCopy(offlinePeriods);
            deepCopyData[idxToEdit] = newOfflinePeriod;
            setOfflinePeriods(deepCopyData);
            closeForm();
        }
    }

    function removeOfflinePeriod() : void {
        if(idxToEdit === null){
            closeForm();
            return;
        }
        let deepCopyData : T_OfflinePeriod[] = deepCopy(offlinePeriods);
        setOfflinePeriods(deepCopyData.slice(0, idxToEdit).concat(deepCopyData.slice(idxToEdit + 1)));
        closeForm();
    }

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

    function handleSingleKeyChange(roleKey : string, unitKey : string, newValue : number){
        let newDataDeepCopy = deepCopy(formOfflinePeriod);
        newDataDeepCopy[roleKey][unitKey] = newValue;

        const startedAt = calcStartTime(gameState);
        let startTimeID = convertOfflineTimeToTimeID(newDataDeepCopy.start, startedAt);
        let endTimeID = convertOfflineTimeToTimeID(newDataDeepCopy.end, startedAt);

        newDataDeepCopy.isValid = startTimeID < endTimeID;
        handleChange(newDataDeepCopy);
    }

    return {
        formOfflinePeriod,
        handleSubmit,
        removeOfflinePeriod,
        showError,
        handleSingleKeyChange
    }
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


type T_DateAndMonth = { date: number, month: number };
type T_OutputOfflineTimesInputKit = {
    handleDateChange : (e : ChangeEvent<HTMLSelectElement>) => void,
    validDates : T_DateAndMonth[],
    convertValidDatesToOptions : (dateObj : T_DateAndMonth[]) => T_OptionData[],
    calcOptionsForNumberRange : (firstNum : number, lastNum : number) => T_OptionData[],
}

function offlineTimesInputKit({ handleSingleKeyChange, roleKey, gameState }
    : Pick<I_OfflineFormProps, "handleSingleKeyChange" | "roleKey" | "gameState">)
    : T_OutputOfflineTimesInputKit {
    const validDates = calcValidDates();

    function handleDateChange(e : ChangeEvent<HTMLSelectElement>){
        let idx = validDates.findIndex(ele => ele.date === parseInt(e.target.value));
        if(idx === -1){
            // TODO: error handling for if the date isn't in the list of dates, somehow
            return;
        }
        handleSingleKeyChange(roleKey, 'dateOffset', idx);
    }

    function calcValidDates(){
        let startTime = calcStartTime(gameState);
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

    return {
        handleDateChange,
        validDates,
        convertValidDatesToOptions,
        calcOptionsForNumberRange,
    }
}