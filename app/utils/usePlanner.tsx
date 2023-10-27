/*
  Hook to manage the main planner function
*/
import { useState, useEffect } from "react";

import { defaultActionsList, defaultGameState } from './defaults';
import calcPlanData from './calcPlanData';
import { calcTimeGroups } from './calcTimeGroups';
import { T_TimeGroup, T_OfflinePeriod, T_GameState, T_Action, T_ProductionSettingsNow } from './types';


type T_InitData = {
  gameState : T_GameState,
  actions : T_Action[],
  offlinePeriods : T_OfflinePeriod[],
  prodSettingsNow : null | T_ProductionSettingsNow,
}


export default function usePlanner(){

  const defaultInitData : T_InitData = {
    gameState: defaultGameState,
    offlinePeriods: [],
    actions: defaultActionsList(),
    prodSettingsNow: null
  }

  const [gameState, setGameState] = useState<T_GameState>(defaultInitData.gameState);
  const [offlinePeriods, setOfflinePeriods] = useState<T_OfflinePeriod[]>(defaultInitData.offlinePeriods);
  const [actions, setActions] = useState<T_Action[]>(defaultInitData.actions);
  const [prodSettingsNow, setProdSettingsNow] = useState<T_ProductionSettingsNow | null>(defaultInitData.prodSettingsNow);

  const planData = calcPlanData({ gameState, actions, offlinePeriods, prodSettingsNow });
  const [purchaseData, setPurchaseData] = useState(planData?.purchaseData);
  const [switchData, setSwitchData] = useState(planData?.switchData);
  const [prodSettingsBeforeNow, setProdSettingsBeforeNow] = useState(planData?.productionSettingsBeforeNow);
  const [timeData, setTimeData] = useState(planData?.timeData);

  const [loadedFromAutosave, setLoadedFromAutosave] = useState<boolean | null>(null);

  const {
    autosave,
    deleteAutosave,
    autoload
  } = autosaveKit();

  useEffect(() => {
    const autoloaded = autoload();
    if(autoloaded !== null){
      setGameState(autoloaded.gameState);
      setOfflinePeriods(autoloaded.offlinePeriods);
      setActions(autoloaded.actions);
      setProdSettingsNow(autoloaded.prodSettingsNow);
      setLoadedFromAutosave(true);
    }
    else {
      setLoadedFromAutosave(false);
    }
  }, [])


  useEffect(() => {
    const updatedPlan = calcPlanData({ gameState, actions, offlinePeriods, prodSettingsNow });
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


  function updateGameState(data : T_GameState){
    setGameState(data);
    autosave({
      gameState: data,
      offlinePeriods,
      actions,
      prodSettingsNow
    });
  }


  function updateOfflinePeriods(data : T_OfflinePeriod[]){
    setOfflinePeriods(data);
    autosave({
      gameState,
      offlinePeriods: data,
      actions,
      prodSettingsNow
    });
  }


  function updateActions(data : T_Action[]){
    setActions(data);
    autosave({
      gameState,
      offlinePeriods,
      actions: data,
      prodSettingsNow
    });
  }


  function updateProdSettingsNow(data : T_ProductionSettingsNow | null){
    setProdSettingsNow(data);
    autosave({
      gameState,
      offlinePeriods,
      actions,
      prodSettingsNow: data
    });
  }


  function reset(){
    setGameState(defaultInitData.gameState);
    setOfflinePeriods(defaultInitData.offlinePeriods);
    setActions(defaultInitData.actions);
    setProdSettingsNow(defaultInitData.prodSettingsNow);
    deleteAutosave();
  }


  return {
    gameState, 
    setGameState: updateGameState,
    offlinePeriods, 
    setOfflinePeriods: updateOfflinePeriods,
    actions, 
    setActions: updateActions,
    prodSettingsNow,
    setProdSettingsNow: updateProdSettingsNow,
    purchaseData,
    switchData,
    timeIDGroups,
    prodSettingsBeforeNow,
    reset,
    loadedFromAutosave,
  }
}


function autosaveKit(){
  const AUTOSAVE_KEY = "autoSaveData";
 
  function autosave(data : T_InitData){
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data)); 
  }

  function autoload(){
    let JSONStr = localStorage.getItem(AUTOSAVE_KEY);
    if(JSONStr === null){
        return null;
    }

    let parsed = JSON.parse(JSONStr) as T_InitData;
    parsed.gameState.startTime = new Date(parsed.gameState.startTime);
    parsed.gameState.timestamp = new Date(parsed.gameState.startTime);

    if(parsed.offlinePeriods === undefined){
      parsed.offlinePeriods = []
    }

    return parsed;
  }

  function deleteAutosave(){
    localStorage.removeItem(AUTOSAVE_KEY);
  }

  return {
    autosave,
    deleteAutosave,
    autoload,
  }
}