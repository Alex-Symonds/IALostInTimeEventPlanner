import { calcDateWithTimeDisplayStr, convertTimeIDToTimeRemaining } from '../utils/dateAndTimeHelpers';
import { getUnitDataFromJSON, getMaxLevelFromJSON, T_DATA_KEYS } from "../utils/getDataFromJSON";
import { resourceCSS, toBillions, nbsp, maxedLevelCSS, capitalise } from '../utils/formatting';
import { T_Levels, T_GameState, T_Stockpiles } from '../utils/types';

import StockpilesDisplay from './subcomponents/stockpilesStrip';
import { EditButtonBox } from './sectionDisplayUserInput';
import { PlanMode } from '../utils/usePlanMode';


interface I_SectionGameState {
    gameState : T_GameState,
    mode : PlanMode | null,
}

export default function SectionGameState({ gameState, openEditForm, mode } 
    : Pick<I_SectionGameState, "gameState" | "mode" > & { openEditForm : () => void } )
    : JSX.Element {

    return  <div className={"px-2"}>
                <TimeAndPremiumStatus gameState={gameState} mode={mode} />

            { mode === PlanMode.active ?
                <div className={"flex flex-col items-start"}>
                    <StockpilesStatus stockpiles={gameState.stockpiles} />
                    <UpgradeLevels levels={gameState.levels} />
                </div>
                : null
            }
                
                <EditButtonBox openEditForm={openEditForm} label={undefined} />
            </div>
}


function TimeAndPremiumStatus({gameState, mode} 
    : Pick<I_SectionGameState, "gameState" | "mode">) 
    : JSX.Element {

    const remTimeObj = convertTimeIDToTimeRemaining(gameState.timeRemaining);
    return  <dl className={"grid [max-width:320px] grid-cols-[6.5rem_1fr_1fr] gap-1"}>

                { mode === PlanMode.active ?
                <>
                <GridRowWrapper title={"Updated"}>
                    <dd suppressHydrationWarning={true}>{calcDateWithTimeDisplayStr(gameState.timeEntered)}</dd>
                </GridRowWrapper>

                <GridRowWrapper title={"Remaining"}>
                    <dd>{remTimeObj === null ? "" : `${remTimeObj.days}d ${remTimeObj.hours}h ${remTimeObj.minutes}m`}</dd>
                </GridRowWrapper>
                </>
                : null 
                }

                { mode === PlanMode.plan ?
                <GridRowWrapper title={"Start Time"}>
                    <dd>{calcDateWithTimeDisplayStr(gameState.startTime)}</dd>
                </GridRowWrapper>
                : null 
                }

                <GridRowWrapper title={`All${nbsp()}Eggs`}>
                    <dd>+{gameState.premiumInfo.allEggs}</dd>
                </GridRowWrapper>

                <GridRowWrapper title={`Ad${nbsp()}Boost`}>
                    <div>
                    { gameState.premiumInfo.adBoost ? 
                        <dd className={"text-green-600"}>&#10004;<span className={"sr-only"}>yes</span></dd>
                        :
                        <dd className={"text-red-700"}>&#10060;<span className={"sr-only"}>no</span></dd>
                    }
                    </div>
                </GridRowWrapper>
            </dl>

}


function GridRowWrapper({title, children} : { title : string, children : React.ReactNode }){
    return  <>
                <dt className={"col-start-1 font-medium"}>{title}</dt>
                {children}
            </>
}


function StockpilesStatus({stockpiles}
    : { stockpiles : T_Stockpiles } )
    : JSX.Element {

    return  <div className={"mt-3 w-full"}>
                <dl className={`grid [max-width:320px] grid-cols-[6rem_1fr_4rem] px-2 py-1 mb-1 border-l-4 font-bold ${resourceCSS.dust.field}`}>
                    <dt>Dust</dt>
                    <dd>{stockpiles.dust.toLocaleString()}</dd>
                    <dd className={"justify-self-end"}>({toBillions(stockpiles.dust)})</dd>
                </dl>
                <StockpilesDisplay stockpiles={stockpiles} extraCSS={"gap-1"} />
            </div>
}


function UpgradeLevels({levels} 
    : { levels : T_Levels })
    : JSX.Element {

    let workers = calcFilteredLevelsData("Worker", levels);
    let eggs = calcFilteredLevelsData("Egg", levels);
    let buffs = calcFilteredLevelsData("Buff", levels);

    return(
        <div className={"mt-3 w-full"}>
            <p className={"sr-only"}>Upgrade Levels</p>
            <div className={"grid max-w-xs w-full justify-between grid-cols-[repeat(8,2rem)] grid-rows-[auto_auto]"}>
                {
                    workers.map(worker => {
                        return <LevelWithLabel key={worker.key} label={worker.displayStr} level={worker.level} max={worker.max} />
                    })
                }
                {
                    eggs.map(egg => {
                        return <LevelWithLabel key={egg.key} label={egg.displayStr} level={egg.level} max={egg.max} />
                    })
                }
                {
                    buffs.map((buff, idx) => {
                        let gridPosCSS = idx === 0 ?
                                            "col-start-7" 
                                            : idx === 1 ?
                                                "col-start-8"
                                                : "";
                        return <LevelWithLabel key={buff.key} label={buff.displayStr} level={buff.level} max={buff.max} gridPosCSS={gridPosCSS}/>
                    })
                }
            </div>
        </div>
    )
}


interface T_LevelWithLabel{
    label : string,
    level : number,
    max : number,
    gridPosCSS? : string
}
function LevelWithLabel({label, level, max, gridPosCSS} 
    : T_LevelWithLabel)
    : JSX.Element {

    if(gridPosCSS === undefined){
        gridPosCSS = "";
    }

    return (
        <div className={`flex flex-col items-center ${gridPosCSS}`}>
            <dt className={"px-2 pb-0.25 text-sm font-normal"}>{label}</dt>
            <Level level={level} max={max} extraCSS={"mx-0.5"}/>
        </div>
    )
}


function Level({level, max, extraCSS} 
    : Pick<T_LevelWithLabel, "level" | "max"> & { extraCSS? : string })
    : JSX.Element {

    const conditionalCSS = max === undefined || level < max ?
                            "border-gray-200 bg-gray-100 text-gray-900"
                            : maxedLevelCSS;

    return <dd className={`block w-6 py-1 rounded-lg border font-bold text-center text-xs ${conditionalCSS} ${extraCSS}`}>{level}</dd>
}


function calcFilteredLevelsData(typeStr : string, levels : T_Levels)
    : T_LevelData[] {

    let convertKeyToDisplayStr = typeStr === "Egg" ?
                            (str : string) => str.charAt(0)
                            :
                            (str : string) => capitalise(str.slice(0,2));

    return Object.keys(levels)
                    .filter(keyName => {
                        const data = getUnitDataFromJSON(keyName as T_DATA_KEYS);
                        return data.type === typeStr;
                    })
                    .map(keyName => {
                        return calcLevelsData(keyName, levels, convertKeyToDisplayStr);
                    });
}


type T_LevelData = {
    key : string,
    displayStr : string,
    level : number,
    max : number
}
function calcLevelsData(keyName : string, levels : T_Levels, keyToDisplayStr : (str : string) => string) 
    : T_LevelData{

    return {
            key: keyName,
            displayStr: keyToDisplayStr(keyName),
            level: levels[keyName as keyof typeof levels],
            max: getMaxLevelFromJSON(keyName as T_DATA_KEYS)
        }
}


export const exportForTesting = {
    UpgradeLevels,
}

