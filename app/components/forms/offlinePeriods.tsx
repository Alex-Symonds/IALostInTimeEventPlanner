import {useState, useId, ChangeEvent, SyntheticEvent } from 'react';

import { deepCopy } from '../../utils/consts';
import { defaultOfflinePeriodStart, defaultOfflinePeriodEnd } from '../../utils/defaults';
import { printOfflineTime } from '../../utils/dateAndTimeHelpers';
import { convertOfflineTimeToTimeID } from '../../utils/offlinePeriodHelpers';
import { T_OfflinePeriod, T_GameState, T_TimeOfflinePeriod } from '../../utils/types';

import Modal, { ModalHeading, ModalLegend, ModalFieldsWrapper } from '../subcomponents/modal';
import { SelectWithSRLabel, SelectHours, SelectMinutes } from './subcomponents/select';
import { Button } from './subcomponents/buttons';
import FieldsetWrapper from './subcomponents/fieldsetWrapper';
import { validDatesKit } from './utils/timeOptions';
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
        selectedDateAsIndex,
        validDates,
        convertValidDatesToOptions,
    } = validDatesKit({ gameState });


    function handleDateChange(e : ChangeEvent<HTMLSelectElement>){
        const idx = selectedDateAsIndex(e);
        if(idx === -1){
            // TODO: ERROR HANDLING
            return;
        }
        handleSingleKeyChange(roleKey, 'dateOffset', idx);
    }


    return (
        <FieldsetWrapper>
            <legend className={"font-semibold ml-2 mb-1 px-1"}>{legend}</legend>
            <div className={"flex flex-nowrap text-sm items-center"}>
                <SelectWithSRLabel
                    id={ID_D}
                    selectExtraCSS={undefined}
                    handleChange={handleDateChange}
                    initValue={validDates[dhm.dateOffset].date.toString()}
                    options={convertValidDatesToOptions(validDates)} 
                    visualLabel={""}
                    srLabel={"date"}
                    extraCSS={"pl-2 pr-1"}
                />
                <SelectHours 
                    id={ID_H}
                    handleChange={(e : ChangeEvent<HTMLSelectElement>) => handleSingleKeyChange(roleKey, 'hours', parseInt(e.target.value))}
                    initValue={dhm.hours.toString()}
                />
                <SelectMinutes
                    id={ID_M}
                    handleChange={(e : ChangeEvent<HTMLSelectElement>) => handleSingleKeyChange(roleKey, 'minutes', parseInt(e.target.value))}
                    initValue={dhm.minutes.toString()}
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

        let startTimeID = convertOfflineTimeToTimeID(newDataDeepCopy.start, gameState.startTime);
        let endTimeID = convertOfflineTimeToTimeID(newDataDeepCopy.end, gameState.startTime);

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


function generateKey(pre : string | number){
    return `${ pre }_${ new Date().getTime() }`;
}