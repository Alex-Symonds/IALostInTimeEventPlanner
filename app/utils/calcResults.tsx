import { MAX_TIME, OUT_OF_TIME, WIN_CONDITION } from "./consts";
import { calcProductionRates, calcProductionRate } from "./calcProductionRates";
import { calcStockpilesAdvancedByTime } from './calcStockpilesAdvancedByTime';
import { T_DATA_KEYS, getWorkerOutputsFromJSON } from "./getDataFromJSON";
import { T_Levels, T_SuggestionData, T_ResultData, T_Action, T_PurchaseData, T_PremiumInfo, T_ProductionSettings, T_AllToDustOutput, T_GameState, T_TimeGroup, T_Stockpiles } from "./types";
import { calcProductionSettingsBeforeIndex } from "./productionSettingsHelpers";
import { startingProductionSettings } from "./defaults";
import { convertDateToTimeID } from "./dateAndTimeHelpers";
import { deepCopy } from './utils';



interface I_CalcDustAtEnd extends 
    Pick<T_PurchaseData, "stockpiles">{
        levels : T_Levels,
        timeID : number,
        premiumInfo : T_PremiumInfo,
        productionSettings : T_ProductionSettings,
};
export function calcDustAtEndWithMaxDustProduction({timeID, stockpiles, levels, premiumInfo, productionSettings} 
    : I_CalcDustAtEnd)
    : T_AllToDustOutput {

    const remainingTime = MAX_TIME - timeID;
    if(remainingTime < 0){
        return { value: 0, rate: 0 };
    }
    
    const dustRate = calcMaxDustRate(levels, premiumInfo, productionSettings);
    return {
        value: Math.round(remainingTime * dustRate + stockpiles.dust),
        rate: dustRate
    };
}


export function calcMaxDustRate(levels : T_Levels, premiumInfo : T_PremiumInfo, productionSettings : T_ProductionSettings = startingProductionSettings){
    const dustySettings : T_ProductionSettings = productionSettingsAllToDust(productionSettings);
    return calcProductionRate('dust', levels, premiumInfo, dustySettings);
}


function productionSettingsAllToDust(productionSettings : T_ProductionSettings)
    : T_ProductionSettings {

    let dustySettings : T_ProductionSettings = deepCopy(productionSettings);
    for(const [key, _] of Object.entries(dustySettings)){
        const outputs = getWorkerOutputsFromJSON(key as T_DATA_KEYS);
        if(outputs !== null && outputs.includes('dust')){
            dustySettings[key as keyof typeof dustySettings] = 'dust';
        }
    }
    return dustySettings;
}



interface I_CalcResultOfPlan {
    gameState : T_GameState, 
    actions : T_Action[],
    timeIDGroups : T_TimeGroup[]
}
export function calcResultOfPlan({ gameState, actions, timeIDGroups } 
    : I_CalcResultOfPlan)
    : T_ResultData {

    let { timeRemaining, stockpiles, levels, productionSettings } 
        = calcStatusAfterLastInTime({ gameState, actions, timeIDGroups });

    let stockpilesAtEnd = calcStockpilesAtEnd({
        timeRemaining,
        stockpiles,
        levels,
        premiumInfo: gameState.premiumInfo,
        productionSettings 
    });
    let dustAtEnd = stockpilesAtEnd === null ? -1 : stockpilesAtEnd.dust;

    const hasAtLeastOneValidTimeGroup = timeIDGroups.length > 1 
                                        || (timeIDGroups.length === 1 && timeIDGroups[0].timeID < OUT_OF_TIME);

    let allToDust = hasAtLeastOneValidTimeGroup ?
        calcBestAllToDustFromTimeGroups({ timeIDGroups, dustAtEnd })
        : calcAllToDustAtEndFromNow({
            gameState,
            stockpiles,
            levels,
            productionSettings 
        });

    return {
        hasWon: dustAtEnd >= WIN_CONDITION,
        dustAtEnd,
        allToDust,
    }
}


