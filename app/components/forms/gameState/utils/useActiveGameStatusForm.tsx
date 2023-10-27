import { ChangeEvent, useState } from "react";

import { MS_PER_MINUTE } from "@/app/utils/consts";
import { startingLevels, startingStockpiles, startingTimeRemaining, lateGameSettings, maxLevels } from '@/app/utils/defaults';
import { convertTimeIDToDHM, convertTimeRemainingToMinutes, validateHour, validateMinute } from "@/app/utils/dateAndTimeHelpers";
import { T_GameState, T_TimeRemainingDHM, T_Stockpiles, T_Levels } from "@/app/utils/types";
import { deepCopy } from '@/app/utils/utils';

import { I_InputGeneral } from '../subcomponents/pageGeneral';
import { I_InputStockpiles } from '../subcomponents/pageStockpiles';
import { I_InputLevelsOther } from '../subcomponents/pageLevelsOther';

import { I_StatusFormSharedProps } from "../gameState";

import { useAdBoost } from "./useAdBoost";
import { I_AdBoostInputEle } from "../subcomponents/fieldAdBoost";
import { calcLevelKeyValue, calcValidLevel } from "./levelSelectHelpers";


type T_OutputUseGameStatusForm = 
    Pick<I_InputGeneral, 
        "timestamp" |
        "updateTimestamp" |
        "handleLevelChange" | 
        "updateTimeRemaining" | 
        "timeRemaining"> &
    Pick<I_InputLevelsOther, 
        "levels" | 
        "handleLevelChange"> &
    I_AdBoostInputEle &
    I_InputStockpiles & {
    onSubmit : (e : React.SyntheticEvent) => void,
}
export function useActiveGameStatusForm({gameState, setGameState, closeModal}
    : I_StatusFormSharedProps)
    : T_OutputUseGameStatusForm {

    const [timestamp, setTimestamp] = useState<Date>(new Date());
    const [timeRemaining, setTimeRemaining] = useState<T_TimeRemainingDHM>(gameState === null ? startingTimeRemaining : convertTimeIDToDHM(gameState.timeRemaining))
    const [allEggsLevel, setAllEggsLevel] = useState<number>(gameState === null ? 0 : gameState.premiumInfo.allEggs)
    const [stockpiles, setStockpiles] = useState<T_Stockpiles>(gameState === null ? deepCopy(startingStockpiles) : gameState.stockpiles)
    const [levels, setLevels] = useState<T_Levels>(gameState === null ? deepCopy(startingLevels) : gameState.levels)

    const {hasAdBoost, toggleAdBoost} = useAdBoost({gameState});

    // function setToLateGame(){
    //     setTimeEntered(new Date(new Date().getTime() - 5 * 60 * 1000));
    //     setTimeRemaining(lateGameSettings.timeRemainingDHM);
    //     setHasAdBoost(lateGameSettings.hasAdBoost);
    //     setAllEggsLevel(lateGameSettings.allEggs);
    //     setStockpiles(lateGameSettings.stockpiles);
    //     setLevels(lateGameSettings.levels);
    // }

    // function testLevelsDone(){
    //     setTimeEntered(new Date(new Date().getTime() - 5 * 60 * 1000));
    //     setTimeRemaining(lateGameSettings.timeRemainingDHM);
    //     setHasAdBoost(lateGameSettings.hasAdBoost);
    //     setAllEggsLevel(lateGameSettings.allEggs);
    //     setStockpiles(lateGameSettings.stockpiles);
    //     setLevels(maxLevels);
    // }


    function updateTimestamp(e : ChangeEvent<HTMLSelectElement>, key : string){
        if(['minutes', 'hours', 'days'].includes(key)){
            const newTimeValue = e.target.value;

            if(key === 'days'){
                setTimestamp(prev => {
                    let newDate = new Date(prev.getTime());
                    let now = new Date();
                    if(newTimeValue === 'yesterday'){
                        newDate.setDate(now.getDate() - 1);
                    }
                    else{
                        newDate.setDate(now.getDate());
                    }
                    return newDate;
                });
            }
            else if(key === 'hours'){
                const newHour = validateHour(newTimeValue);
                if(newHour !== null){
                    setTimestamp(prev => {
                        let newDate = new Date(prev.getTime());
                        newDate.setHours(newHour);
                        return newDate;
                    })
                }
            }
            else if(key === 'minutes'){
                const minutesInt = validateMinute(newTimeValue);
                if(minutesInt !== null){
                    setTimestamp(prev => {
                        let newDate = new Date(prev.getTime());
                        newDate.setMinutes(minutesInt);
                        return newDate;
                    })
                }
            }
        }
    }


    function updateTimeRemaining(newData : Partial<T_TimeRemainingDHM>){
        let hasValidData = false;
        let validData : Partial<T_TimeRemainingDHM> = {};

        if('days' in newData){
            validData.days = newData.days;
            hasValidData = true;
        }
        if('hours' in newData){
            validData.hours = newData.hours;
            hasValidData = true;
        }
        if('minutes' in newData){
            validData.minutes = newData.minutes;
            hasValidData = true;
        }

        if(hasValidData){
            setTimeRemaining(prev => { return {
                ...prev,
                ...validData
            }})
        }
    }


    function updateStockpiles(e : React.ChangeEvent<HTMLInputElement>, key : string){
        let newStockpiles : T_Stockpiles = deepCopy(stockpiles);
        newStockpiles[key as keyof T_Stockpiles] = parseInt(e.target.value);
        setStockpiles(newStockpiles);
    }

    function handleLevelChange(e : React.ChangeEvent<HTMLSelectElement>){
        const {key, value} = calcLevelKeyValue(e);
        const validValue = calcValidLevel(key, value);

        if(key === "all"){
            setAllEggsLevel(validValue);
            return;
        }

        let newLevels : T_Levels = deepCopy(levels);
        if(key in newLevels){
            newLevels[key as keyof typeof newLevels] = validValue;
        }

        setLevels(newLevels);
    }
    

    function controlledStockpileValue(key : string){
        if(!(key in stockpiles)){
            return '';
        }
        let thisValue = stockpiles[key as keyof typeof stockpiles];
        return thisValue === null ? '' : thisValue;
    }


    function onSubmit(e : React.SyntheticEvent){
        e.preventDefault();
        let newGameState = convertFormInputsToGameState();
        setGameState(newGameState);
        closeModal();
    }


    function convertFormInputsToGameState()
        : T_GameState {
    
        const timeRemainingAsNum : number = convertTimeRemainingToMinutes(timeRemaining);
        const startTime : Date = calcStartTime({timestamp: timestamp, timeRemaining: timeRemainingAsNum});
    
        function calcStartTime({ timestamp, timeRemaining }
            : Pick<T_GameState, "timeRemaining" | "timestamp"> ) 
            : Date {
                
            let startedAt : Date;
            const TIME_REMAINING_AT_START = 3 * 24 * 60;
        
            if(timeRemaining === TIME_REMAINING_AT_START){
                startedAt = timestamp;
            }
            else{
                let timePassed = (TIME_REMAINING_AT_START - timeRemaining) * MS_PER_MINUTE;
                startedAt = new Date(timestamp.getTime() - timePassed);
            }
            return startedAt;
        }

        return {
            startTime,
            timestamp,
            timeRemaining: timeRemainingAsNum,
            premiumInfo: {
                adBoost: hasAdBoost,
                allEggs: allEggsLevel,
            },
            stockpiles,
            levels,
        }
    }
    

    return {
        onSubmit,
        hasAdBoost,
        toggleAdBoost,
        timeRemaining,
        updateTimeRemaining,
        timestamp,
        updateTimestamp,
        levels,
        handleLevelChange,
        controlledStockpileValue,
        updateStockpiles
    }
}

