/*
  Hook to manage the main planner function
*/
import { useState, useEffect } from "react";

import { defaultActionsList, defaultGameState } from './defaults';
import calcPlanData from './calcPlanData';
import { calcTimeGroups } from './calcTimeGroups';
import { T_TimeGroup, T_OfflinePeriod, T_GameState, T_Action, T_ProductionSettingsNow } from './types';


export default function usePlanner(){
    const [gameState, setGameState] = useState<T_GameState>(defaultGameState);
    const [offlinePeriods, setOfflinePeriods] = useState<T_OfflinePeriod[]>([]);
    const [actions, setActions] = useState<T_Action[]>(defaultActionsList());
    const [prodSettingsNow, setProdSettingsNow] = useState<T_ProductionSettingsNow | null>(null);

    const planData = calcPlanData({ gameState, actions, offlinePeriods, prodSettingsNow });
    const [purchaseData, setPurchaseData] = useState(planData?.purchaseData);
    const [switchData, setSwitchData] = useState(planData?.switchData);
    const [prodSettingsBeforeNow, setProdSettingsBeforeNow] = useState(planData?.productionSettingsBeforeNow);
    const [timeData, setTimeData] = useState(planData?.timeData);

    useEffect(() => {
        let updatedPlan = calcPlanData({ gameState, actions, offlinePeriods, prodSettingsNow });
        if(updatedPlan === null){
          return;
        }
        setPurchaseData(updatedPlan.purchaseData);
        setSwitchData(updatedPlan.switchData);
        setProdSettingsBeforeNow(updatedPlan.productionSettingsBeforeNow);
        setTimeData(updatedPlan.timeData);
      }, [prodSettingsNow, actions, gameState, offlinePeriods]);
    
    const timeIDGroups : T_TimeGroup[] | null = purchaseData === undefined || switchData === undefined || timeData === undefined ?
        null 
        : calcTimeGroups({purchaseData, switchData, timeData});

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
        timeIDGroups,
        prodSettingsBeforeNow
    }
}