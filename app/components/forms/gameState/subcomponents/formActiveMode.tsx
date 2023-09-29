/*
    UI form for "active mode"
    Active mode is for when the event is running and the user wishes to enter their current progress
    then see a projected outcome and, possibly, adjust their plan going forwards
*/

import { useRef } from "react";

import { ModalMultiPageNav, ModalSubmitButton } from "../../../subcomponents/modal";

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
            timeEntered,
            setTimeEntered,
            timeRemaining,
            setTimeRemaining,
            controlledStockpileValue,
            updateStockpiles,
            setStateOnChange,
        } = useActiveGameStatusForm({setGameState, gameState, closeModal});

    const wantBackToModeSetter = useRef<boolean | undefined>();
    wantBackToModeSetter.current = wantBackToMode;
    const {activePage, maxPage, changePage, wantDisableBack} = useMultiPageGameStateForm({wantBackToModeSetter, changeMode});

    return <form onSubmit={(e) => onSubmit(e)}>
                <InputPageWrapper 
                    isVisible={ activePage === 1 }
                    >
                    <InputGeneral
                        timeEntered={timeEntered}
                        setStateOnChange={setStateOnChange}
                        setTimeEntered={setTimeEntered}
                        timeRemaining={timeRemaining}
                        setTimeRemaining={setTimeRemaining}
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

                <ModalMultiPageNav 
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