import { useState, Dispatch, SetStateAction } from 'react';

import { MAX_TIME, WIN_CONDITION, deepCopy } from "../utils/consts";
import { toBillions } from '../utils/formatting';
import { advanceStockpilesByTime, calcProductionRates } from '../utils/getPlanData';
import { getProductionSettings } from "../utils/productionSettings";
import { T_PurchaseData, T_GameState, T_Action, T_TimeGroup, T_ProductionSettings, T_Stockpiles } from "../utils/types";

import Tooltip from './tooltip';

interface I_ResultAtTop { 
    planData : T_PurchaseData[], 
    gameState : T_GameState, 
    actions : T_Action[],
    timeIdGroups : T_TimeGroup[]
}
export default function ResultAtTop({planData, gameState, actions, timeIdGroups} 
    : I_ResultAtTop)
    : JSX.Element {

    let resultOfPlan = calcResultOfPlan({planData, gameState, actions, timeIdGroups});
    let conditionalCSS = 
        resultOfPlan.hasWon ?
            "bg-green-700 text-white"
            : "bg-red-700 text-white";

    return(
        <div className={"sticky top-12 md:top-[7.5rem] shadow-md py-2 flex flex-col items-center w-full mb-4" + " " + conditionalCSS}>
            <div className={"font-bold text-lg"}>
                { resultOfPlan.hasWon ? "" : "NOT ENOUGH FOR " }1ST PRIZE
            </div>
            { resultOfPlan.allToDust === null ?
                <Result resultOfPlan={resultOfPlan} />
                : <ResultWithRec dustAtEnd={resultOfPlan.dustAtEnd} suggestionData={resultOfPlan.allToDust} />
            }
        </div>
    )
}


function Result({resultOfPlan} 
    : { resultOfPlan: T_ResultData })
    : JSX.Element {

    return  <div className={"text-base"}>
                { resultOfPlan.dustAtEnd.toLocaleString() } {`(${toBillions(resultOfPlan.dustAtEnd)})`}
            </div>
}


function ResultWithRec({dustAtEnd, suggestionData}
    : { dustAtEnd: number, suggestionData : T_SuggestionData })
    : JSX.Element {

    const [showTooltip, setShowTooltip] = useState(false);

    const suggestionProps = {
        isVisible: showTooltip,
        setVisibility: setShowTooltip,
        position: suggestionData.position
    }

    return  <div className={"relative flex flex-col"}>
                <ResultWithRecRow label={"now"} quantity={dustAtEnd} />
                <ResultWithRecRow label={"rec."} quantity={suggestionData.dust} suggestionProps={suggestionProps} />
            </div>
}


type T_SuggestionProps = { 
    isVisible : boolean, 
    setVisibility : Dispatch<SetStateAction<boolean>>,
    position : number 
}
function ResultWithRecRow({label, quantity, suggestionProps} 
    : { label : string, quantity : number, suggestionProps? : T_SuggestionProps}) 
    : JSX.Element {

    return  <div className={"grid grid-rows-1 [grid-template-columns:4rem_minmax(0,_1fr)_3rem_1.75rem]"}>
                <div className={"font-semibold"}>{ label }</div>
                <div className={"text-right"}>{ quantity.toLocaleString() }</div>
                <div className={"text-right"}>{`(${toBillions(quantity)})`}</div>
                { suggestionProps !== undefined ?
                    <div className={"text-right relative"}>
                        <button 
                            onClick={() => suggestionProps.setVisibility(prev => !prev)} 
                            className={"rounded-full w-5 h-5 bg-white hover:opacity-90 text-red-700 font-bold text-sm"}
                            >
                            ?
                        </button>

                    { suggestionProps !== undefined && suggestionProps.isVisible ?
                        <Tooltip posAndWidthCSS={"-top-9 right-0"} close={() => suggestionProps.setVisibility(false)}>
                            <div className={"text-xs font-bold min-w-max"}>
                                Switch all to dust after position {suggestionProps.position}
                            </div>
                        </Tooltip>
                        : null
                    }
                    </div>
                    : null
                }
            </div>
}


type T_SuggestionData = { dust : number, position : number };
type T_ResultData = {
    hasWon : boolean,
    dustAtEnd : number,
    allToDust : T_SuggestionData | null,
}
function calcResultOfPlan({planData, gameState, actions, timeIdGroups} 
    : I_ResultAtTop)
    : T_ResultData {

    let { timeRemaining, stockpiles, levels, productionSettings } 
        = calcStatusAtLastInTime({planData, gameState, actions, timeIdGroups});

    let stockpilesAtEnd = calcStockpilesAtEnd({
        timeRemaining,
        stockpiles,
        levels,
        premiumInfo: gameState.premiumInfo,
        productionSettings 
    });
    let dustAtEnd = stockpilesAtEnd === null ? -1 : stockpilesAtEnd.dust;

    let allToDust = calcBestAllToDust({planData, dustAtEnd});

    return {
        hasWon: dustAtEnd >= WIN_CONDITION,
        dustAtEnd,
        allToDust,
    }
}


