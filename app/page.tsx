'use client';
import {useState, useEffect} from 'react';

import { defaultActionsList, defaultLevels, defaultStockpiles } from './utils/defaults';
import { MAX_TIME, SAVE_FILE_PREFIX, deepCopy } from './utils/consts';
import getPlanData from './utils/getPlanData';
import { groupByTimeId } from './utils/groupByTimeId';
import { T_TimeGroup, T_OfflinePeriod, T_GameState, T_Action, T_InterruptProductionSettings, T_SwitchData, T_PremiumInfo, T_ViewToggle, T_PurchaseData } from './utils/types';

import Planner from './components/planner';
import ModalSave from './components/inputSave';
import ModalLoad from './components/inputLoad';
import StatusForm from './components/inputGameState';
import OfflineForm from './components/inputOfflinePeriods';
import StickyBar from './components/stickyBar';


export default function Home() {
  
  const [gameState, setGameState] = useState<T_GameState>(defaultGameState());
  const [offlinePeriods, setOfflinePeriods] = useState<T_OfflinePeriod[]>([]);
  const [actions, setActions] = useState<T_Action[]>(defaultActionsList());
  const [prodSettingsAtTop, setProdSettingsAtTop] = useState<T_InterruptProductionSettings | null>(null);
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showGameStateModal, setShowGameStateModal] = useState<boolean>(false);
  const [showOfflinePeriodsModal, setShowOfflinePeriodsModal] = useState<boolean>(false);
  const [offlinePeriodIdxEdit, setOfflinePeriodIdxEdit] = useState<number | null>(null);

  const [purchaseData, setPurchaseData] = useState<T_PurchaseData[] | undefined>(getPlanData({ gameState, actions, offlinePeriods, prodSettingsAtTop })?.purchaseData);
  const [switchData, setSwitchData] = useState<T_SwitchData | undefined>(getPlanData({ gameState, actions, offlinePeriods, prodSettingsAtTop })?.switchData);

  function loadInputs(keyName : string){
    let loadedJSONStr = localStorage.getItem(SAVE_FILE_PREFIX + keyName);

    if(loadedJSONStr === null){
      // TODO: error handling: can't find value
      console.log(`${keyName} not found :(`)
      return;
    }

    let inputs = JSON.parse(loadedJSONStr);

    if('actions' in inputs && inputs.actions.length !== 0){
      setActions(inputs.actions);
    }

    if('offlinePeriods' in inputs && inputs.offlinePeriods.length !== 0){
      let backwardsCompatibleOfflinePeriods : T_OfflinePeriod[];
      if('date' in inputs.offlinePeriods[0].start){
        backwardsCompatibleOfflinePeriods = inputs.offlinePeriods.map((oldStyleEle : any) => {
          let newStyleStart = Object.assign(oldStyleEle.start, {['dateOffset']: oldStyleEle.start['date'] });
          delete newStyleStart['date']

          let newStyleEnd = Object.assign(oldStyleEle.end, {['dateOffset']: oldStyleEle.end['date'] });
          delete newStyleEnd['date']

          return {
            start: newStyleStart,
            end: newStyleEnd,
          }
        });
      }
      else{
        backwardsCompatibleOfflinePeriods = inputs.offlinePeriods;
      }

      setOfflinePeriods(backwardsCompatibleOfflinePeriods);
    }

    if('premiumInfo' in inputs){
      setGameState(prev => {
        return {
          ...prev,
          premiumInfo: inputs.premiumInfo
        }
      });
    }
  }

  function saveInputs(keyName : string){
    let inputs : T_LocalStorage = {
      actions: actions,
      offlinePeriods: offlinePeriods,
      premiumInfo: gameState.premiumInfo,
    }
    localStorage.setItem(keyName, JSON.stringify(inputs));
  }

  function openOfflinePeriodsModal(idx : number | null) : void {
    if(idx === null || idx < offlinePeriods.length){
        setOfflinePeriodIdxEdit(idx);
        setShowOfflinePeriodsModal(true);
    }
    // TODO: what if the idx is invalid?
}

  const saveLoadToggles : T_ViewToggle[] = [
    {displayStr: "save", toggle: () => setShowSaveModal(prev => !prev), value: showSaveModal},
    {displayStr: "load", toggle: () => setShowLoadModal(prev => !prev), value: showLoadModal},
  ]

  useEffect(() => {
    let planAndSwitchData = getPlanData({ gameState, actions, offlinePeriods, prodSettingsAtTop });
    if(planAndSwitchData === null){
      return;
    }

    setPurchaseData(planAndSwitchData.purchaseData);
    setSwitchData(planAndSwitchData.switchData);

  }, [prodSettingsAtTop, actions, gameState, offlinePeriods])

  if(purchaseData === undefined || switchData === undefined){
    return null;
  }

  const timeIdGroups : T_TimeGroup[] = groupByTimeId({purchaseData, switchData});

  return (
    <main className={"flex justify-center bg-neutral-50"}>
      <div className={"w-full max-w-5xl bg-white shadow-xl"}>
        <h1 className={"flex flex-col px-3 py-1 mb-2"}>
          <span className={"text-3xl font-extrabold block leading-snug text-violet-700"}>Event&nbsp;Planner</span>
          <span className={"text-sm block leading-none"}>Idle&nbsp;Apocalypse: Lost&nbsp;in&nbsp;Time&nbsp;</span>
        </h1>
        <StickyBar    
          saveLoadToggles={saveLoadToggles}
          gameState={gameState}
          openGameStateModal={() => setShowGameStateModal(true)}
          offlinePeriods={offlinePeriods}
          planData={purchaseData}
          actions={actions}
          timeIdGroups={timeIdGroups}
          openOfflinePeriodsModal = { openOfflinePeriodsModal }
          offlinePeriodIdxEdit = {offlinePeriodIdxEdit}
        />
        { showSaveModal ?
            <ModalSave 
              closeModal={ () => setShowSaveModal(false) } 
              saveInputs={saveInputs} 
            />
            : showLoadModal ?
              <ModalLoad
                closeModal={ () => setShowLoadModal(false) } 
                loadInputs={loadInputs} 
              />
              : showGameStateModal ?
                <StatusForm 
                  closeModal={ () => setShowGameStateModal(false) } 
                  setGameState={ setGameState } 
                  gameState={ gameState } 
                />
                : showOfflinePeriodsModal ?
                  <OfflineForm 
                      closeForm={ () => { setShowOfflinePeriodsModal(false); setOfflinePeriodIdxEdit(null) } } 
                      offlinePeriod={offlinePeriodIdxEdit === null ? null : offlinePeriods[offlinePeriodIdxEdit]} 
                      gameState={gameState} 
                      pos={offlinePeriodIdxEdit === null ? offlinePeriods.length + 1 : offlinePeriodIdxEdit + 1}
                    
                      setOfflinePeriods = {setOfflinePeriods}
                      idxToEdit = {offlinePeriodIdxEdit}
                      offlinePeriods = {offlinePeriods}
                    />
                  : null
        }

        { gameState === null ?
            null 
            :
            <Planner  gameState={gameState} 
                      actions={actions} 
                      setActions={setActions} 
                      offlinePeriods={offlinePeriods} 
                      purchaseData={purchaseData}
                      timeIdGroups={timeIdGroups}
                      prodSettingsAtTop={prodSettingsAtTop}
                      setProdSettingsAtTop={setProdSettingsAtTop}
            />
        }
      </div>
    </main>
  )
}

type T_LocalStorage = {
  actions : T_Action[],
  offlinePeriods : T_OfflinePeriod[],
  premiumInfo : T_PremiumInfo | null
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







