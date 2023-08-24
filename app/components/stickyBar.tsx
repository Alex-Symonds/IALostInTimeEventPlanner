import { useState } from 'react';

import { T_ViewToggle, T_Action, T_TimeGroup, T_GameState, T_OfflinePeriod, T_PurchaseData } from '../utils/types';
import { buttonPrimaryCSSColours, buttonPrimaryCSS_on, buttonSecondaryCSSColours } from '../utils/formatting';

import SectionGameState from './sectionGameState';
import SectionOfflinePeriods from './sectionOfflinePeriods';
import ResultAtTop from './resultAtTop';


interface I_StickyBar {
    saveLoadToggles : T_ViewToggle[],
    gameState : T_GameState,
    openGameStateModal : () => void,
    offlinePeriods : T_OfflinePeriod[],
    setOfflinePeriods : React.Dispatch<React.SetStateAction<T_OfflinePeriod[]>>,
    planData : T_PurchaseData[],
    actions : T_Action[],
    timeIdGroups : T_TimeGroup[]
}

export default function StickyBar({timeIdGroups, saveLoadToggles, gameState, openGameStateModal, offlinePeriods, setOfflinePeriods, planData, actions} 
    : I_StickyBar)
    : JSX.Element {    

    const [showGameState, setShowGameState] = useState(true);
    const [showOfflinePeriods, setShowOfflinePeriods] = useState(false);
   
    const viewToggles : T_ViewToggle[] = [
        {displayStr: "game", toggle: () => setShowGameState(prev => !prev), value: showGameState},
        {displayStr: "offline", toggle: () => setShowOfflinePeriods(prev => !prev), value: showOfflinePeriods},
      ]
   
    return  <div className={"shadow-md flex flex-col bg-neutral-50 border-b border-neutral-400 sticky top-0 relative z-40"}>
                <div className={"bg-white px-3 py-2 w-full"}>
                    <div className={"flex justify-between"}>
                        <div className={"flex gap-2"}>
                            {
                                viewToggles.map(ele => {
                                    return <StickyBarButton key={ele.displayStr} label={ele.displayStr} isOn={ele.value} onClick={ele.toggle} />
                                })
                            }
                        </div>
                        <div className={"flex gap-2"}>
                            {
                                saveLoadToggles.map(ele => {
                                    return <button key={ele.displayStr} className={"border-2 rounded text-sm px-3 py-1" + " " + buttonSecondaryCSSColours} onClick={ele.toggle}>{ele.displayStr}</button>
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className={"flex flex-col items-center"}>
                    { showGameState ?
                        <StickyBarSection extraCSS={"mt-1 mb-1 shadow-xl"}>
                            <SectionGameState   
                                gameState={gameState}
                                openEditForm={openGameStateModal}
                            />
                        </StickyBarSection>
                    : null
                }
                { showOfflinePeriods ?
                        <StickyBarSection extraCSS={"mt-1 mb-1 shadow-xl"}>
                            <SectionOfflinePeriods  
                                offlinePeriods={offlinePeriods}
                                setOfflinePeriods={setOfflinePeriods}
                                gameState={gameState}
                            />
                        </StickyBarSection>
                    : null
                }
                </div>
                <ResultAtTop planData={planData} gameState={gameState} actions={actions} timeIdGroups={timeIdGroups}/>
            </div>

}

function StickyBarButton({label, isOn, onClick} 
    : { label : string, isOn : boolean, onClick : () => void} )
    : JSX.Element {

    let conditionalCSS = isOn ?
                            buttonPrimaryCSS_on
                            : buttonPrimaryCSSColours

   return <button className={"px-3 py-1 rounded" + " " + conditionalCSS} onClick={onClick}>{label}</button>
}

function StickyBarSection({extraCSS, children} 
    : { extraCSS? : string, children : React.ReactNode })
    : JSX.Element {

    return(
        <div className={"bg-white px-2 py-2 w-full max-w-xs" + " " + extraCSS}>
            {children}
        </div>
    )
}



