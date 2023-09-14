'use client';
import { T_ModalData } from './utils/types';
import useSaveAndLoad from './utils/useSaveAndLoad';
import useOfflinePeriodsModal from './utils/useOfflinePeriodsModal';
import useGameStateModal from './utils/useGameStateModal';

import Planner from './components/planner';
import ModalSave from './components/inputSave';
import ModalLoad from './components/inputLoad';
import StatusForm from './components/inputGameState';
import OfflineForm from './components/inputOfflinePeriods';
import StickyBar from './components/stickyBar';
import DisplayUserInput from './components/sectionDisplayUserInput';
import usePlanner from './utils/usePlanner';
import useToggledDisplay from './utils/useToggledDisplay';


export default function Home() {
  
  const { gameState, setGameState, 
          offlinePeriods, setOfflinePeriods, 
          actions, setActions, 
          prodSettingsNow, setProdSettingsNow, 
          purchaseData, 
          switchData, 
          timeIdGroups
        } 
        = usePlanner();

  const { showGameState, showOfflinePeriods, displayInputToggles } = useToggledDisplay();

  const gameStateModal = useGameStateModal({gameState, setGameState});
  const offlinePeriodsModal = useOfflinePeriodsModal({offlinePeriods, setOfflinePeriods, gameState}); 
  const { save : saveModal, load: loadModal } = useSaveAndLoad({actions, setActions, offlinePeriods, setOfflinePeriods, gameState, setGameState});

  return (
    <main className={"flex justify-center bg-neutral-50"}>

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

        { gameState === null ?
            null 
            : purchaseData === undefined || switchData === undefined || timeIdGroups === null ?
              <NoPlanner />
              :
              <Planner  gameState={ gameState } 
                        actions={ actions } 
                        setActions={ setActions } 
                        offlinePeriods={ offlinePeriods } 
                        purchaseData={ purchaseData }
                        timeIdGroups={ timeIdGroups }
                        prodSettingsNow={ prodSettingsNow }
                        setProdSettingsNow={ setProdSettingsNow }
              />
        }
      </div>
    </main>
  )
}


function MainPageHeading(){
  return  <h1 className={"flex flex-col px-3 pt-1 pb-3 block bg-white md:sticky md:top-0 md:relative md:[grid-area:heading]"}>
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


function NoPlanner(){
  return  <div>
            <h2>Error</h2>
            <p>Something went wrong with working out a plan.</p>
            <h3>Possible fixes</h3>
            <ul>
              <li>Re-enter game status</li>
              <li>Re-enter offline periods</li>
              <li>Start again by refreshing the page</li>
            </ul>
            <p>If none of these work, it&apos;s a problem on our end. Sorry! Try again later.</p>
          </div>
}












