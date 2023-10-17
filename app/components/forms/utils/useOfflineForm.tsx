import { useState, useEffect, SyntheticEvent, MutableRefObject } from "react";

import { MAX_TIME, deepCopy } from "@/app/utils/consts";
import { defaultOfflinePeriodStart, defaultOfflinePeriodEnd } from '@/app/utils/defaults';
import { printOfflineTime, fixOfflineTimeStrings, convertOfflineTimeToNumber } from "@/app/utils/offlinePeriodHelpers";
import { T_OfflinePeriod, T_TimeOfflinePeriod } from "@/app/utils/types";



type T_OfflinePeriodForm = 
    T_OfflinePeriod & {
        id: string,
        isValid : {
            start : boolean,
            end : boolean
        }
}

export interface I_UseOfflineForm {
    closeForm : () => void,
    setOfflinePeriods : React.Dispatch<React.SetStateAction<T_OfflinePeriod[]>>,
    idxToEdit : number | null,  
    refOfflinePeriods : MutableRefObject<T_OfflinePeriod[] | null>,
    offlinePeriod: T_OfflinePeriod | null,
}

type T_OutputUseOfflineForm = {
    formOfflinePeriod : T_OfflinePeriodForm,
    handleSubmit : (e : SyntheticEvent) => void,
    removeOfflinePeriod : () => void,
    showError : boolean,
    errorMessage : string,
    handleSingleKeyChange : (roleKey : string, unitKey : string, newValue : number) => void,
}

