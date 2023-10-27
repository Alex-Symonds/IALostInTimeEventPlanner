/*
    UI form for "active mode"
    Active mode is for when the event is running and the user wishes to enter their current progress
    then see a projected outcome and, possibly, adjust their plan going forwards
*/

import { useRef } from "react";

import { Button } from "../../subcomponents/buttons";
import { ModalSubmitButton } from "../../../subcomponents/modal";

import { useActiveGameStatusForm } from "../utils/useActiveGameStatusForm";

import { InputPageWrapper, I_StatusFormSharedProps } from "../gameState";

import InputGeneral from './pageGeneral';
import InputStockpiles from './pageStockpiles';
import InputLevelsWorkers from './pageLevelsWorkers';
import InputLevelsOther from './pageLevelsOther';
import { I_ChangeModeButton } from "./changeModeButton";

import { useMultiPageGameStateForm } from "../utils/useMultiplePages";

interface I_ActiveModeForm extends I_StatusFormSharedProps, I_ChangeModeButton {
    wantBackToMode : boolean, 
}
export default function FormActiveMode({gameState, setGameState, changeMode, wantBackToMode, closeModal}
    : I_ActiveModeForm)
    : JSX.Element {

    const { onSubmit,
            levels,
            handleLevelChange,
            hasAdBoost,
            toggleAdBoost,
            timeRemaining,
            updateTimeRemaining,
            timestamp,
            updateTimestamp,
            controlledStockpileValue,
            updateStockpiles,
        } = useActiveGameStatusForm({setGameState, gameState, closeModal});

    const wantBackToModeSetter = useRef<boolean | undefined>();
    wantBackToModeSetter.current = wantBackToMode;
    const {activePage, maxPage, changePage, wantDisableBack} = useMultiPageGameStateForm({wantBackToModeSetter, changeMode});

    /*
        For sighted users, the form will be broken into four pages, navigated with
        prev/next buttons. On the last page "next" will be replaced with "enter".

        For screenreaders, there's not much point in breaking it up into pages,
        so the pageNav container is hidden and instead there's a "normal" submit
        button at the end.
    */
    return <form onSubmit={(e) => onSubmit(e)}>
                <InputPageWrapper 
                    isVisible={ activePage === 1 }
                    >
                    <InputGeneral
                        timestamp={timestamp}
                        updateTimestamp={updateTimestamp}
                        timeRemaining={timeRemaining}
                        updateTimeRemaining={updateTimeRemaining}
                        gameState={gameState}
                        handleLevelChange={handleLevelChange}
                        hasAdBoost={hasAdBoost}
                        toggleAdBoost={toggleAdBoost}
                    />
                </InputPageWrapper>

                <InputPageWrapper 
                    isVisible={ activePage === 2 } 
                    heading={`Current Stockpiles`}  
                    >
                    <InputStockpiles
                        controlledStockpileValue={controlledStockpileValue}
                        updateStockpiles={updateStockpiles}
                    />
                </InputPageWrapper>

                <InputPageWrapper 
                    isVisible={ activePage === 3 } 
                    heading={`Worker Levels`}  
                    >
                    <InputLevelsWorkers
                        handleLevelChange={handleLevelChange} 
                        gameState={gameState} 
                        levels={levels}
                    />
                </InputPageWrapper>

                <InputPageWrapper 
                    isVisible={ activePage === maxPage }  
                    >
                    <InputLevelsOther
                        handleLevelChange={handleLevelChange} 
                        gameState={gameState} 
                        levels={levels}
                    />
                </InputPageWrapper>

                <PageNav 
                    activePage={activePage} 
                    changePage={changePage} 
                    numPages={maxPage} 
                    submitLabel={"enter"}
                    wantDisableBack={wantDisableBack}
                />
                <ModalSubmitButton 
                    label={"submit"} 
                    extraCSS={'sr-only [padding:0] [height:0]'} 
                    disabled={false}
                />
            </form>
}


interface I_PageNav {
    activePage : number, 
    numPages : number, 
    changePage : (pageNum : number) => void,
    submitLabel? : string,
    wantDisableBack : (pageNum : number) => boolean
}
function PageNav({activePage, numPages, changePage, submitLabel, wantDisableBack}
    : I_PageNav)
    : JSX.Element {

    return  <div aria-hidden={true} className={"flex flex-col justify-center gap-5"}>
                <NavButtonBox activePage={activePage} numPages={numPages} changePage={changePage} submitLabel={submitLabel} wantDisableBack={wantDisableBack}/>
                <ProgressStatus activePage={activePage} numPages={numPages} changePage={changePage} />
            </div>
}


function NavButtonBox({activePage, numPages, changePage, submitLabel, wantDisableBack}
    : I_PageNav)
    : JSX.Element {

    const isLastPage = activePage === numPages

    return  <div className={"flex justify-center"}>
                <div className={"flex justify-between w-full"}>
                    <Button
                        colours={'secondary'}
                        htmlType={'button'}
                        size={'twin'}
                        onClick={() => changePage(activePage - 1)}
                        disabled={wantDisableBack(activePage - 1)}
                        >
                        &laquo;&nbsp;back
                    </Button>
                    {
                        isLastPage ?
                            <Button
                                key={'submitBtn'}
                                colours={'primary'}
                                htmlType={'submit'}
                                size={'twin'}
                                onClick={undefined}
                                disabled={false}
                                extraCSS={"border-2"}
                            >
                                { submitLabel ?? "submit" }
                            </Button>
                        :
                            <Button
                                key={'nextBtn'}
                                colours={'primary'}
                                htmlType={'button'}
                                size={'twin'}
                                onClick={() => changePage(activePage + 1)}
                                disabled={isLastPage}
                                extraCSS={"border-2"}
                            >
                                next&nbsp;&raquo;
                            </Button>
                    }
                </div>
            </div>
}


function ProgressStatus({activePage, numPages, changePage}
    : Pick<I_PageNav, "activePage" | "numPages" | "changePage">)
    : JSX.Element {

    const range = (start : number, stop : number, step : number) =>
        Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

    return  <div aria-hidden={true} className={"w-full flex gap-4 justify-center"}>
                {
                    range(1, numPages, 1).map(ele => {
                        return <CircleButton key={`formProgBtn${ele}`} 
                                    isActive={activePage === ele} 
                                    text={`page ${ele}`}
                                    handleClick={ () => changePage(ele) } 
                                />
                    })
                }
            </div>
}


function CircleButton({isActive, text, handleClick}
    : { isActive : boolean, text : string, handleClick : () => void })
    : JSX.Element {

    const selectionCSS = isActive ? 
            "bg-violet-500"
            :
            "bg-neutral-300 hover:bg-neutral-400";
    return  <button type={'button'} className={"rounded-full w-3 h-3" + " " + selectionCSS} onClick={handleClick}>
                <span className={'sr-only'}>{text}</span>
            </button>
}