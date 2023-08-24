import {SetStateAction, useState } from 'react';

import UPGRADE_DATA from '../upgrades.json';

import { deepCopy, MAX_DAYS } from '../utils/consts';
import { getDateDisplayStr } from '../utils/dateAndTimeHelpers';
import { defaultLevels, defaultStockpiles, defaultTimeRemaining, lateGameSettings } from '../utils/defaults';
import { buttonSecondaryCSSColours_onDark, resourceCSS, capitalise } from '../utils/formatting';
import { T_Stockpiles, T_Levels, T_TimeRemainingDHM, T_GameState } from '../utils/types';

import Select, { T_OptionData } from './select';
import { CloseButton, ModalSubmitButton } from './modal';
import { BadgeCost, BadgeMaxed } from './badges';


interface I_StatusFormProps {
    setGameState : React.Dispatch<SetStateAction<T_GameState>>,
    gameState : T_GameState,
    closeForm : () => void,
}

export default function StatusForm({setGameState, gameState, closeForm} 
    : I_StatusFormProps)
    : JSX.Element {

    const [timeEntered, setTimeEntered] = useState<Date>(new Date())
    const [timeRemaining, setTimeRemaining] = useState<T_TimeRemainingDHM>(gameState === null ? defaultTimeRemaining : convertTimeIdToDHM(gameState.timeRemaining))
    const [hasAdBoost, setHasAdBoost] = useState<boolean>(gameState === null ? false : gameState.premiumInfo.adBoost)
    const [allEggsLevel, setAllEggsLevel] = useState<number>(gameState === null ? 0 : gameState.premiumInfo.allEggs)
    const [stockpiles, setStockpiles] = useState<T_Stockpiles>(gameState === null ? deepCopy(defaultStockpiles) : gameState.stockpiles)
    const [levels, setLevels] = useState<T_Levels>(gameState === null ? deepCopy(defaultLevels) : gameState.levels)

    function onSubmit(e : React.SyntheticEvent){
        e.preventDefault();
        let newGameState = convertFormInputsToGameState({timeEntered, timeRemaining, hasAdBoost, allEggsLevel, stockpiles, levels});
        setGameState(newGameState);
        closeForm();
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
        <div className={'overflow-y-auto overflow-x-hidden max-h-[calc(100vh-10rem)] relative m-1 flex flex-col border-2 border-grey-500 border-solid rounded bg-gray-100 p-2 text-sm'}>
            <CloseButton extraCSS={"top-1 right-1"} close={() => closeForm()} />

            <h2 className={"text-lg font-bold mb-2"}>Enter Game Status</h2>
            {/* <button onClick={setToLateGame}>setToLateGame</button> */}
            <form onSubmit={(e) => onSubmit(e)}>
                <section>
                    <FormSubHeading text={"General"} />
                    <FormRow extraCSS={"flex gap-2"}>
                        <TimeRemainingFieldset timeRemaining={timeRemaining} setTimeRemaining={setTimeRemaining} />
                    </FormRow>
                    <FormRow extraCSS={"flex gap-2 items-center"}>
                        <Entered timeEntered={timeEntered} setStateOnChange={setStateOnChange} setTimeEntered={setTimeEntered}/>
                    </FormRow>
                    <FormRow extraCSS={"flex gap-2"}>
                        <Select labelExtraCSS={"block w-20 ml-2"} selectExtraCSS={undefined} id={"id_AllEggs"} labelDisplay={"All Eggs"} initValue={gameState === null ? undefined : formatValueStr("All", gameState.premiumInfo.allEggs)} options={getUpgradeOptions({ name: "All", max: 5 })} handleChange={handleLevelChange} />
                    </FormRow>
                    <FormRow extraCSS={"flex gap-2"}>
                        <Label htmlFor={"id_adBoost"}>Ad Boost</Label>
                        <input type="checkbox" id="id_adBoost" checked={hasAdBoost} onChange={ toggleAdBoost } />
                    </FormRow>
                </section>

                <section className={"mt-4"}>
                    <FormSubHeading text={"Current Stockpiles"} />
                    <DustInput controlledStockpileValue={controlledStockpileValue} updateStockpiles={updateStockpiles} />
                    <StockpileInput keyId={'blue'} controlledStockpileValue={controlledStockpileValue} updateStockpiles={updateStockpiles} />
                    <StockpileInput keyId={'green'} controlledStockpileValue={controlledStockpileValue} updateStockpiles={updateStockpiles} />
                    <StockpileInput keyId={'red'} controlledStockpileValue={controlledStockpileValue} updateStockpiles={updateStockpiles} />
                    <StockpileInput keyId={'yellow'} controlledStockpileValue={controlledStockpileValue} updateStockpiles={updateStockpiles} />
                </section>

                <FormSectionLevels handleLevelChange={handleLevelChange} gameState={gameState} levels={levels} />

                <ModalSubmitButton label={"submit"} extraCSS={"mt-4"} disabled={false}/>
            </form>
        </div>
    )

}



