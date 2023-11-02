'use client';
import Image from 'next/image';
import { useState } from 'react';

import { theme } from './utils/formatting';
import { T_ModalData } from './utils/types';
import useSaveAndLoad from './utils/useSaveAndLoad';
import useOfflinePeriodsModal from './utils/useOfflinePeriodsModal';
import useGameStateModal from './utils/useGameStateModal';
import usePlanner from './utils/usePlanner';
import useToggledDisplay from './utils/useToggledDisplay';

import Planner from './components/planner/planner';
import ModalSave from './components/forms/save';
import ModalLoad from './components/forms/load';
import StatusForm from './components/forms/gameState/gameState';
import OfflineForm from './components/forms/offlinePeriods';
import StickyBar from './components/stickyBar';
import DisplayUserInput from './components/sectionDisplayUserInput';
import ErrorWithPlanner from './components/errorWithPlanner';

import logoPic from '../public/planner.svg';


export default function Home() {
  
  const { gameState, setGameState, 
          offlinePeriods, setOfflinePeriods, 
          actions, setActions, 
          prodSettingsNow, setProdSettingsNow, 
          purchaseData, 
          switchData, 
          timeIDGroups,
          prodSettingsBeforeNow,
          reset,
          loadedFromAutosave
        } 
        = usePlanner();

  const { showGameState, showOfflinePeriods, displayInputToggles } = useToggledDisplay();

  const gameStateModal = useGameStateModal({gameState, setGameState});
  const offlinePeriodsModal = useOfflinePeriodsModal({offlinePeriods, setOfflinePeriods, gameState}); 
  const { save : saveModal, load: loadModal } = useSaveAndLoad({actions, setActions, offlinePeriods, setOfflinePeriods, gameState, setGameState, reset});

  const [hasHandledInitialModal, setHasHandledInitialModal] = useState(false);
  if(!hasHandledInitialModal && loadedFromAutosave !== null){
    if(!loadedFromAutosave){
      gameStateModal.openModal();
    }
    setHasHandledInitialModal(true);
  }

  return (
    <main className={`text-black ${theme.emptyBg} text-black flex justify-center min-h-screen`}>

      <Modals modals={ {
                save: saveModal,
                load: loadModal,
                gameState: gameStateModal,
                offlinePeriods: offlinePeriodsModal
              } } 
      />

      <div className={`${theme.mainAsBg} relative z-20 w-full max-w-5xl md:pr-3 md:grid md:grid-rows-[auto_auto_auto] md:grid-cols-[auto_1fr] md:[grid-template-areas:"heading_heading""buttons_buttons""status_."]`}>
        <MainPageHeading />
        
        <StickyBar    
          saveLoadToggles={[saveModal, loadModal]}
          viewToggles={displayInputToggles}
        />

        <DisplayUserInput
          showGameState={showGameState}
          gameState={gameState}
          openGameStateModal={ gameStateModal.openModal }
          mode={ gameStateModal.data.mode.mode }

          showOfflinePeriods={showOfflinePeriods}
          offlinePeriods={offlinePeriods}
          openOfflinePeriodsModal = { offlinePeriodsModal.openModal }
          offlinePeriodIdxEdit = { offlinePeriodsModal.data.idxToEdit }
        />

        <div className={`${theme.mainAsBg} [min-height:calc(100vh-4.5rem-1px-3rem)]`}>
        { gameState === null || purchaseData === undefined || switchData === undefined || timeIDGroups === null || prodSettingsBeforeNow === undefined ?
          <ErrorWithPlanner />
          :
          <Planner  gameState={ gameState } 
                    actions={ actions } 
                    setActions={ setActions } 
                    purchaseData={ purchaseData }
                    timeIDGroups={ timeIDGroups }
                    prodSettingsNow={ prodSettingsNow }
                    setProdSettingsNow={ setProdSettingsNow }
                    prodSettingsBeforeNow={ prodSettingsBeforeNow }
          />
        }
        </div>
      </div>
    </main>
  )
}


function MainPageHeading(){
  return  <h1 className={`${theme.mainAsBg} ${theme.mainHeadingText} [height:4.5rem] relative z-10 flex gap-2 px-3 pt-1 pb-3 block md:sticky md:top-0 md:relative md:[grid-area:heading]`}>
            <Image src={logoPic} alt="" width={48} height={48} />
            <div className={"flex flex-col"}>
              <span className={"text-3xl font-extrabold block leading-snug"}>Event&nbsp;Planner</span>
              <span className={`${theme.subtleTextOnBg} text-sm block leading-none`}>Idle&nbsp;Apocalypse: Lost&nbsp;in&nbsp;Time&nbsp;</span>
            </div>
          </h1>
}


function Modals({modals} : { modals : { [key : string] :  T_ModalData} }){

  function resetAll(){
    modals.load.data.reset();
    modals.gameState.data.mode.reset();
    if('openModal' in modals.gameState){
      modals.gameState.openModal(null);
    }
  }

  return  <>
            { modals.save.isVisible ?
              <ModalSave 
                closeModal={ modals.save.closeModal } 
                saveInputs={ modals.save.action } 
                convertToKeyName = { modals.save.data.convertToKeyName }
              />
              : modals.load.isVisible ?
                <ModalLoad
                  closeModal={ modals.load.closeModal } 
                  loadInputs={ modals.load.action }
                  loadOptions={ modals.load.data.loadOptions } 
                  reset={ resetAll }
                />
                : modals.gameState.isVisible ?
                  <StatusForm 
                    closeModal={ modals.gameState.closeModal } 
                    setGameState={ modals.gameState.action } 
                    gameState={ modals.gameState.data.gameState } 
                    modeKit={ modals.gameState.data.mode }
                  />
                  : modals.offlinePeriods.isVisible ?
                    <OfflineForm 
                        closeForm={ modals.offlinePeriods.closeModal } 
                        idxToEdit = { modals.offlinePeriods.data.idxToEdit }
                        offlinePeriod={ modals.offlinePeriods.data.offlinePeriod } 
                        offlinePeriods = { modals.offlinePeriods.data.offlinePeriods }
                        setOfflinePeriods = { modals.offlinePeriods.action }
                        gameState={modals.offlinePeriods.data.gameState} 
                      />
                    : null
            }
          </>

}