function calcStatusAtLastInTime({planData, gameState, actions, timeIdGroups} 
    : I_ResultAtTop)
    : Pick<T_GameState, "levels" | "timeRemaining" | "stockpiles"> & { productionSettings : T_ProductionSettings}{

    let actionsIdx = findIndexLastActionInTime(planData, actions.length);
    let productionSettings = getProductionSettings({actions, index: actionsIdx});

    let timeRemaining = gameState.timeRemaining;
    let stockpiles = gameState.stockpiles;
    let levels = gameState.levels;

    if(planData.length > 0){
        const idxLastValid = findIndexLastTimeGroupInTime(timeIdGroups);
        const lastValidData = timeIdGroups[idxLastValid];

        timeRemaining = MAX_TIME - lastValidData.timeId;
        stockpiles = lastValidData.upgrades[lastValidData.upgrades.length - 1].stockpiles;
        levels = lastValidData.levels;

        if(lastValidData.switches.length > 0){
            for(let i = 0; i < lastValidData.switches.length; i++){
                let loopSwitch = lastValidData.switches[i];
                productionSettings[loopSwitch.key as keyof typeof productionSettings] = loopSwitch.to;
            }
        }
    }

    return {
        timeRemaining,
        stockpiles,
        levels,
        productionSettings 
    }
}


function findIndexLastActionInTime(planData : T_PurchaseData[], numActions : number)
    : number {

    if(planData.length > 0){
        const idxLastValid = getIndexLastUpgradeWithinTime(planData);
        if(idxLastValid < planData.length - 1){
            /*
            Finding the last in-time ACTION and the last in-time UPGRADE are two different things, 
            because upgrades are only one type of action: switch actions also exist. planData 
            can't "see" switch actions (not directly, only in the shadows they leave on the 
            actionsIdx property).

            So here's the plan: if we can find the planData of the first out-of-time upgrade, 
            we can take its actionsIdx and subtract 1. That will be last in-time actions index, 
            whether it's an upgrade or a switch.

            To find the planData for the first out-of-time upgrade, use the function to find the 
            planData index for the last in-time upgrade, then simply +1.
            */
            return planData[idxLastValid + 1].actionsIdx - 1;
        }
    }
    return numActions - 1;
}


function findIndexLastTimeGroupInTime(timeGroups : T_TimeGroup[])
    : number {

    const maxValidTimeId = getLastValidTimeIdInGroups(timeGroups);
    const index = timeGroups.findIndex((ele : T_TimeGroup) => ele.timeId === maxValidTimeId);
    return index;
}


function getLastValidTimeIdInGroups(data : T_TimeGroup[])
    : number {

    return Math.max.apply(Math, data.filter(x => x.timeId < MAX_TIME).map(ele => ele.timeId));
}


function calcStockpilesAtEnd({timeRemaining, stockpiles, levels, premiumInfo, productionSettings}
    : { productionSettings: T_ProductionSettings } & Pick<T_GameState, "timeRemaining" | "stockpiles"| "levels" | "premiumInfo">)
    : T_Stockpiles | null {

    let productionRates = calcProductionRates(levels, premiumInfo, productionSettings);
    if(productionRates === null){
        return null;
    }

    let newStockpiles = advanceStockpilesByTime(stockpiles, timeRemaining, productionRates);
    return newStockpiles;
}


function calcBestAllToDust({planData, dustAtEnd} 
    : Pick<I_ResultAtTop, "planData"> & { dustAtEnd : number } )
    : T_SuggestionData | null {

    if(planData.length > 0){
        let maxDustInfo = getMaxDustInfo(planData);
        if(maxDustInfo.max > dustAtEnd){
            return { 
                dust: maxDustInfo.max, 
                position: maxDustInfo.index + 1
            };
        }
    }
    return null;
}


function getMaxDustInfo(planData : T_PurchaseData[])
    : { max : number, index : number } {

    const idxLastPurchase = getIndexLastUpgradeWithinTime(planData);
    const deepCopyPlanData = deepCopy(planData);
    let upgradesWithinTime : T_PurchaseData[] = deepCopyPlanData.slice(0, idxLastPurchase + 1);
    let maxDust = Math.max(...upgradesWithinTime.map(ele => ele.allToDust !== null ? ele.allToDust.value : 0));
    return {
        max: maxDust,
        index: upgradesWithinTime.findIndex(ele => ele.allToDust !== null && maxDust === ele.allToDust.value)
    };
}

function getIndexLastUpgradeWithinTime(planData : T_PurchaseData[])
    : number {

    const maxValidTimeId = getLastValidTimeIdInPlanData(planData);
    const countMaxValidTimeId = planData.filter(ele => ele.timeId === maxValidTimeId).length;
    return planData.findIndex((ele : T_PurchaseData) => ele.timeId === maxValidTimeId) + countMaxValidTimeId - 1;
}

function getLastValidTimeIdInPlanData(planData : T_PurchaseData[])
    : number {
        
    return Math.max.apply(Math, planData.filter(x => x.timeId < MAX_TIME).map(ele => ele.timeId));
}