function Label({htmlFor, children} 
    : { htmlFor : string, children : React.ReactNode })
    : JSX.Element {
 
    return <label className={"block w-20 ml-2"} htmlFor={htmlFor}>{children}</label>
}


function FormSubHeading({text} 
    : { text : string })
    : JSX.Element {

    return <h3 className={'text-md font-bold mb-2'}>{text}</h3>
}


function FormRow({extraCSS, children} 
    : { extraCSS : string | undefined, children : React.ReactNode })
    : JSX.Element {

    return(
        <div className={"mt-3" + " " + extraCSS ?? ""}>
            {children}
        </div>
    )
}


interface I_PropsEntered {
    timeEntered : Date | null, 
    setStateOnChange : (e : React.ChangeEvent<any>, setFunction : React.Dispatch<SetStateAction<any>>) => void, 
    setTimeEntered : React.Dispatch<React.SetStateAction<Date>>
}
function Entered({timeEntered, setStateOnChange, setTimeEntered} 
    : I_PropsEntered)
    : JSX.Element {

    timeEntered = timeEntered ?? new Date();

    return(
        <>
            <Label htmlFor={"id_timeEntered"}>Entered</Label>
            <p suppressHydrationWarning={true}>{ getDateDisplayStr(timeEntered) }</p>
            <input hidden type="datetime-local" id={"id_timeEntered"} value={timeEntered == null ? "" : `${timeEntered}`} onChange={(e) => setStateOnChange(e, setTimeEntered)}/>

            <button 
                type={"button"} 
                onClick={() => {setTimeEntered(new Date())}} 
                className={"ml-3 border-2 text-xs px-1 py-0.5 rounded" + " " + buttonSecondaryCSSColours_onDark}>
                    &laquo;&nbsp;now
                </button>
        </>
    )
}


interface I_PropsTimeRemainingFieldset {
    timeRemaining: T_TimeRemainingDHM,
    setTimeRemaining: React.Dispatch<React.SetStateAction<T_TimeRemainingDHM>>
}

