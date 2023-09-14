import { Dispatch, SetStateAction, useState, ChangeEvent } from 'react';

import UPGRADE_DATA from '../upgrades.json';

import { deepCopy } from '../utils/consts';
import { convertTimeRemainingToMinutes, convertTimeIdToDHM } from '../utils/dateAndTimeHelpers';
import { defaultLevels, defaultStockpiles, defaultTimeRemaining, lateGameSettings, maxLevels } from '../utils/defaults';
import { T_Stockpiles, T_Levels, T_TimeRemainingDHM, T_GameState } from '../utils/types';

import { SelectWithLabel, T_OptionData } from './select';
import Modal, { ModalMultiPageNav, ModalFieldsWrapper, ModalSubmitButton, ModalHeading, ModalSubHeading } from './modal';
import { BadgeCost, BadgeMaxed } from './badges';

import InputGeneral, { I_InputGeneral } from './inputGameState_general';
import InputStockpiles, { I_InputStockpiles } from './inputGameState_stockpiles';
import InputLevelsWorkers from './inputGameState_levelsWorkers';
import InputLevelsOther, { I_InputLevelsOther } from './inputGameState_levelsOther';

interface I_StatusFormProps {
    setGameState : Dispatch<SetStateAction<T_GameState>>,
    gameState : T_GameState,
    closeModal : () => void,
}

export default function StatusForm({setGameState, gameState, closeModal}
    : I_StatusFormProps)
    : JSX.Element {

    const [activePage, setActivePage] = useState<number>(1);
    const MAX_PAGE_NUM = 4;

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
        } = useGameStatusForm({setGameState, gameState, closeModal});


    return (
        <Modal closeModal={closeModal}>
            <ModalHeading>Game Status</ModalHeading>
            <form onSubmit={(e) => onSubmit(e)}>
                <InputPageWrapper 
                    isVisible={ activePage === 1 } 
                    heading={`1/${MAX_PAGE_NUM}: Times and Premium`} 
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
                    heading={`2/${MAX_PAGE_NUM}: Current Stockpiles`}  
                    >
                    <InputStockpiles
                        controlledStockpileValue={controlledStockpileValue}
                        updateStockpiles={updateStockpiles}
                    />
                </InputPageWrapper>

                <InputPageWrapper 
                    isVisible={ activePage === 3 } 
                    heading={`3/${MAX_PAGE_NUM}: Worker Levels`}  
                    >
                    <InputLevelsWorkers
                        handleLevelChange={handleLevelChange} 
                        gameState={gameState} 
                        levels={levels}
                    />
                </InputPageWrapper>

                <InputPageWrapper 
                    isVisible={ activePage === MAX_PAGE_NUM } 
                    heading={`4/${MAX_PAGE_NUM}: Other Levels`}  
                    >
                    <InputLevelsOther
                        handleLevelChange={handleLevelChange} 
                        gameState={gameState} 
                        levels={levels}
                    />
                </InputPageWrapper>

                <ModalMultiPageNav 
                    activePage={activePage} 
                    changePage={setActivePage} 
                    numPages={MAX_PAGE_NUM} 
                    submitLabel={"enter"}
                />
                <ModalSubmitButton 
                    label={"submit"} 
                    extraCSS={'sr-only [padding:0] [height:0]'} 
                    disabled={false}
                />
            </form>
        </Modal>
    )

}


function InputPageWrapper({ isVisible, heading, children }
    : { isVisible : boolean, heading? : string, children : React.ReactNode })
    : JSX.Element {

    const visibilityCSS = isVisible ? "" : "sr-only";
    return  <section className={"flex flex-col" + " " + visibilityCSS}>
                {
                    heading === undefined ?
                    null
                    :
                    <ModalSubHeading>{heading}</ModalSubHeading>
                }
                <ModalFieldsWrapper>
                    { children }
                </ModalFieldsWrapper>
            </section>
}


export function LevelsWrapper({children} 
    : { children : React.ReactNode })
    : JSX.Element {

    return  <div className={"pl-4 flex flex-col gap-5"}>
                {children}
            </div>

}

