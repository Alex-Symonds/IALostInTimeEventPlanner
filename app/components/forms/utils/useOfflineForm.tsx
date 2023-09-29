import { useState, SyntheticEvent } from "react";

import { deepCopy } from "@/app/utils/consts";
import { defaultOfflinePeriodStart, defaultOfflinePeriodEnd } from '@/app/utils/defaults';
import { printOfflineTime } from '@/app/utils/dateAndTimeHelpers';
import { convertOfflineTimeToTimeID } from "@/app/utils/offlinePeriodHelpers";
import { T_OfflinePeriodForm, T_GameState, T_OfflinePeriod } from "@/app/utils/types";



export interface I_UseOfflineForm {
    gameState : T_GameState,
    closeForm : () => void,
    offlinePeriods : T_OfflinePeriod[] | null
    setOfflinePeriods : React.Dispatch<React.SetStateAction<T_OfflinePeriod[]>>,
    idxToEdit : number | null,  
    offlinePeriod: T_OfflinePeriod | null,
}

type T_OutputUseOfflineForm = {
    formOfflinePeriod : T_OfflinePeriodForm,
    handleSubmit : (e : SyntheticEvent) => void,
    removeOfflinePeriod : () => void,
    showError : boolean,
    handleSingleKeyChange : (roleKey : string, unitKey : string, newValue : number) => void,
}

export function useOfflineForm({offlinePeriod, idxToEdit, setOfflinePeriods, closeForm, offlinePeriods, gameState}
    : I_UseOfflineForm)
    : T_OutputUseOfflineForm {

    const initValue = offlinePeriod === null ?
        defaultOfflinePeriodForm() 
        : {
            ...offlinePeriod, 
            isValid: true, 
            id: generateKey(`${printOfflineTime(offlinePeriod.start)}_${printOfflineTime(offlinePeriod.end)}`)
    };

    const [formOfflinePeriod, setFormOfflinePeriod] = useState<T_OfflinePeriodForm>(initValue);
    const [showError, setShowError] = useState(false);


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