function TimeRemainingFieldset({timeRemaining, setTimeRemaining} 
    : I_PropsTimeRemainingFieldset)
    : JSX.Element {

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");

    const MAX_HOURS = 23;
    const MAX_MINUTES = 59;

    function handleChangeDays(e : React.ChangeEvent<HTMLInputElement>){
        let newDaysStr = e.target.value;
        let newDays = parseInt(newDaysStr);

        newDays = validateDays(newDays);

        if(newDays === MAX_DAYS){
            setTimeRemaining({
                days: MAX_DAYS,
                hours: 0,
                minutes: 0
            });
            return;
        }

        setTimeRemaining(prev => {
            return {
                ...prev,
                days: newDays
            }
        });
    }

    function validateDays(newDays : number){
        const rangeStr = `days can be 0 - ${MAX_DAYS}`;

        if(newDays > MAX_DAYS){
            setMessage(rangeStr);
            setIsError(true);
            newDays = MAX_DAYS;
        }
        else if(newDays === MAX_DAYS 
                && ( timeRemaining.hours > 0 || timeRemaining.minutes > 0)
            ){
            setIsError(true);
            setMessage(`${MAX_DAYS} days is the maximum: hours and minutes set to 0`);
        }
        else if(newDays < 0){
            setIsError(true);
            setMessage(rangeStr);
            newDays = 0;
        }
        else if(isError){
            setIsError(false);
        }

        return newDays;
    }


    function handleChangeHours(e: React.ChangeEvent<HTMLInputElement>){
        let newHoursStr = e.target.value;
        let newHours = parseInt(newHoursStr);
        newHours = validateHours(newHours);

        setTimeRemaining((prev) => {
            return {
                ...prev,
                hours: newHours
            }
        });
    }

    function validateHours(newHours : number){
        const rangeStr = `hours can be 0 - ${MAX_HOURS} (inclusive)`;

        if(timeRemaining.days === MAX_DAYS && newHours !== 0){
            setIsError(true);
            setMessage(`can't go above ${MAX_DAYS} days`);
            newHours = 0;
        }
        else if(newHours > MAX_HOURS){
            setIsError(true);
            setMessage(rangeStr);
            newHours = MAX_HOURS;
        }
        else if(newHours < 0){
            setIsError(true);
            setMessage(rangeStr);
            newHours = 0;
        }
        else{
            setIsError(false);
        }

        return newHours;
    }


    function handleChangeMinutes(e: React.ChangeEvent<HTMLInputElement>){
        let newMinutesStr = e.target.value;
        let newMinutes = parseInt(newMinutesStr);
        newMinutes = validateMinutes(newMinutes);

        setTimeRemaining((prev) => {
            return {
                ...prev,
                minutes: newMinutes
            }
        });
    }


    function validateMinutes(newMinutes : number){
        const rangeStr = `minutes can be 0 - ${MAX_MINUTES}`;
        if(timeRemaining.days === MAX_DAYS && newMinutes !== 0){
            setIsError(true);
            setMessage(`can't go above ${MAX_DAYS} days`);
            newMinutes = 0;
        }
        else if(newMinutes > MAX_MINUTES){
            setIsError(true);
            setMessage(rangeStr);
            newMinutes = MAX_MINUTES;
        }
        else if(newMinutes < 0){
            setIsError(true);
            setMessage(rangeStr);
            newMinutes = 0;
        }
        else{
            setIsError(false);
        }
        return newMinutes;
    }

    return (
        <fieldset className={"relative w-full pt-5" + " " + ""}>
            <legend className={"absolute block w-20 pl-2 top-0 mb-2"}>Remaining</legend>
            <div className={'flex flex-col items-center gap-1 px-3 ml-1'}>
                <div className={'flex justify-center gap-2 mt-1'}>
                    <TimeRemainingUnit unitName={"days"} value={timeRemaining == null ? 0 : timeRemaining.days} handleChange={handleChangeDays} />
                    <TimeRemainingUnit unitName={"hours"} value={timeRemaining == null ? 0 : timeRemaining.hours} handleChange={handleChangeHours} />
                    <TimeRemainingUnit unitName={"minutes"} value={timeRemaining == null ? 0 : timeRemaining.minutes} handleChange={handleChangeMinutes} />
                </div>
                { isError ?
                    <div className={"text-xs border-1 text-neutral-700 px-1 py-1 w-full"}>{capitalise(message)}</div>
                    : null
                }
            </div>
        </fieldset>
    )
}

interface I_TimeRemainingUnitProps {
    unitName : string, 
    value : number, 
    handleChange : (e : React.ChangeEvent<HTMLInputElement>) => void
}
function TimeRemainingUnit({unitName, value, handleChange} 
    : I_TimeRemainingUnitProps)
    : JSX.Element {

    if(isNaN(value)){
        value = 0;
    }

    const idStr = `id_${unitName}`;
    return (
        <div className={'flex items-center'}>
            <InputNumberAsText cssStr={"w-12 pl-1"} idStr={idStr} value={value} handleChange={handleChange} />
            <label className={"pl-1 pr-2"} htmlFor={idStr}>{unitName.charAt(0)}</label>
        </div>
    )
}


interface I_PropsStockpileWrapper { 
    coloursCSS : string, 
    idStr : string, 
    label: string, 
    children : React.ReactNode 
}
function StockpileWrapper({coloursCSS, idStr, label, children} 
    : I_PropsStockpileWrapper)
    : JSX.Element {

    return  <div className={"flex py-1 px-2 items-center border" + " " + coloursCSS}>
                <label className={"block w-20"} htmlFor={idStr}>{label}</label>
                {children}
            </div>
}

