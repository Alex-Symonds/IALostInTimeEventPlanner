import { T_GameState, T_OfflinePeriod } from '../utils/types';
import { PlanMode } from '../utils/usePlanMode';

import { Button } from './forms/subcomponents/buttons';
import SectionGameState from './sectionGameState';
import SectionOfflinePeriods from './sectionOfflinePeriods';


interface I_DisplayUserInput {
    gameState : T_GameState,
    openGameStateModal : () => void,
    mode : PlanMode | null,
    offlinePeriods : T_OfflinePeriod[],
    openOfflinePeriodsModal : (idx : number | null) => void,
    offlinePeriodIdxEdit : number | null,
    showGameState : boolean,
    showOfflinePeriods : boolean
}

export default function DisplayUserInput({gameState, openGameStateModal, mode, offlinePeriods, openOfflinePeriodsModal, offlinePeriodIdxEdit, showGameState, showOfflinePeriods}
    : I_DisplayUserInput)
    : JSX.Element {

    const gameStateVisibilityCSS = calcVisibilityCSS(showGameState);
    const offlinePeriodCSS = calcVisibilityCSS(showOfflinePeriods);
    const containerVisibilityCSS = showGameState || showOfflinePeriods ? "py-3 gap-2 border-b border-violet-950 shadow-md " : "";

    function calcVisibilityCSS(isVisible : boolean){
        return isVisible ? "" : " sr-only";
    }

    return  <div className={"sticky h-0 top-12 relative z-20 md:sticky md:[grid-area:status] md:[top:calc(7.5rem_+_1px)]"}>
                <div className={`w-full bg-violet-900 flex flex-col items-center md:bg-transparent md:border-none md:shadow-none md:min-w-[20rem] md:[height:calc(100vh-10rem)] md:gap-3 md:px-3 md:pt-0 md:pb-1.5 ${containerVisibilityCSS}`}>
                    
                    <DisplayInputSection title={"Game Status"} extraCSS={`md:mt-0 ${gameStateVisibilityCSS}`}>
                        <SectionGameState   
                            gameState={gameState}
                            openEditForm={openGameStateModal}
                            mode={mode}
                        />
                    </DisplayInputSection>

                    <DisplayInputSection title={"Offline Periods"} extraCSS={offlinePeriodCSS}>
                        <SectionOfflinePeriods  
                            offlinePeriods={offlinePeriods}
                            gameState={gameState}
                            openModal={openOfflinePeriodsModal}
                            idxEdit={offlinePeriodIdxEdit}
                        />
                    </DisplayInputSection>
                </div>
            </div>
}


function DisplayInputSection({title, extraCSS, children} 
    : {title : string, extraCSS : string, children : React.ReactNode})
    : JSX.Element {

    return(
        <section className={`mt-1 mb-1 shadow-xl bg-white px-2 py-2 w-full max-w-xs rounded text-sm overflow-y-auto overflow-x-hidden max-h-[calc(100vh-5rem)] w-full pb-2 ${extraCSS}`}>
            <h2 className={"text-lg font-bold ml-1 mb-3"}>{title}</h2>
            {children}
        </section>
    )
}

export function EditButtonBox({openEditForm, label} 
    : {openEditForm : () => void, label : string | undefined})
    : JSX.Element {

    return(
        <div className={"mt-6"}>
            <Button 
                size={'default'}
                colours={'primary'}
                onClick={() => openEditForm()}
                >
                    {label ?? 'edit'}
            </Button>
        </div>
    )
}