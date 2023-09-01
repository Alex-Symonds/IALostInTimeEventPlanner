import UPGRADE_DATA from '../upgrades.json';

import { MAX_TIME, WIN_CONDITION, deepCopy } from '../utils/consts';
import { calcDHMString, getMonthName, convertTimeIdToTimeRemaining, convertTimeIdToDate } from '../utils/dateAndTimeHelpers';
import { resourceCSS, nbsp, toThousands, toBillions } from "../utils/formatting";
import { T_AllToDustOutput, T_ProductionSettings, T_TimeGroup, T_Levels, T_Stockpiles, T_ProductionRates, T_GameState, T_PurchaseData } from "../utils/types";

import ProductionSettingsSummary from './productionSummary';


interface I_TimeGroupMore {
    data : T_TimeGroup,
    productionSettings : T_ProductionSettings,
    levels : T_Levels,
    remainingTimeGroups : T_TimeGroup[],
    gameState : T_GameState,
    borderColour : string,
    isDuringOfflinePeriod : boolean
}

export default function TimeGroupMore({data, productionSettings, levels, remainingTimeGroups, gameState, borderColour, isDuringOfflinePeriod} 
    : I_TimeGroupMore )
    : JSX.Element {

    const moreData = convertDataForDisplay(data, remainingTimeGroups);
    const leftHeadingWidth = "w-20";

    const offlineModeCSS = isDuringOfflinePeriod ?
                            "bg-greyBlue-700 text-white"
                            : "bg-white";
    const offlineModeHr = isDuringOfflinePeriod ?
                            ""
                            : "border-b border-gray-200 mt-2";

    return (
        <section className={"flex flex-col gap-2 border-l border-r px-2 pb-4" + " " + borderColour + " " + offlineModeCSS}>
            <div className={"mb-1" + " " + offlineModeHr}></div>
            <DustStatsSection moreData={moreData} gameState={gameState} leftHeadingWidth={leftHeadingWidth} isDuringOfflinePeriod={isDuringOfflinePeriod} />
            <ProductionSettingsSection productionSettings={productionSettings} levels={levels} leftHeadingWidth={leftHeadingWidth} isDuringOfflinePeriod={isDuringOfflinePeriod} />
            <ProductionTableSection moreData={moreData} gameState={gameState} leftHeadingWidth={leftHeadingWidth} isDuringOfflinePeriod={isDuringOfflinePeriod}/>
        </section>
    )
}


function TimeGroupMoreSubheading({text} 
    : {text : string})
    : JSX.Element {

    return <h4 className={"text-xs self-start font-bold"}>{text}</h4>;
}

interface I_ProductionSettingsSection extends Pick<I_TimeGroupMore, "isDuringOfflinePeriod" | "productionSettings"> {
    levels : T_Levels, 
    leftHeadingWidth : string,
}
function ProductionSettingsSection({productionSettings, levels, isDuringOfflinePeriod, leftHeadingWidth} 
    : I_ProductionSettingsSection)
    : JSX.Element {

    let extraCSS = leftHeadingWidth === "w-20" ?
                    "ml-20"
                    : "";

    return (
        <section className={"py-1 flex flex-col gap-1"}>
            <TimeGroupMoreSubheading text={"Settings"} />
            <ProductionSettingsSummary 
                productionSettings={productionSettings} 
                levels={levels} 
                extraCSS={extraCSS}
                wantHeadings={true} 
                isDuringOfflinePeriod={isDuringOfflinePeriod}
            />
        </section>
    )
}

