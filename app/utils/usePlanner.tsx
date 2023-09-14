/*
  Hook to manage the main planner function
*/
import { useState, useEffect } from "react";

import { MAX_TIME, deepCopy } from './consts';
import { defaultActionsList, defaultLevels, defaultStockpiles } from './defaults';
import getPlanData from './getPlanData';
import { groupByTimeId } from './groupByTimeId';
import { T_TimeGroup, T_OfflinePeriod, T_GameState, T_Action, T_ProductionSettingsNow } from './types';


export default function usePlanner(){
    const [gameState, setGameState] = useState<T_GameState>(defaultGameState());
    const [offlinePeriods, setOfflinePeriods] = useState<T_OfflinePeriod[]>([]);
    const [actions, setActions] = useState<T_Action[]>(defaultActionsList());
    const [prodSettingsNow, setProdSettingsNow] = useState<T_ProductionSettingsNow | null>(null);

    const planData = getPlanData({ gameState, actions, offlinePeriods, prodSettingsNow });
    const [purchaseData, setPurchaseData] = useState(planData?.purchaseData);
    const [switchData, setSwitchData] = useState(planData?.switchData);
    
    useEffect(() => {
        let updatedPlan = getPlanData({ gameState, actions, offlinePeriods, prodSettingsNow });
        if(updatedPlan === null){
          return;
        }
        setPurchaseData(updatedPlan.purchaseData);
        setSwitchData(updatedPlan.switchData);

      }, [prodSettingsNow, actions, gameState, offlinePeriods]);
    
    const timeIdGroups : T_TimeGroup[] | null = purchaseData === undefined || switchData === undefined ?
        null 
        : groupByTimeId({purchaseData, switchData});

    return {
        gameState, 
        setGameState,
        offlinePeriods, 
        setOfflinePeriods,
        actions, 
        setActions,
        prodSettingsNow,
        setProdSettingsNow,
        purchaseData,
        switchData,
        timeIdGroups
    }
}

function defaultGameState() : T_GameState {
    return {
      timeEntered : new Date(),
      timeRemaining : MAX_TIME,
      premiumInfo :  {
        adBoost : false,
        allEggs : 0,
      },
      stockpiles : deepCopy(defaultStockpiles),
      levels : deepCopy(defaultLevels),
    }
  }