function calcStatusAfterLastInTime({ gameState, actions, timeIDGroups } 
    : I_CalcResultOfPlan)
    : Pick<T_GameState, "levels" | "timeRemaining" | "stockpiles"> & { productionSettings : T_ProductionSettings}{

    const idxLastValid = findIndexLastTimeGroupInTime(timeIDGroups);
    if(idxLastValid === -1){
        return {
            timeRemaining: gameState.timeRemaining,
            stockpiles: gameState.stockpiles,
            levels: gameState.levels,
            productionSettings: calcProductionSettingsBeforeIndex({actions, index: null})
        }
    }

    const timeGroupData = timeIDGroups[idxLastValid];
    const productionSettings = deepCopy(timeGroupData.productionSettingsDuring);
    if(timeGroupData.switches.length > 0){
        for(let i = 0; i < timeGroupData.switches.length; i++){
            let loopSwitch = timeGroupData.switches[i];
            productionSettings[loopSwitch.key as keyof typeof productionSettings] = loopSwitch.to;
        }
    }

    return {
        timeRemaining: MAX_TIME - timeGroupData.timeID,
        stockpiles: timeGroupData.stockpilesAtEnd,
        levels: timeGroupData.levelsAtEnd,
        productionSettings 
    }
}


function findIndexLastTimeGroupInTime(timeGroups : T_TimeGroup[])
    : number {

    const maxValidTimeID = calcLastValidTimeIDInGroups(timeGroups);
    const index = timeGroups.findIndex((ele : T_TimeGroup) => ele.timeID === maxValidTimeID);
    return index;
}


function calcLastValidTimeIDInGroups(data : T_TimeGroup[])
    : number {

    return Math.max.apply(Math, data.filter(x => x.timeID <= MAX_TIME).map(ele => ele.timeID));
}


function calcStockpilesAtEnd({timeRemaining, stockpiles, levels, premiumInfo, productionSettings}
    : { productionSettings: T_ProductionSettings } & Pick<T_GameState, "timeRemaining" | "stockpiles"| "levels" | "premiumInfo">)
    : T_Stockpiles | null {

    let productionRates = calcProductionRates(levels, premiumInfo, productionSettings);
    let newStockpiles = calcStockpilesAdvancedByTime(stockpiles, timeRemaining, productionRates);
    return newStockpiles;
}


function calcBestAllToDustFromTimeGroups({ timeIDGroups, dustAtEnd }
    : Pick<I_CalcResultOfPlan, "timeIDGroups"> & { dustAtEnd : number } )
    : T_SuggestionData | null {

    let maxDustInfo = calcMaxDustInfo(timeIDGroups);
    if(maxDustInfo.max > dustAtEnd){
        return { 
            dust: maxDustInfo.max, 
            position: maxDustInfo.pos
        };
    }
    return null;
}


function calcAllToDustAtEndFromNow({gameState, stockpiles, levels, productionSettings}
    : Pick<I_CalcResultOfPlan, "gameState"> & any){

    const dustData = calcDustAtEndWithMaxDustProduction({
        timeID: convertDateToTimeID(gameState.timeEntered, gameState), 
        stockpiles, 
        levels, 
        premiumInfo: gameState.premiumInfo, 
        productionSettings
    });

    return {
        dust: dustData.value,
        position: -1,
    }
}


function calcMaxDustInfo(timeIDGroups : T_TimeGroup[])
    : { max : number, pos : number } {

    const idxLastPurchase = findIndexLastTimeGroupInTime(timeIDGroups);
    const validTimeGroups : T_TimeGroup[] = timeIDGroups.slice(0, idxLastPurchase + 1);
    const maxDust = Math.max(...validTimeGroups.map(ele => ele.allToDustAfter !== null ? ele.allToDustAfter.value : 0));
    const maxDustTimeGroupIdx = validTimeGroups.findIndex(ele => ele.allToDustAfter !== null && maxDust === ele.allToDustAfter.value);
    const timeGroupWithMaxDust = timeIDGroups[maxDustTimeGroupIdx];

    return {
        max: maxDust,
        pos: timeGroupWithMaxDust.startPos + timeGroupWithMaxDust.upgrades.length - 1
    };
}