interface I_ProductionTableSection extends 
    Pick<I_TimeGroupMore, "gameState" | "isDuringOfflinePeriod">,
    Pick<I_ProductionSettingsSection, "leftHeadingWidth"> { 
    moreData : T_MoreData,
}
function ProductionTableSection({moreData, gameState, leftHeadingWidth, isDuringOfflinePeriod} 
    : I_ProductionTableSection)
    : JSX.Element {

    function formatDoneAt(num : number, gameState : T_GameState){
        if(num === -1){
            return "-";
        }
        if(num === 0){
            return "done";
        }
        let date = convertTimeIdToDate(num, gameState);
        return [
                `${date.getDate()}`, 
                `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
            ];
    }

    const outerBorderColour = isDuringOfflinePeriod ?
                                "border-greyBlue-500"
                                : "border-neutral-200";

    return (
        <section>
            <TimeGroupMoreSubheading text={"Eggs"} />
            <table className={"text-xs border-collapse"}>
                <ProductionTableHead 
                    moreData={moreData}
                />
                <tbody className={""}>
                    <ProductionTableRow 
                        headingStr={"stockpile"} 
                        data={moreData.stockpiles} 
                        formatData={(num : number) => num > 10000 ? toThousands(num) : num.toLocaleString()}
                        leftHeadingWidth={leftHeadingWidth}
                        outerBorderColour={outerBorderColour}
                    />
                    <ProductionTableRow 
                        headingStr={"rate p/m"} 
                        data={moreData.rates} 
                        formatData={(num : number) => Math.round(num).toLocaleString()}
                        leftHeadingWidth={leftHeadingWidth}
                        outerBorderColour={outerBorderColour}
                    />
                    <ProductionTableRow 
                        headingStr={"by end"} 
                        data={moreData.totalAtRates} 
                        formatData={toThousands}
                        leftHeadingWidth={leftHeadingWidth}
                        outerBorderColour={outerBorderColour}
                    />
                    <ProductionTableRow 
                        headingStr={"needed"} 
                        data={moreData.spendRemaining} 
                        formatData={toThousands} 
                        leftHeadingWidth={leftHeadingWidth}
                        outerBorderColour={outerBorderColour}
                    />
                    <ProductionTableRow 
                        headingStr={"finish @"} 
                        data={moreData.doneAt}
                        formatData={(num : number) => formatDoneAt(num, gameState)}
                        leftHeadingWidth={leftHeadingWidth} 
                        outerBorderColour={outerBorderColour}
                    />
                </tbody>
            </table>
        </section>
    )
}


function ProductionTableHead({moreData} 
    : { moreData : T_MoreData })
    : JSX.Element {

    return(
        <thead>
            <tr>
                <th></th>
                {
                    Object.keys(moreData.stockpiles).map(keyName => {
                        return  <th key={keyName} 
                                    className={"font-normal border w-12" + " " + resourceCSS[keyName as keyof typeof resourceCSS].badge}
                                    >
                                    {keyName.charAt(0)}
                                </th>
                    })
                }
            </tr>
        </thead>
    )
}

interface I_ProductionTableRow extends 
    Pick<I_ProductionSettingsSection, "leftHeadingWidth">{
    headingStr : string, 
    data : T_ResourceColours, 
    formatData? : (num : number) => string | string[], 
    outerBorderColour : string
}
function ProductionTableRow({headingStr, data, formatData, leftHeadingWidth, outerBorderColour} 
    : I_ProductionTableRow)
    : JSX.Element {

    function handleFormattedData(key : string) : string | JSX.Element{
        if(formatData === undefined){
           return ""; 
        }
        let formatted = formatData(data[key as keyof typeof data]);
        if(typeof formatted === 'string'){
            return formatted;
        }
        return  <div>
                    <div>{formatted[0].padStart(2, "0")}</div>
                    <div>{formatted[1]}</div>
                </div>
    }

    return  <ProductionTableRowWrapper 
                headingStr={headingStr} 
                leftHeadingWidth={leftHeadingWidth} 
                outerBorderColour={outerBorderColour}
                >
                {
                    Object.keys(data).map(key => {
                        if(key === 'dust'){
                            return null;
                        }

                        let contents = formatData ? 
                                        handleFormattedData(key)
                                        : data[key as keyof typeof data].toLocaleString()

                        let alignCSS = contents === "done" ? "text-center" : "text-right";

                        return <ProductionTableCell key={key}
                                extraCSS={resourceCSS[key as keyof typeof resourceCSS].cell + " " + alignCSS}
                            > 
                            { formatData ? 
                                handleFormattedData(key)
                                : data[key as keyof typeof data].toLocaleString()
                            } 
                        </ProductionTableCell>
                    })
                }
            </ProductionTableRowWrapper>
}



function ProductionTableRowWrapper({headingStr, leftHeadingWidth, outerBorderColour, children} 
    : Pick<I_ProductionTableRow, "headingStr" | "leftHeadingWidth" | "outerBorderColour"> & { children : React.ReactNode })
    : JSX.Element {

    return (
        <tr className={""}>
            <th className={"text-xs pr-1 font-normal text-right border" + " " + leftHeadingWidth + " " + outerBorderColour}>
                {headingStr}
            </th>
            {children}
        </tr>
    )
}


function ProductionTableCell({extraCSS, children} 
    : { extraCSS : string, children : React.ReactNode })
    : JSX.Element {

    return  <td className={"px-1 border text-xs text-black" + " " + extraCSS}>
                {children}
            </td>
}


interface I_DustStatsSection extends 
    Pick<I_TimeGroupMore, "gameState" | "isDuringOfflinePeriod">,
    Pick<I_ProductionTableSection, "leftHeadingWidth" | "moreData">{}


function DustStatsSection({moreData, gameState, leftHeadingWidth, isDuringOfflinePeriod} 
    : I_DustStatsSection)
    : JSX.Element {

    const subheadingCSS = isDuringOfflinePeriod ?
                            "text-neutral-300"
                            : "text-neutral-600";

    function finishTimeAsStr(){
        function convertTimeIdToSt(){
            let date = convertTimeIdToDate(moreData.finishAt, gameState);
            let dateStr = date.getDate().toString().padStart(2, "0");
            let timeStr = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
           
            let DHM = convertTimeIdToTimeRemaining(MAX_TIME - moreData.finishAt);
            return `${calcDHMString(DHM)} ${dateStr}${nbsp()}${getMonthName(date.getMonth())}${nbsp()}${timeStr}`;
        }

        return moreData.finishAt === -1 ?
                "-"
                : convertTimeIdToSt();
    }

    return(
        <section>
            <TimeGroupMoreSubheading text={"Dust"} />
            <div className={"flex flex-col gap-2 mt-1"}>
                <DustRowWrapper>
                    <DustSubheading leftHeadingWidth={leftHeadingWidth}>
                        Dust now
                    </DustSubheading>
                    <DustRowContentWrapper>
                        {`${moreData.dustNow.toLocaleString()}`}
                    </DustRowContentWrapper>
                </DustRowWrapper>
                <DustRowWrapper>
                    <DustSubheading leftHeadingWidth={leftHeadingWidth}>
                        Projected <span className={subheadingCSS}>(all&nbsp;to&nbsp;dust)</span>
                    </DustSubheading>
                    <DustRowContentWrapper>
                        <div>{toBillions(moreData.allToDust.value)}</div>
                        <div>({moreData.allToDust.value.toLocaleString()})</div>
                    </DustRowContentWrapper>
                </DustRowWrapper>
                <DustRowWrapper>
                    <DustSubheading leftHeadingWidth={leftHeadingWidth}>
                        Finish at
                    </DustSubheading>
                    <DustRowContentWrapper>
                        {finishTimeAsStr()}
                    </DustRowContentWrapper>
                </DustRowWrapper>
            </div>
        </section>
    )
}

function DustRowWrapper({children} 
    : {children : React.ReactNode})
    : JSX.Element {

    return  <div className={"flex text-xs text-right"}>
                {children}
            </div>
}

function DustSubheading({leftHeadingWidth, children} 
    : Pick<I_ProductionSettingsSection, "leftHeadingWidth"> & {children : React.ReactNode})
    : JSX.Element {

    return  <h5 className={"text-xs pr-2 font-normal" + " " + leftHeadingWidth}>
                {children}
            </h5>
}

function DustRowContentWrapper({children} 
    : {children : React.ReactNode})
    : JSX.Element {

    return  <div className={"flex flex-col items-end justify-center bg-violet-50 w-32 px-1 py-0.5 text-black"}>
                {children}
            </div>
}


type T_MoreData = {
    stockpiles : T_ResourceColours,
    rates : T_ResourceColours,
    spendRemaining : T_ResourceColours,
    totalAtRates : T_ResourceColours,
    doneAt : T_ResourceColours,
    dustNow : number,
    allToDust : T_AllToDustOutput,
    finishAt : number,
}

type T_ResourceColours = {
    blue : number,
    green : number,
    red : number,
    yellow : number,
}


function convertDataForDisplay(data : T_TimeGroup, remainingTimeGroups : T_TimeGroup[])
    : T_MoreData {

    let lastUpgrade = data.upgrades[data.upgrades.length - 1];
    let rates = deepCopy(lastUpgrade.rates);
    let spendRemaining = calcSpendRemaining(remainingTimeGroups);
    let eggStockpiles = deepCopy(lastUpgrade.stockpiles);
    delete eggStockpiles.dust;
    let totalAtRates = calcTotalAtRates(rates, lastUpgrade.stockpiles, data.timeId);
    let doneAt = calcTimeIdProductionIsDone(spendRemaining, rates, lastUpgrade.stockpiles, totalAtRates, data.timeId);
    let finishAt = calcTimeDustDone(lastUpgrade, data.timeId);

    return {
        stockpiles: eggStockpiles,
        rates: lastUpgrade.rates,
        spendRemaining: spendRemaining,
        totalAtRates,
        doneAt,
        dustNow: lastUpgrade.stockpiles.dust,
        allToDust: lastUpgrade.allToDust ?? {value: 0, rate: 0},
        finishAt
    }
}


function calcSpendRemaining(timeGroups : T_TimeGroup[])
    : T_ResourceColours {

    const initAccumulator : T_ResourceColours = {blue: 0, green: 0, red: 0, yellow: 0};

    return timeGroups.reduce((mainAcc, currentTimeGroup) => {

        let groupResult = currentTimeGroup.upgrades.reduce((groupAcc, currentUpgrade) => {
            let data = UPGRADE_DATA[currentUpgrade.key as keyof typeof UPGRADE_DATA].upgrades[currentUpgrade.level - 1];
            for(let i = 0; i < data.costs.length; i++){
                let keyName = data.costs[i].egg;
                groupAcc[keyName as keyof typeof groupAcc] += parseInt(data.costs[i].quantity);
            }
            return groupAcc;
        }, deepCopy(initAccumulator));
        
        for(const [k,v] of Object.entries(groupResult)){
            mainAcc[k as keyof typeof mainAcc] += v;
        }
        return mainAcc;

    }, deepCopy(initAccumulator));
}


function calcTotalAtRates(rates : T_ProductionRates, stockpiles : T_Stockpiles, timeId : number)
    : T_ResourceColours{

    let minutesRemaining = MAX_TIME - timeId;
    return {
        blue: Math.floor(minutesRemaining * rates.blue) + stockpiles.blue,
        green: Math.floor(minutesRemaining * rates.green) + stockpiles.green,
        red: Math.floor(minutesRemaining * rates.red) + stockpiles.red,
        yellow: Math.floor(minutesRemaining * rates.yellow) + stockpiles.yellow,
    }
}


function calcTimeIdProductionIsDone(spendRemaining : T_ResourceColours, rates : T_ProductionRates, stockpiles : T_Stockpiles, projectedTotal : T_ResourceColours, timeId : number)
    : T_ResourceColours {

    return Object.keys(spendRemaining).reduce((attrs, key) => {
        let projected = projectedTotal[key as keyof typeof projectedTotal];
        let current = stockpiles[key as keyof typeof stockpiles];
        let goal = spendRemaining[key as keyof typeof spendRemaining];
        let rate = rates[key as keyof typeof rates];

        return {
            ...attrs,
            [key]: projected < goal ? 
                    -1
                    : current > goal ?
                        0
                        : Math.round((goal - current) / rate) + timeId
        }
    }, { blue: -1, green: -1, red: -1, yellow: -1 })
}


function calcTimeDustDone(lastUpgrade : T_PurchaseData, timeId : number)
    : number {

    let finishTime : number = -1;
    if(lastUpgrade.allToDust !== null){
        if(lastUpgrade.allToDust.value > WIN_CONDITION){
            let rate = lastUpgrade.allToDust.rate;
            let difference = WIN_CONDITION - lastUpgrade.stockpiles.dust;
            let timeIdAtFinish = Math.round(difference / rate) + timeId;
            return timeIdAtFinish;
        }
    }
    return finishTime;
}