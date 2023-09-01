import {SetStateAction, Dispatch, useState } from 'react';

import UPGRADE_DATA from '../upgrades.json';

import { deepCopy } from '../utils/consts';
import { defaultLevels, defaultStockpiles, defaultTimeRemaining, lateGameSettings } from '../utils/defaults';
import { T_Stockpiles, T_Levels, T_TimeRemainingDHM, T_GameState } from '../utils/types';

import Select, { T_OptionData } from './select';
import Modal, { ModalSubmitButton, ModalHeading } from './modal';
import { BadgeCost, BadgeMaxed } from './badges';

import InputGeneral from './inputGameState_general';
import InputStockpiles from './inputGameState_stockpiles';
import InputLevelsWorkers from './inputGameState_levelsWorkers';
import InputLevelsOther from './inputGameState_levelsOther';

interface I_StatusFormProps {
    setGameState : React.Dispatch<SetStateAction<T_GameState>>,
    gameState : T_GameState,
    closeModal : () => void,
}

export default function StatusForm({setGameState, gameState, closeModal}
    : I_StatusFormProps)
    : JSX.Element {

    const [timeEntered, setTimeEntered] = useState<Date>(new Date())
    const [timeRemaining, setTimeRemaining] = useState<T_TimeRemainingDHM>(gameState === null ? defaultTimeRemaining : convertTimeIdToDHM(gameState.timeRemaining))
    const [hasAdBoost, setHasAdBoost] = useState<boolean>(gameState === null ? false : gameState.premiumInfo.adBoost)
    const [allEggsLevel, setAllEggsLevel] = useState<number>(gameState === null ? 0 : gameState.premiumInfo.allEggs)
    const [stockpiles, setStockpiles] = useState<T_Stockpiles>(gameState === null ? deepCopy(defaultStockpiles) : gameState.stockpiles)
    const [levels, setLevels] = useState<T_Levels>(gameState === null ? deepCopy(defaultLevels) : gameState.levels)

    const [activePage, setActivePage] = useState<number>(1);

    function onSubmit(e : React.SyntheticEvent){
        e.preventDefault();
        let newGameState = convertFormInputsToGameState({timeEntered, timeRemaining, hasAdBoost, allEggsLevel, stockpiles, levels});
        setGameState(newGameState);
        closeModal();
    }

    function setStateOnChange(e : React.ChangeEvent<any>, setFunction : React.Dispatch<SetStateAction<any>>){
        setFunction(e.target.value);
    }

    function toggleAdBoost(){
        setHasAdBoost(prevState => !prevState);
    }

    function setToLateGame(){
        setTimeEntered(new Date(new Date().getTime() - 5 * 60 * 1000));
        setTimeRemaining(lateGameSettings.timeRemainingDHM);
        setHasAdBoost(lateGameSettings.hasAdBoost);
        setAllEggsLevel(lateGameSettings.allEggs);
        setStockpiles(lateGameSettings.stockpiles);
        setLevels(lateGameSettings.levels);
    }

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

    return (
        <Modal closeModal={closeModal}>
            <div className={'m-1 flex flex-col text-sm w-[280px] max-w-full'}>
                <ModalHeading>Enter Game Status</ModalHeading>
                {/* <button onClick={setToLateGame}>setToLateGame</button> */}
                <form onSubmit={(e) => onSubmit(e)}>

                    <InputGeneral 
                        isVisible={ activePage === 1 }
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

                    <InputStockpiles
                        isVisible={ activePage === 2 }
                        controlledStockpileValue={controlledStockpileValue}
                        updateStockpiles={updateStockpiles}
                    />

                    <InputLevelsWorkers
                        isVisible={ activePage === 3 }
                        handleLevelChange={handleLevelChange} 
                        gameState={gameState} 
                        levels={levels}
                    />

                    <InputLevelsOther
                        isVisible={ activePage === 4 }
                        handleLevelChange={handleLevelChange} 
                        gameState={gameState} 
                        levels={levels}
                    />

                    <ProgressStatus activePage={activePage} changePage={setActivePage}/>
                    <ModalSubmitButton label={"submit"} extraCSS={"mt-4"} disabled={false}/>
                </form>
            </div>
        </Modal>
    )

}