export function Label({htmlFor, tagName, extraCSS, children} 
    : { htmlFor : string, tagName? : keyof JSX.IntrinsicElements, extraCSS? : string, children : React.ReactNode })
    : JSX.Element {
 
    const Tag = tagName ?? 'label' as keyof JSX.IntrinsicElements;
    extraCSS = extraCSS ?? "font-semibold";

    return <Tag className={"block w-20 ml-2" + " " + extraCSS} htmlFor={htmlFor}>{children}</Tag>
}


interface I_PropsUnitLevelInput {
    keyName : string, 
    idStr : string, 
    labelStr : string, 
    initValue : string | undefined, 
    options : T_OptionData[], 
    handleLevelChange : (e : ChangeEvent<HTMLSelectElement>) => void, 
    currentValue : number
}
export function UnitLevelInput({keyName, idStr, labelStr, initValue, options, handleLevelChange, currentValue} 
    : I_PropsUnitLevelInput)
    : JSX.Element {

    let data = UPGRADE_DATA[keyName as keyof typeof UPGRADE_DATA];
    return <div className={"flex"}>
                <SelectWithLabel
                    selectExtraCSS={"w-16"}
                    labelExtraCSS={"block w-16"}
                    id={idStr}
                    labelDisplay={labelStr}
                    initValue={initValue}
                    options={options}
                    handleChange={handleLevelChange}
                />
                <div className={"ml-2 flex gap-1"}>
                    {
                        currentValue === data.upgrades.length ?
                            <BadgeMaxed extraCSS={"opacity-40"}/>
                            :
                            data.upgrades[currentValue].costs.map((cost, idx) => {
                                return <BadgeCost key={idx} data={cost} extraCSS={undefined}/>
                            })
                    }
                </div>
            </div>
}


interface I_PropsInputNumberAsText {
    idStr : string, 
    value : number | string, 
    handleChange : (e : React.ChangeEvent<HTMLInputElement>) => void, 
    cssStr : string | undefined
};
export function InputNumberAsText({idStr, value, handleChange, cssStr} 
    : I_PropsInputNumberAsText)
    : JSX.Element {

    let valueStr = value.toString();
    if(typeof value !== 'number' || isNaN(value)){
        valueStr = "0";
    }

    if(cssStr === undefined || !cssStr.includes('border')){
        cssStr += ' border-neutral-300 ';
    }

    return <input 
                className={"border rounded-sm" + " " + cssStr} 
                type="text" 
                inputMode="numeric" 
                pattern="^[0-9]+$|^$" 
                id={idStr} 
                value={valueStr} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} 
            />
}


export function getInitValueForLevelSelect(name : string, gameState : T_GameState)
    : string | undefined {

    let initValue : string | undefined = undefined;
    let keyName = name.toLowerCase();
    if(gameState !== null){
        let level = gameState.levels[keyName as keyof typeof gameState.levels];
        initValue = formatValueStr(name, level);
    }
    return initValue;
}


export function formatValueStr(name : string, numStr : number)
    : string {

    return `${ name.toLowerCase() }_${ numStr.toString() }`
}


export function getUpgradeOptions({name, max} 
    : { name : string, max : number})
    : T_OptionData[] {

    let options = [];

    for(let i=0; i<=max; i++){
        let newOption = { valueStr: formatValueStr(name, i), displayStr: `${ i }` };
        options.push(newOption);
    }

    return options;
}


interface I_PropsConvertFormInputsToGameState {
    timeEntered : Date,
    timeRemaining : T_TimeRemainingDHM, 
    hasAdBoost : boolean, 
    allEggsLevel : number, 
    stockpiles : T_Stockpiles, 
    levels : T_Levels
};
function convertFormInputsToGameState({timeEntered, timeRemaining, hasAdBoost, allEggsLevel, stockpiles, levels} 
    : I_PropsConvertFormInputsToGameState)
    : T_GameState {

    return {
        timeEntered,
        timeRemaining: convertTimeRemainingToMinutes(timeRemaining),
        premiumInfo: {
            adBoost: hasAdBoost,
            allEggs: allEggsLevel,
        },
        stockpiles,
        levels,
    }
}


