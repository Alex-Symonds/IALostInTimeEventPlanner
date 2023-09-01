import calcEndInfo from '../utils/calcEndInfo';
import { MAX_TIME, WIN_CONDITION } from "../utils/consts";
import { toBillions } from '../utils/formatting';
import { getProductionSettings } from "../utils/productionSettings";
import { T_PurchaseData, T_GameState, T_Action, T_TimeGroup } from "../utils/types";


interface I_ResultAtTop { 
    planData : T_PurchaseData[], 
    gameState : T_GameState, 
    actions : T_Action[],
    timeIdGroups : T_TimeGroup[]
}
export default function ResultAtTop({planData, gameState, actions, timeIdGroups} 
    : I_ResultAtTop)
    : JSX.Element {

    let dustAtEnd : number = calcDustAtEnd({planData, gameState, actions, timeIdGroups});
    let tipStr : string | null =  getTipString({planData, dustAtEnd});
    let hasWon : boolean = dustAtEnd >= WIN_CONDITION;
    let conditionalCSS : string = 
        hasWon ?
            "bg-green-700 text-white"
            : "bg-red-700 text-white";

    return(
        <div className={"sticky top-12 md:top-[7.5rem] shadow-md py-2 flex flex-col items-center w-full" + " " + conditionalCSS}>
            <div className={"font-bold text-lg"}>
                { hasWon ? "WIN " : "LOSS " } PROJECTED
            </div>

            <div className={"text-base"}>
                { dustAtEnd.toLocaleString() } {`(${toBillions(dustAtEnd)})`}
            </div>
            { tipStr !== null ? 
                <div className={"text-sm mt-1"}>
                    { tipStr }
                </div>
                : null
            }
        </div>
    )
}


function calcDustAtEnd({planData, gameState, actions, timeIdGroups} 
    : I_ResultAtTop) 
    : number {

    let actionsIdx : number = findIndexLastActionInTime(planData, actions.length);
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

    let endInfo = calcEndInfo({
        timeRemaining: timeRemaining,
        stockpiles: stockpiles,
        levels: levels,
        premiumInfo: gameState.premiumInfo,
        productionSettings 
    });

    return endInfo?.stockpiles?.dust ?? 0;
}


function getTipString({planData, dustAtEnd} 
    : Pick<I_ResultAtTop, "planData"> & { dustAtEnd : number } )
    : string | null {

    let tipStr : string | null = null;
    if(planData.length > 0){
        let maxDustInfo = getMaxDustInfo(planData);
        tipStr = maxDustInfo.max > dustAtEnd ? 
                        `Current plan best: switch all to dust after #${maxDustInfo.index + 1} for ${ maxDustInfo.max.toLocaleString() } (${toBillions(maxDustInfo.max)})`
                        : tipStr;
    }
    return tipStr;
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

            So here's the plan: find the planData of the first out-of-time upgrade. Take its 
            actionsIdx and subtract 1. That will be last in-time actions index, whether it's 
            an upgrade or a switch.

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


function getMaxDustInfo(planData : T_PurchaseData[])
    : {max : number, index : number} {

    const idxLastPurchase = getIndexLastUpgradeWithinTime(planData);
    const deepCopyPlanData = JSON.parse(JSON.stringify(planData));
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