'use client';
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

export default function Home() {
  
  const { gameState, setGameState, 
          offlinePeriods, setOfflinePeriods, 
          actions, setActions, 
          prodSettingsNow, setProdSettingsNow, 
          purchaseData, 
          switchData, 
          timeIDGroups,
          prodSettingsBeforeNow,
        } 
        = usePlanner();

  const { showGameState, showOfflinePeriods, displayInputToggles } = useToggledDisplay();

  const gameStateModal = useGameStateModal({gameState, setGameState});
  const offlinePeriodsModal = useOfflinePeriodsModal({offlinePeriods, setOfflinePeriods, gameState}); 
  const { save : saveModal, load: loadModal } = useSaveAndLoad({actions, setActions, offlinePeriods, setOfflinePeriods, gameState, setGameState});

  return (
    <main className={"flex justify-center bg-neutral-50 min-h-screen"}>

      <Modals modals={ {
                save: saveModal,
                load: loadModal,
                gameState: gameStateModal,
                offlinePeriods: offlinePeriodsModal
              } } 
      />

      <div className={'relative z-10 w-full max-w-5xl bg-neutral-100 shadow-xl md:grid md:[grid-template-rows:auto_auto_auto_auto] md:[grid-template-columns:auto_1fr] md:[grid-template-areas:"heading_heading""buttons_buttons""status_banner""status_."]'}>
        <MainPageHeading />
        
        <StickyBar    
          saveLoadToggles={[saveModal, loadModal]}
          viewToggles={displayInputToggles}
        />

        <DisplayUserInput
          showGameState={showGameState}
          gameState={gameState}
          openGameStateModal={ gameStateModal.openModal }

          showOfflinePeriods={showOfflinePeriods}
          offlinePeriods={offlinePeriods}
          openOfflinePeriodsModal = { offlinePeriodsModal.openModal }
          offlinePeriodIdxEdit = { offlinePeriodsModal.data.idxToEdit }
        />

        <div className={"bg-white [min-height:calc(100vh-4.5rem-1px-3rem)]"}>
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
  return  <h1 className={"[height:4.5rem] relative z-10 flex flex-col px-3 pt-1 pb-3 block bg-white md:sticky md:top-0 md:relative md:[grid-area:heading]"}>
            <span className={"text-3xl font-extrabold block leading-snug text-violet-700"}>Event&nbsp;Planner</span>
            <span className={"text-sm block leading-none"}>Idle&nbsp;Apocalypse: Lost&nbsp;in&nbsp;Time&nbsp;</span>
          </h1>
}


function Modals({modals} : { modals : { [key : string] :  T_ModalData} }){
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
                />
                : modals.gameState.isVisible ?
                  <StatusForm 
                    closeModal={ modals.gameState.closeModal } 
                    setGameState={ modals.gameState.action } 
                    gameState={ modals.gameState.data.gameState } 
                  />
                  : modals.offlinePeriods.isVisible ?
                    <OfflineForm 
                        closeForm={ modals.offlinePeriods.closeModal } 
                        idxToEdit = { modals.offlinePeriods.data.idxToEdit }
                        pos={ modals.offlinePeriods.data.pos }
                        offlinePeriod={ modals.offlinePeriods.data.offlinePeriod } 
                        offlinePeriods = { modals.offlinePeriods.data.offlinePeriods }
                        setOfflinePeriods = { modals.offlinePeriods.action }
                        gameState={modals.offlinePeriods.data.gameState} 
                      />
                    : null
            }
          </>

}





