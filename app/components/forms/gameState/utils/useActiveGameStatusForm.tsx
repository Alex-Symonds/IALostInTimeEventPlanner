import { useState, SetStateAction } from "react";

import { deepCopy, MS_PER_MINUTE } from "@/app/utils/consts";
import { startingLevels, startingStockpiles, startingTimeRemaining, lateGameSettings, maxLevels } from '@/app/utils/defaults';
import { convertTimeIDToDHM, convertTimeRemainingToMinutes } from "@/app/utils/dateAndTimeHelpers";
import { T_GameState, T_TimeRemainingDHM, T_Stockpiles, T_Levels } from "@/app/utils/types";

import { I_InputGeneral } from '../subcomponents/pageGeneral';
import { I_InputStockpiles } from '../subcomponents/pageStockpiles';
import { I_InputLevelsOther } from '../subcomponents/pageLevelsOther';

import { I_StatusFormSharedProps } from "../gameState";

import { useAdBoost } from "./useAdBoost";
import { I_AdBoostInputEle } from "../subcomponents/fieldAdBoost";
import { calcLevelKeyValue, calcValidLevel } from "./levelSelectHelpers";


type T_OutputUseGameStatusForm = 
    Pick<I_InputGeneral, 
        "handleLevelChange" | 
        "setStateOnChange" | 
        "setTimeEntered" | 
        "setTimeRemaining" | 
        "timeEntered" | 
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

    const [timeEntered, setTimeEntered] = useState<Date>(new Date());
    const [timeRemaining, setTimeRemaining] = useState<T_TimeRemainingDHM>(gameState === null ? startingTimeRemaining : convertTimeIDToDHM(gameState.timeRemaining))
    const [allEggsLevel, setAllEggsLevel] = useState<number>(gameState === null ? 0 : gameState.premiumInfo.allEggs)
    const [stockpiles, setStockpiles] = useState<T_Stockpiles>(gameState === null ? deepCopy(startingStockpiles) : gameState.stockpiles)
    const [levels, setLevels] = useState<T_Levels>(gameState === null ? deepCopy(startingLevels) : gameState.levels)

    const {hasAdBoost, toggleAdBoost} = useAdBoost({gameState});


    function setStateOnChange(e : React.ChangeEvent<any>, setFunction : React.Dispatch<SetStateAction<any>>){
        setFunction(e.target.value);
    }

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
        const startTime : Date = calcStartTime({timeEntered, timeRemaining: timeRemainingAsNum});
    
        function calcStartTime({ timeEntered, timeRemaining }
            : Pick<T_GameState, "timeRemaining" | "timeEntered"> ) 
            : Date {
                
            let startedAt : Date;
            const TIME_REMAINING_AT_START = 3 * 24 * 60;
        
            if(timeRemaining === TIME_REMAINING_AT_START){
                startedAt = timeEntered;
            }
            else{
                let timePassed = (TIME_REMAINING_AT_START - timeRemaining) * MS_PER_MINUTE;
                startedAt = new Date(timeEntered.getTime() - timePassed);
            }
            return startedAt;
        }

        return {
            startTime,
            timeEntered,
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
        timeEntered,
        setStateOnChange,
        setTimeEntered,
        timeRemaining,
        setTimeRemaining,
        levels,
        handleLevelChange,
        controlledStockpileValue,
        updateStockpiles
    }
}

