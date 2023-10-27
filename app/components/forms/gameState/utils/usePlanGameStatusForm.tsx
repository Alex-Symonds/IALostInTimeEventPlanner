import { useState, Dispatch, SetStateAction } from "react";

import { deepCopy } from "@/app/utils/utils";
import { convertTimeRemainingToMinutes } from "@/app/utils/dateAndTimeHelpers";
import { startingLevels, startingStockpiles, startingTimeRemaining } from '@/app/utils/defaults';
import { T_GameState } from "@/app/utils/types";

import { I_StatusFormSharedProps } from "../gameState";

import { calcLevelKeyValue } from "./levelSelectHelpers";
import { useAdBoost } from "./useAdBoost";
import { I_AdBoostInputEle } from "../subcomponents/fieldAdBoost";

type T_OutputUsePlanGameStatusForm = 
    I_AdBoostInputEle & {
    onSubmit : (e : React.SyntheticEvent) => void,
    setAllEggs : (e : React.ChangeEvent<HTMLSelectElement>) => void,
    startTime : Date,
    setStartTime : Dispatch<SetStateAction<Date>>,
}
export function usePlanGameStatusForm({gameState, setGameState, closeModal}
    : I_StatusFormSharedProps)
    : T_OutputUsePlanGameStatusForm {

    const [startTime, setStartTime] = useState<Date>(deepCopy(gameState.startTime));
    const [allEggsLevel, setAllEggsLevel] = useState<number>(gameState.premiumInfo.allEggs);

    const {hasAdBoost, toggleAdBoost} = useAdBoost({gameState});

    function setAllEggs(e : React.ChangeEvent<HTMLSelectElement>){
        const { value } = calcLevelKeyValue(e);
        setAllEggsLevel(value);
    }
    
    function onSubmit(e : React.SyntheticEvent){
        e.preventDefault();
        let newGameState = convertFormInputsToGameState();
        setGameState(newGameState);
        closeModal();
    }

    function convertFormInputsToGameState()
        : T_GameState {
    
        const timeRemaining : number = convertTimeRemainingToMinutes(startingTimeRemaining);
        return {
            startTime,
            timestamp : new Date(),
            timeRemaining,
            premiumInfo: {
                adBoost: hasAdBoost,
                allEggs: allEggsLevel,
            },
            stockpiles : startingStockpiles,
            levels : startingLevels,
        }
    }
    
    
    return {
        onSubmit,
        setAllEggs,
        hasAdBoost,
        toggleAdBoost,
        startTime,
        setStartTime,
    }
}