export function useOfflineForm({offlinePeriod, idxToEdit, setOfflinePeriods, closeForm, refOfflinePeriods}
    : I_UseOfflineForm)
    : T_OutputUseOfflineForm {

    const [otherOfflinePeriods, setOtherOfflinePeriods] = useState(setupOtherOfflinePeriodTimes());
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const initValue = offlinePeriod === null ?
        defaultOfflinePeriodForm() 
        : convertOffinePeriodToOfflinePeriodForm(offlinePeriod);
    const [formOfflinePeriod, setFormOfflinePeriod] = useState<T_OfflinePeriodForm>(initValue);

    useEffect(() => {
        setOtherOfflinePeriods(setupOtherOfflinePeriodTimes());
    }, [refOfflinePeriods.current])


    function setupOtherOfflinePeriodTimes(){
        if(refOfflinePeriods.current === null){
            return [];
        }

        let result = [];

        const targetStart = offlinePeriod === null ? -1 : convertOfflineTimeToNumber(offlinePeriod.start);
        const targetEnd = offlinePeriod === null ? -1 : convertOfflineTimeToNumber(offlinePeriod.end);

        for(let i = 0; i < refOfflinePeriods.current.length; i++){
            const existingStart = convertOfflineTimeToNumber(refOfflinePeriods.current[i].start);
            const existingEnd = convertOfflineTimeToNumber(refOfflinePeriods.current[i].end);

            if(targetStart !== existingStart && targetEnd !== existingEnd){
                result.push({start: existingStart, end: existingEnd});
            }
        }

        return result;
    }


    function defaultOfflinePeriodForm()
        : T_OfflinePeriodForm {
        
        const isValid = calcIsValid(defaultOfflinePeriodStart, defaultOfflinePeriodEnd);
        return {
            start: defaultOfflinePeriodStart,
            end: defaultOfflinePeriodEnd,
            isValid: isValid === undefined ? { start: true, end: true } : isValid,
            id: generateKey(`${printOfflineTime(defaultOfflinePeriodStart)}_${printOfflineTime(defaultOfflinePeriodEnd)}`),
        }
    }


    function convertOffinePeriodToOfflinePeriodForm(op : T_OfflinePeriod)
        : T_OfflinePeriodForm {

        let safeOP = {
            start: fixOfflineTimeStrings(op.start),
            end: fixOfflineTimeStrings(op.end),
        }

        const isValid = calcIsValid(safeOP.start, safeOP.end);
        return {
            ...safeOP,
            isValid: isValid === undefined ? { start: true, end: true } : isValid, 
            id: generateKey(`${printOfflineTime(op.start)}_${printOfflineTime(op.end)}`)
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
            let deepCopyData : T_OfflinePeriod[] = deepCopy(refOfflinePeriods.current);
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
        let deepCopyData : T_OfflinePeriod[] = deepCopy(refOfflinePeriods.current);
        setOfflinePeriods(deepCopyData.slice(0, idxToEdit).concat(deepCopyData.slice(idxToEdit + 1)));
        closeForm();
    }


    function handleSingleKeyChange(roleKey : string, unitKey : string, newValue : number){
        let newDataDeepCopy = deepCopy(formOfflinePeriod);
        newDataDeepCopy[roleKey][unitKey] = newValue;
        handleChange(newDataDeepCopy);
    }


    function handleChange(newData : T_OfflinePeriodForm){
        if(showError && newData.isValid){
            setShowError(false);
        }
        setFormOfflinePeriod(newData);
    }


    function handleSubmit(e : React.SyntheticEvent){
        e.preventDefault();
        if(validateOnSubmit()){
            let newOfflinePeriod = deepCopy(formOfflinePeriod);
            delete newOfflinePeriod['id'];
            delete newOfflinePeriod['isValid'];
            updateOfflinePeriod(newOfflinePeriod);
            closeForm();
        }
    }


    function calcIsValid(startOfflineTime : T_TimeOfflinePeriod, endOfflineTime: T_TimeOfflinePeriod){
        const start = convertOfflineTimeToNumber(startOfflineTime);
        const end = convertOfflineTimeToNumber(endOfflineTime);
        const checks = runChecklist(start, end);

        for(let i = 0; i < checks.length; i++){
            if(checks[i].isValid !== undefined){
                return checks[i].isValid;
            }
        }
        return { start: true, end: true };
    }


    function validateOnSubmit(){
        const start = convertOfflineTimeToNumber(formOfflinePeriod.start);
        const end = convertOfflineTimeToNumber(formOfflinePeriod.end);
        const checks = runChecklist(start, end);

        for(let i = 0; i < checks.length; i++){
            if(checks[i].result === false){
 
                if(checks[i].message !== undefined){
                    setErrorMessage(checks[i].message as string);
                    setShowError(true);
                }

                if(checks[i].isValid !== undefined){
                    setFormOfflinePeriod(prev => { return {
                        ...prev,
                        isValid: {
                            start: checks[i].isValid?.start as boolean,
                            end: checks[i].isValid?.end as boolean
                        }
                    }})
                }
                return false;
            }
        }
        return true;
    }


    function runChecklist(start : number, end : number){
        return [
            checkIsWithinMaxQuantity(),
            checkBeginsBeforeItEnds(start, end),
            checkIsOfSufficientLength(start, end),
            checkDoesNotAlreadyExist(start, end),
            checkDoesNotCoverExistingOfflinePeriod(start, end),
            checkIsNotWithinExistingOfflinePeriod(start, end),
            checkNotTooLong(start, end)
        ]
    }


    function checkIsWithinMaxQuantity(){
        const MAX_NUM_OFFLINE_PERIODS = 150;
        if(refOfflinePeriods.current !== null && refOfflinePeriods.current.length > MAX_NUM_OFFLINE_PERIODS){
            return {
                result: false,
                message: "You have entered the maximum number of offline periods",
                isValid: { start: false, end: false }
            }
        }
        return { result: true };
    }


    function checkIsOfSufficientLength(start : number, end : number){
        if(end - start < 1){
            return {
                result: false,
                message: "Invalid input: offline period must last for at least one minute",
                isValid: { start: false, end: false }
            }
        }
        return { result: true };
    }


    function checkBeginsBeforeItEnds(start : number, end : number){
        if(start > end){
            return {
                result: false,
                message: "Invalid input: offline period ends before it begins",
                isValid: { start: false, end: false }
            }
        }
        return { result: true };
    }


    function checkDoesNotAlreadyExist(start : number, end : number){
        if(performCheckAgainstExistingOfflinePeriods((existingStart, existingEnd) => {
            return start === existingStart && end === existingEnd;
        })){
            return {
                result: false,
                message: "Invalid input: this time range already exists",
                isValid: { start: false, end: false }
            }
        }
        return { result: true };
    }


    function checkDoesNotCoverExistingOfflinePeriod(start : number, end : number){
        if(performCheckAgainstExistingOfflinePeriods((existingStart, existingEnd) => {
            return start < existingStart && end > existingEnd;
        })){
            return {
                result: false,
                message: "Invalid input: this time range is partially covered by an existing offline period",
                isValid: { start: false, end: false }
            }
        }
        return { result: true };
    }


    function checkIsNotWithinExistingOfflinePeriod(start : number, end : number){
        const startOverlaps = performCheckAgainstExistingOfflinePeriods((existingStart, existingEnd) => {
            return start >= existingStart && start <= existingEnd
        });

        const endOverlaps = performCheckAgainstExistingOfflinePeriods((existingStart, existingEnd) => {
            return end >= existingStart && end <= existingEnd
        });

        let message = startOverlaps && !endOverlaps ?
                        "Invalid input: start of offline period overlaps an existing offline period"
                    : !startOverlaps && endOverlaps ?
                        "Invalid input: end of offline period overlaps an existing offline period"
                    : startOverlaps && endOverlaps ?
                        "Invalid input: this time range is entirely covered by an existing offline period"
                        : "";

        if(startOverlaps || endOverlaps){
            return {
                result: false,
                message,
                isValid: {
                    start: !startOverlaps,
                    end: !endOverlaps
                }
            }
        }
        return { result: true };
    }

    function checkNotTooLong(start : number, end : number){
        const otherOfflineDurations = otherOfflinePeriods.map(ele => ele.end - ele.start);
        const totalOtherOfflineDuration = otherOfflineDurations.reduce((accumulator, currentValue) => accumulator += currentValue, 0);
        
        if(end - start + totalOtherOfflineDuration > MAX_TIME){
            return {
                result: false,
                message: "Invalid input: this time range would make offline periods cover the entire event",
                isValid: { start: false, end: false }
            }
        }
        return { result: true };
    }


    function performCheckAgainstExistingOfflinePeriods(checkFunction : (existingStart : number, existingEnd : number) => boolean){
        for(let i = 0; i < otherOfflinePeriods.length; i++){
            if(checkFunction(otherOfflinePeriods[i].start, otherOfflinePeriods[i].end)){
                return true;
            }
        }
        return false;
    }


    return {
        formOfflinePeriod,
        handleSubmit,
        removeOfflinePeriod,
        showError,
        errorMessage,
        handleSingleKeyChange
    }
}