interface I_PropsStockpileInput {
    keyId : string, 
    controlledStockpileValue : (keyId : string) => string | number, 
    updateStockpiles : (e : React.ChangeEvent<HTMLInputElement>, keyId : string) => void
}
function StockpileInput({keyId, controlledStockpileValue, updateStockpiles} 
    : I_PropsStockpileInput )
    : JSX.Element {

    const idStr = `id_${keyId}Stock`;
    const label = `${keyId.charAt(0).toUpperCase()}${keyId.slice(1)}`;
    return (
        <StockpileWrapper coloursCSS={resourceCSS[keyId as keyof typeof resourceCSS].badge} label={label} idStr={idStr}>
            <InputNumberAsText cssStr={"w-36 text-black py-1 px-2 font-normal"} idStr={idStr} value={controlledStockpileValue(keyId)} handleChange={(e: React.ChangeEvent<HTMLInputElement> ) => updateStockpiles(e, keyId)} />
        </StockpileWrapper>
    )
}


function DustInput({controlledStockpileValue, updateStockpiles} 
    : Pick<I_PropsStockpileInput, "controlledStockpileValue" | "updateStockpiles">)
    : JSX.Element {

    return(
        <StockpileWrapper coloursCSS={resourceCSS.dust.badge} label={"Dust"} idStr={"id_dust"}>
            <InputNumberAsText 
                idStr={"id_dust"}
                cssStr={"w-36 py-1 px-2 font-normal"}
                value={ controlledStockpileValue('dust') }
                handleChange={(e) => updateStockpiles(e, 'dust')}
            />
        </StockpileWrapper>
    )
}


interface I_PropsInputNumberAsText {
    idStr : string, 
    value : number | string, 
    handleChange : (e : React.ChangeEvent<HTMLInputElement>) => void, 
    cssStr : string | undefined
};
function InputNumberAsText({idStr, value, handleChange, cssStr} 
    : I_PropsInputNumberAsText)
    : JSX.Element {

    let valueStr = value.toString();
    if(typeof value !== 'number' || isNaN(value)){
        valueStr = "0";
    }

    return <input 
                className={cssStr} 
                type="text" 
                inputMode="numeric" 
                pattern="^[0-9]+$|^$" 
                id={idStr} 
                value={valueStr} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} 
            />
}

interface I_PropsFormSectionLevels {
    handleLevelChange : (e : React.ChangeEvent<HTMLSelectElement>) => void, 
    gameState : T_GameState, 
    levels : T_Levels
};
function FormSectionLevels({handleLevelChange, gameState, levels} 
    : I_PropsFormSectionLevels)
    : JSX.Element {

    return (
        <section className={"mt-4"}>
            <FormSubHeading text={"Upgrades"} />
            <DetailsSummary summaryText={"Worker Levels"}>
                
                { workerUpgrades.map(ele => {
                    let initValue : string | undefined = getInitValueForLevelSelect(ele.optionsProps.name, gameState);
                    let keyName = ele.optionsProps.name.toLowerCase();
                    return <UnitLevelInput key={ele.id} 
                                keyName={keyName} 
                                idStr={ele.id} 
                                labelStr={ele.labelDisplay} 
                                initValue={initValue}
                                options={getUpgradeOptions(ele.optionsProps)} 
                                handleLevelChange={handleLevelChange} 
                                currentValue={levels[keyName as keyof typeof levels]}
                            />
                    })
                }
            </DetailsSummary>

            <DetailsSummary summaryText={"Egg Levels"}>
                { productionUpgrades.map((ele, idx) => {
                        let initValue : string | undefined  = getInitValueForLevelSelect(ele.optionsProps.name, gameState);
                        let keyName = ele.optionsProps.name.toLowerCase();
                        return <UnitLevelInput key={ele.id} 
                                    keyName={keyName} 
                                    idStr={ele.id} 
                                    labelStr={ele.labelDisplay} 
                                    initValue={initValue}
                                    options={getUpgradeOptions(ele.optionsProps)} 
                                    handleLevelChange={handleLevelChange} 
                                    currentValue={levels[keyName as keyof typeof levels]}
                                />
                    })
                }
           </DetailsSummary>

            <DetailsSummary summaryText={"Buff Levels"}>
                <UnitLevelInput
                    keyName={"speed"} 
                    idStr={"id_speed"} 
                    labelStr={"Speed"} 
                    initValue={gameState === null ? undefined : speedOptions[gameState.levels.speed].valueStr}
                    options={speedOptions} 
                    handleLevelChange={handleLevelChange} 
                    currentValue={levels.speed}
                />
                <UnitLevelInput
                    keyName={"dust"} 
                    idStr={"id_dust"} 
                    labelStr={"Dust"} 
                    initValue={gameState === null ? undefined : dustOptions[gameState.levels.dust].valueStr}
                    options={dustOptions} 
                    handleLevelChange={handleLevelChange} 
                    currentValue={levels.dust}
                />
            </DetailsSummary>
        </section>
    )
}


