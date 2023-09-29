import { calcDateDisplayStr, convertTimeIDToTimeRemaining } from '../utils/dateAndTimeHelpers';
import { maxedLevelCSS, capitalise, resourceCSS, toBillions, nbsp } from '../utils/formatting';
import { T_GameState, T_Levels, T_Stockpiles } from '../utils/types';

import StockpilesDisplay from './subcomponents/stockpilesStrip';
import { DisplayInputSection, EditButtonBox } from './sectionDisplayUserInput';
import { T_DATA_KEYS, getMaxLevelFromJSON, getUnitDataFromJSON } from '../utils/getDataFromJSON';


interface I_SectionGameState {
    gameState : T_GameState,
    setGameState : React.Dispatch<React.SetStateAction<T_GameState>>
}

export default function SectionGameState({gameState, openEditForm} 
    : Pick<I_SectionGameState, "gameState"> & { openEditForm : () => void } )
    : JSX.Element {

    return(
        <DisplayInputSection title={"Game Status"}>
            <div className={"px-2"}>
                <TimeAndPremiumStatus gameState={gameState} />

                <div className={"flex flex-col items-start"}>
                    <StockpilesStatus stockpiles={gameState.stockpiles} />
                    <LevelsStatus levels={gameState.levels} />
                </div>
                
                <EditButtonBox openEditForm={openEditForm} label={undefined} />
            </div>
        </DisplayInputSection>
    )
}


function TimeAndPremiumStatus({gameState} 
    : Pick<I_SectionGameState, "gameState">) 
    : JSX.Element {

    const remTimeObj = convertTimeIDToTimeRemaining(gameState.timeRemaining);
    return  <div className={"gameStateDisplayTimeAndPremium gap-1"}>

                <GridRowWrapper title={"Remaining"}>
                    <div>{remTimeObj === null ? "" : `${remTimeObj.days}d ${remTimeObj.hours}h ${remTimeObj.minutes}m`}</div>
                </GridRowWrapper>

                <GridRowWrapper title={"Started"}>
                    <div>{calcDateDisplayStr(gameState.startTime)}</div>
                </GridRowWrapper>

                <GridRowWrapper title={"Entered"}>
                    <div suppressHydrationWarning={true}>{calcDateDisplayStr(gameState.timeEntered)}</div>
                </GridRowWrapper>

                <GridRowWrapper title={`All${nbsp()}Eggs`}>
                    <div>+{gameState.premiumInfo.allEggs}</div>
                </GridRowWrapper>

                <GridRowWrapper title={`Ad${nbsp()}Boost`}>
                    <div>
                    { gameState.premiumInfo.adBoost ? 
                        <div className={"text-green-600"}>&#10004;<span className={"sr-only"}>yes</span></div>
                        :
                        <div className={"text-red-700"}>&#10060;<span className={"sr-only"}>no</span></div>
                    }
                    </div>
                </GridRowWrapper>
            </div>

}


function GridRowWrapper({title, children} : { title : string, children : React.ReactNode }){
    return  <>
                <div className={"col-start-1 font-medium"}>{title}</div>
                {children}
            </>
}


function StockpilesStatus({stockpiles}
    : { stockpiles : T_Stockpiles } )
    : JSX.Element {

    return  <Subsection subheading={undefined}>
                <div className={"gameStateDisplayDust px-2 py-1 mb-1 border-2 font-bold" + " " + resourceCSS.dust.badge}>
                    <div>Dust</div>
                    <div>{stockpiles.dust.toLocaleString()}</div>
                    <div className={"justify-self-end"}>({toBillions(stockpiles.dust)})</div>
                </div>
                <StockpilesDisplay stockpiles={stockpiles} extraCSS={"gap-1"} />
            </Subsection>
}


function LevelsStatus({levels} 
    : { levels : T_Levels })
    : JSX.Element {

    let workers = getFilteredLevelsData("Worker", levels);
    let eggs = getFilteredLevelsData("Egg", levels);
    let buffs = getFilteredLevelsData("Buff", levels);

    return(
        <Subsection subheading={undefined}>
        <div className={"grid max-w-xs w-full justify-between statusLevels"}>
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

    </Subsection>
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
        <div className={"flex flex-col items-center" + " " + gridPosCSS}>
            <div className={"px-2 pb-0.25 text-sm font-normal"}>{label}</div>
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

    return <span className={"block w-6 py-1 rounded-lg border font-bold text-center text-xs" + " " + conditionalCSS + " " + extraCSS}>{level}</span>
}


function getFilteredLevelsData(typeStr : string, levels : T_Levels)
    : T_LevelData[] {

    let keyToDisplayStr = typeStr === "Egg" ?
                            (str : string) => capitalise(str.charAt(0))
                            :
                            (str : string) => capitalise(str.slice(0,2));

    return Object.keys(levels)
                    .filter(keyName => {
                        const data = getUnitDataFromJSON(keyName as T_DATA_KEYS);
                        return data.type === typeStr;
                    })
                    .map(keyName => {
                        return getLevelsData(keyName, levels, keyToDisplayStr);
                    });
}


type T_LevelData = {
    key : string,
    displayStr : string,
    level : number,
    max : number
}
function getLevelsData(keyName : string, levels : T_Levels, keyToDisplayStr : (str : string) => string) 
    : T_LevelData{

    return {
            key: keyName,
            displayStr: keyToDisplayStr(keyName),
            level: levels[keyName as keyof typeof levels],
            max: getMaxLevelFromJSON(keyName as T_DATA_KEYS)
        }
}


function Subsection({subheading, children} 
    : { subheading? : string, children : React.ReactNode })
    : JSX.Element {

    return(
        <div className={"mt-3 w-full"}>
            { subheading !== undefined && subheading !== null ?
                <Subheading text={subheading} />
                : null
            }
            {children}
        </div>
    )
}


function Subheading({text} 
    : {text : string})
    : JSX.Element {

    return <h3 className={"font-bold text-md"}>{text}</h3>
}
