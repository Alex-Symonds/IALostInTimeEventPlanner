import { T_GameState, T_OfflinePeriod } from '../utils/types';

import { Button } from './forms/subcomponents/buttons';
import SectionGameState from './sectionGameState';
import SectionOfflinePeriods from './sectionOfflinePeriods';


interface I_DisplayUserInput {
    gameState : T_GameState,
    openGameStateModal : () => void,
    offlinePeriods : T_OfflinePeriod[],
    openOfflinePeriodsModal : (idx : number | null) => void,
    offlinePeriodIdxEdit : number | null,
    showGameState : boolean,
    showOfflinePeriods : boolean
}

export default function DisplayUserInput({gameState, openGameStateModal, offlinePeriods, openOfflinePeriodsModal, offlinePeriodIdxEdit, showGameState, showOfflinePeriods}
    : I_DisplayUserInput)
    : JSX.Element {

    const gameStateVisibilityCSS = calcVisibilityCSS(showGameState);
    const offlinePeriodCSS = calcVisibilityCSS(showOfflinePeriods);
    const containerVisibilityCSS = showGameState || showOfflinePeriods ? "py-3 gap-2 border-b border-neutral-300 shadow-md " : "";

    return  <div className={"sticky h-0 top-12 relative z-20 md:sticky md:[grid-area:status] md:top-[7.5rem]"}>
                <section className={"w-full bg-neutral-100 flex flex-col items-center  md:border-none md:shadow-none md:min-w-[20rem] md:[height:calc(100vh-10rem)] md:gap-3 md:px-3 md:py-1.5" + " " + containerVisibilityCSS}>

                    <StickyBarSection extraCSS={"mt-1 mb-1 shadow-xl" + gameStateVisibilityCSS }>
                        <SectionGameState   
                            gameState={gameState}
                            openEditForm={openGameStateModal}
                        />
                    </StickyBarSection>

                    <StickyBarSection extraCSS={"mt-1 mb-1 shadow-xl" + offlinePeriodCSS}>
                        <SectionOfflinePeriods  
                            offlinePeriods={offlinePeriods}
                            gameState={gameState}
                            openModal={openOfflinePeriodsModal}
                            idxEdit={offlinePeriodIdxEdit}
                        />
                    </StickyBarSection>

                </section>
            </div>
}


function calcVisibilityCSS(isVisible : boolean){
    return isVisible ? "" : " sr-only";
}


function StickyBarSection({extraCSS, children} 
    : { extraCSS? : string, children : React.ReactNode })
    : JSX.Element {

    return(
        <div className={"bg-white px-2 py-2 w-full max-w-xs md:rounded" + " " + extraCSS}>
            {children}
        </div>
    )
}

export function DisplayInputSection({title, children} 
    : {title : string, children : React.ReactNode})
    : JSX.Element {

    return(
        <div className={"text-sm overflow-y-auto overflow-x-hidden max-h-[calc(100vh-5rem)] w-full pb-2"}>
            <h2 className={"text-lg font-bold ml-1 mb-2"}>{title}</h2>
            {children}
      </div>
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