function ProgressStatus({activePage, changePage}
    : { activePage : number, changePage : Dispatch<SetStateAction<number>> })
    : JSX.Element {

    return  <div aria-hidden={true} className={"w-full flex gap-4 justify-center py-2"}>
                {
                    [1,2,3,4].map(ele => {
                        return <CircleButton key={`formProgBtn${ele}`} 
                                    isActive={activePage === ele} 
                                    handleClick={ () => changePage(ele) } 
                                />
                    })
                }
            </div>
}

function CircleButton({isActive, handleClick}
    : any)
    : JSX.Element {

    const selectionCSS = isActive ? 
            "bg-violet-500"
            :
            "bg-neutral-300 hover:bg-neutral-400";
    return <button type={'button'} className={"rounded-full w-4 h-4 mt-4" + " " + selectionCSS} onClick={handleClick}></button>
}


export function InputPageWrapper({ isVisible, heading, children }
    : { isVisible : boolean, heading? : string, children : React.ReactNode })
    : JSX.Element {

    const visibilityCSS = isVisible ? "" : "sr-only";

    return  <section className={"mt-2 flex flex-col gap-3.5" + " " + visibilityCSS}>
                {
                    heading === undefined ?
                    null
                    :
                    <FormSubHeading text={heading} />
                }
                { children }
            </section>
}


export function FormSubHeading({text} 
    : { text : string })
    : JSX.Element {

    return <h3 className={'text-md font-bold'}>{text}</h3>
}


export function FormRow({extraCSS, children} 
    : { extraCSS : string | undefined, children : React.ReactNode })
    : JSX.Element {

    return(
        <div className={"first:mt-0 mt-2 mb-3.5" + " " + extraCSS ?? ""}>
            {children}
        </div>
    )
}


// Use this to pass matching formatting to legends and the label built-in to Select
export const GAMESTATE_LABEL_CSS_FORMATTING = "block w-20 ml-2 font-semibold";
export function Label({htmlFor, children} 
    : { htmlFor : string, children : React.ReactNode })
    : JSX.Element {
 
    return <label className={GAMESTATE_LABEL_CSS_FORMATTING} htmlFor={htmlFor}>{children}</label>
}


export function LevelsWrapper({children} 
    : { children : React.ReactNode })
    : JSX.Element {

    return (
        <div className={"pl-4 flex flex-col"}>
            {children}
        </div>
    )
}


interface I_PropsUnitLevelInput {
    keyName : string, 
    idStr : string, 
    labelStr : string, 
    initValue : string | undefined, 
    options : T_OptionData[], 
    handleLevelChange : (e : React.ChangeEvent<HTMLSelectElement>) => void, 
    currentValue : number
}
export function UnitLevelInput({keyName, idStr, labelStr, initValue, options, handleLevelChange, currentValue} 
    : I_PropsUnitLevelInput)
    : JSX.Element {

    let data = UPGRADE_DATA[keyName as keyof typeof UPGRADE_DATA];
    return <FormRow extraCSS={"flex"}>
                <Select
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
            </FormRow>
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
        cssStr += ' border-neutral-200 ';
    }

    return <input 
                className={"border" + " " + cssStr} 
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


function convertTimeIdToDHM(timeId: number)
    : { days : number, hours : number, minutes : number} {

    let days : number = Math.floor(timeId / 60 / 24);
    let hours : number, minutes : number;

    if(days === 3){
        return {
            days: 3,
            hours: 0,
            minutes: 0
        }
    }

    let remainingTime = timeId - days * 24 * 60;
    minutes = remainingTime % 60;
    hours = (remainingTime - minutes) / 60;

    return{
        days, hours, minutes
    }
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

    const days = isNaN(timeRemaining.days) ? 0 : timeRemaining.days;
    const hours = isNaN(timeRemaining.hours) ? 0 : timeRemaining.hours;
    const minutes = isNaN(timeRemaining.minutes) ? 0 : timeRemaining.minutes;
    const timeRemainingInMins = days * 24 * 60 + hours * 60 + minutes;

    return {
        timeEntered,
        timeRemaining: timeRemainingInMins,
        premiumInfo: {
            adBoost: hasAdBoost,
            allEggs: allEggsLevel,
        },
        stockpiles,
        levels,
    }
}