function getInitValueForLevelSelect(name : string, gameState : T_GameState)
    : string | undefined {

    let initValue : string | undefined = undefined;
    let keyName = name.toLowerCase();
    if(gameState !== null){
        let level = gameState.levels[keyName as keyof typeof gameState.levels];
        initValue = formatValueStr(name, level);
    }
    return initValue;
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
function UnitLevelInput({keyName, idStr, labelStr, initValue, options, handleLevelChange, currentValue} 
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


function DetailsSummary({summaryText, children} 
    : {summaryText : string, children : React.ReactNode})
    : JSX.Element {

    return (
        <details className={"mb-3 ml-2"}>
            <summary>{summaryText}</summary>
            <div className={"pl-4 flex flex-col gap-2 py-2"}>
                {children}
            </div>
        </details>
    )
}


const speedOptions = [
    {valueStr: "Speed_0", displayStr: "0%"},
    {valueStr: "Speed_1", displayStr: "-5%"},
    {valueStr: "Speed_2", displayStr: "-10%"},
    {valueStr: "Speed_3", displayStr: "-15%"},
    {valueStr: "Speed_4", displayStr: "-20%"},
    {valueStr: "Speed_5", displayStr: "-25%"},
]


const dustOptions = [
    {valueStr: "Dust_0", displayStr: "0%"},
    {valueStr: "Dust_1", displayStr: "25%"},
    {valueStr: "Dust_2", displayStr: "50%"},
    {valueStr: "Dust_3", displayStr: "75%"},
    {valueStr: "Dust_4", displayStr: "100%"},
    {valueStr: "Dust_5", displayStr: "125%"},
    {valueStr: "Dust_6", displayStr: "150%"},
]


const productionUpgrades = [
    { id: "id_Blue", labelDisplay: "Blue", optionsProps: { name: "Blue", max: 4 }},
    { id: "id_Green", labelDisplay: "Green", optionsProps: { name: "Green", max: 3 }},
    { id: "id_Red", labelDisplay: "Red", optionsProps: { name: "Red", max: 2 }},
    { id: "id_Yellow", labelDisplay: "Yellow", optionsProps: { name: "Yellow", max: 1 }},
]


const workerUpgrades = [
    { id: "id_Trinity", labelDisplay: "Trinity", optionsProps: { name: "Trinity", max: 10 }},
    { id: "id_Bronte", labelDisplay: "Bronte", optionsProps: { name: "Bronte", max: 10 }},
    { id: "id_Anne", labelDisplay: "Anne", optionsProps: { name: "Anne", max: 8 }},
    { id: "id_Petra", labelDisplay: "Petra", optionsProps: { name: "Petra", max: 10 }},
    { id: "id_Manny", labelDisplay: "Manny", optionsProps: { name: "Manny", max: 10 }},
    { id: "id_Tony", labelDisplay: "Tony", optionsProps: { name: "Tony", max: 10 }},
    { id: "id_Ruth", labelDisplay: "Ruth", optionsProps: { name: "Ruth", max: 8 }},
    { id: "id_Rex", labelDisplay: "Rex", optionsProps: { name: "Rex", max: 10 }},
]


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


function formatValueStr(name : string, numStr : number)
    : string {

    return `${ name.toLowerCase() }_${ numStr.toString() }`
}


function getUpgradeOptions({name, max} 
    : { name : string, max : number})
    : T_OptionData[] {

    let options = [];

    for(let i=0; i<=max; i++){
        let newOption = { valueStr: formatValueStr(name, i), displayStr: `${ i }` };
        options.push(newOption);
    }

    return options;
}