type T_OutputUseGameStatusForm = 
    Pick<I_InputGeneral, 
        "handleLevelChange" | 
        "hasAdBoost" | 
        "setStateOnChange" | 
        "setTimeEntered" | 
        "setTimeRemaining" | 
        "timeEntered" | 
        "timeRemaining" | 
        "toggleAdBoost"> &
    Pick<I_InputLevelsOther, 
        "levels" | 
        "handleLevelChange"> &
    I_InputStockpiles & {
    onSubmit : (e : React.SyntheticEvent) => void,
}

function useGameStatusForm({gameState, setGameState, closeModal}
    : I_StatusFormProps)
    : T_OutputUseGameStatusForm {

    const [timeEntered, setTimeEntered] = useState<Date>(new Date())
    const [timeRemaining, setTimeRemaining] = useState<T_TimeRemainingDHM>(gameState === null ? defaultTimeRemaining : convertTimeIdToDHM(gameState.timeRemaining))
    const [hasAdBoost, setHasAdBoost] = useState<boolean>(gameState === null ? false : gameState.premiumInfo.adBoost)
    const [allEggsLevel, setAllEggsLevel] = useState<number>(gameState === null ? 0 : gameState.premiumInfo.allEggs)
    const [stockpiles, setStockpiles] = useState<T_Stockpiles>(gameState === null ? deepCopy(defaultStockpiles) : gameState.stockpiles)
    const [levels, setLevels] = useState<T_Levels>(gameState === null ? deepCopy(defaultLevels) : gameState.levels)

    function setStateOnChange(e : React.ChangeEvent<any>, setFunction : React.Dispatch<SetStateAction<any>>){
        setFunction(e.target.value);
    }

    function toggleAdBoost(){
        setHasAdBoost(prevState => !prevState);
    }

    // function setToLateGame(){
    //     setTimeEntered(new Date(new Date().getTime() - 5 * 60 * 1000));
    //     setTimeRemaining(lateGameSettings.timeRemainingDHM);
    //     setHasAdBoost(lateGameSettings.hasAdBoost);
    //     setAllEggsLevel(lateGameSettings.allEggs);
    //     setStockpiles(lateGameSettings.stockpiles);
    //     setLevels(lateGameSettings.levels);
    // }

    // function testLevelsDone(){
    //     setTimeEntered(new Date(new Date().getTime() - 5 * 60 * 1000));
    //     setTimeRemaining(lateGameSettings.timeRemainingDHM);
    //     setHasAdBoost(lateGameSettings.hasAdBoost);
    //     setAllEggsLevel(lateGameSettings.allEggs);
    //     setStockpiles(lateGameSettings.stockpiles);
    //     setLevels(maxLevels);
    // }

    function updateStockpiles(e : React.ChangeEvent<HTMLInputElement>, key : string){
        let newStockpiles : T_Stockpiles = deepCopy(stockpiles);
        newStockpiles[key as keyof T_Stockpiles] = parseInt(e.target.value);
        setStockpiles(newStockpiles);
    }

    function handleLevelChange(e : React.ChangeEvent<HTMLSelectElement>){
        let valueStr = e.target.value;
        let splitStr = valueStr.split("_");
        let key = splitStr[0];
        let prodStr = splitStr[1];

        let prodInt = parseInt(prodStr);

        if(key === "all"){
            setAllEggsLevel(prodInt);
            return;
        }

        key = key.toLowerCase();
        let newLevels : T_Levels = deepCopy(levels);
        if(key in newLevels){
            newLevels[key as keyof typeof newLevels] = prodInt;
        }

        setLevels(newLevels);
    }
    

    function controlledStockpileValue(key : string){
        if(!(key in stockpiles)){
            return '';
        }
        let thisValue = stockpiles[key as keyof typeof stockpiles];
        return thisValue === null ? '' : thisValue;
    }

    function onSubmit(e : React.SyntheticEvent){
        e.preventDefault();
        let newGameState = convertFormInputsToGameState({timeEntered, timeRemaining, hasAdBoost, allEggsLevel, stockpiles, levels});
        setGameState(newGameState);
        closeModal();
    }

    return {
        onSubmit,
        handleLevelChange,
        hasAdBoost,
        toggleAdBoost,
        timeEntered,
        setStateOnChange,
        setTimeEntered,
        timeRemaining,
        setTimeRemaining,
        levels,
        controlledStockpileValue,
        updateStockpiles,
    }
}

