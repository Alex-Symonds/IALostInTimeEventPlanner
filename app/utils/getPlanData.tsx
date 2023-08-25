import UPGRADE_DATA from '../upgrades.json'; // This import style requires "esModuleInterop", see "side notes"

import { MAX_TIME, OUT_OF_TIME, deepCopy } from './consts';
import { convertOfflineTimeToTimeId, getStartTime} from './dateAndTimeHelpers';
import { getProductionSettings } from './productionSettings';

import { T_AllToDustOutput, T_ProductionRates, T_PremiumInfo, T_PurchaseData, T_Levels, T_OfflinePeriod, T_UpgradeAction, T_ProductionSettings, T_Stockpiles, T_Action, T_SwitchData, T_InterruptProductionSettings} from './types';

interface I_GetPlanData {
    gameState : any,
    actions : T_Action[],
    offlinePeriods : T_OfflinePeriod[],
    prodSettingsAtTop : T_InterruptProductionSettings | null
}

type T_OutputGetPlanData = {
    purchaseData : T_PurchaseData[],
    switchData : T_SwitchData,
}

export default function getPlanData({ gameState, actions, offlinePeriods, prodSettingsAtTop } 
    : I_GetPlanData)
    : T_OutputGetPlanData | null {

    if(gameState === null){
        return null;
    }

    let purchaseData : T_PurchaseData[] = [];
    let switchData : T_SwitchData = {};

    let stockpiles : T_Stockpiles = deepCopy(gameState.stockpiles);
    let levels : T_Levels = deepCopy(gameState.levels);
    let timeId : number = MAX_TIME - gameState.timeRemaining;
    let currentProdSettings : T_ProductionSettings = getProductionSettings({actions, index: 0});
    let isFirstOnDisplay = true;

    for(let idx = 0; idx < actions.length; idx++){

        let loopAction = actions[idx];
        if(loopAction.type === 'switch'){

            if(timeId >= OUT_OF_TIME){
                continue;
            }

            if('to' in loopAction){
                let switchObject = {
                    key: loopAction.key,
                    to: loopAction.to,
                    actionsIdx: idx
                }

                if(timeId.toString() in switchData){
                    switchData[timeId.toString() as keyof typeof switchData].push(switchObject);
                }
                else{
                    switchData[timeId.toString() as keyof typeof switchData] = [switchObject];
                }

                currentProdSettings[loopAction.key as keyof typeof currentProdSettings] = loopAction.to;
                continue;
            }
            else {
                // TODO: error handling
                return null;
            }
        }

        let {type, ...upgradeEle} = loopAction;
        if(!('level' in upgradeEle) || 'to' in upgradeEle){
            return null;
        }

        if(upgradeEle.level <= levels[upgradeEle.key as keyof typeof levels]){
            continue;
        }

        if(timeId === OUT_OF_TIME){
            let OOTElement = {
                ...upgradeEle,
                timeId: OUT_OF_TIME,
                stockpiles: deepCopy(stockpiles),
                actionsIdx : idx,
                levels: deepCopy(levels),
                allToDust: {value: 0, rate: 0},
                productionSettings: deepCopy(currentProdSettings),
                rates: calcProductionRates(levels, gameState.premiumInfo, currentProdSettings)
            }

            purchaseData.push(OOTElement);
            continue;
        }

        let startedAt : Date = getStartTime(gameState);
        let purchaseResult = 
            buyUpgrade({ 
                upgradeEle, 
                stockpiles, 
                timeId, 
                levels, 
                offlinePeriods, 
                productionSettings: currentProdSettings, 
                premiumInfo: gameState.premiumInfo, 
                startedAt,
                prodSettingsAtTop,
                isFirstOnDisplay
            });
        if(purchaseResult === null){
            return null;
        }

        if(isFirstOnDisplay && prodSettingsAtTop !== null && timeId < prodSettingsAtTop.timeId && purchaseResult.timeId > prodSettingsAtTop.timeId){
            currentProdSettings = deepCopy(prodSettingsAtTop.productionSettings);
            isFirstOnDisplay = false;
        }

        timeId = purchaseResult.timeId;
        stockpiles = purchaseResult.stockpiles;
        levels[actions[idx].key as keyof typeof levels] = upgradeEle.level;

        let dustAtEndFromHere : T_AllToDustOutput | null = calcDustAtEnd({timeId, stockpiles, levels, premiumInfo: gameState.premiumInfo, productionSettings: currentProdSettings});
        let planDataElement : T_PurchaseData = {
            ...upgradeEle,
            ...purchaseResult,
            actionsIdx : idx,
            levels: deepCopy(levels),
            allToDust: dustAtEndFromHere,
            productionSettings: deepCopy(currentProdSettings),
            rates: calcProductionRates(levels, gameState.premiumInfo, currentProdSettings)
        }
        purchaseData.push(planDataElement);
    }


    return { purchaseData, switchData };
}


interface I_BuyUpgrade extends 
    Pick<I_GetPlanData, "offlinePeriods" | "prodSettingsAtTop">,
    Pick<T_PurchaseData, "timeId" | "stockpiles" | "levels">{
    upgradeEle : T_UpgradeAction, 
    productionSettings : T_ProductionSettings, 
    premiumInfo : T_PremiumInfo,
    startedAt : Date,
    isFirstOnDisplay : boolean
}

function buyUpgrade({upgradeEle, stockpiles, timeId, levels, offlinePeriods, productionSettings, premiumInfo, startedAt, prodSettingsAtTop, isFirstOnDisplay} 
    : I_BuyUpgrade)
    : Pick<T_PurchaseData, "stockpiles" | "timeId"> | null {
        
    let data = UPGRADE_DATA[upgradeEle.key as keyof typeof UPGRADE_DATA];
    let upgradeData = data.upgrades[upgradeEle.level - 1];

    let workingTimeId = timeId;
    let workingStockpiles = deepCopy(stockpiles);

    for(let c = 0; c < upgradeData.costs.length; c++){
        let eggKey = upgradeData.costs[c].egg;
        let eggQty = parseInt(upgradeData.costs[c].quantity);
        let eggsInStockpile = workingStockpiles[eggKey as keyof typeof workingStockpiles];

        if(eggQty > eggsInStockpile){
            let purchaseTimeInfo = advanceToPurchaseTime({eggKey, eggQty, stockpiles: workingStockpiles, timeId: workingTimeId, offlinePeriods, levels, premiumInfo, productionSettings, startedAt, prodSettingsAtTop, isFirstOnDisplay});
            if(purchaseTimeInfo === null){
                return null;
            }
            workingTimeId = purchaseTimeInfo.timeReady;
            workingStockpiles = purchaseTimeInfo.stockpilesAtTimeReady;
        }
        
        if(workingTimeId < OUT_OF_TIME){
            workingStockpiles[eggKey as keyof typeof workingStockpiles] -= eggQty;
        }
    }

    return {
        stockpiles: workingStockpiles,
        timeId: workingTimeId
    }
}


interface I_AdvanceToTime extends 
    Pick<I_BuyUpgrade, "levels" | "offlinePeriods" | "premiumInfo" | "productionSettings" | "stockpiles" | "timeId" | "startedAt"> {
    eggKey : string, 
    eggQty : number, 
}

type T_OutputAdvanceToPurchaseTime = {
    timeReady : number,
    stockpilesAtTimeReady: T_Stockpiles,
    rates : T_ProductionRates
}

function advanceToPurchaseTime({eggKey, eggQty, stockpiles, timeId, offlinePeriods, levels, premiumInfo, productionSettings, startedAt, prodSettingsAtTop, isFirstOnDisplay} 
    : I_AdvanceToTime & Pick<I_BuyUpgrade, "prodSettingsAtTop"> & {isFirstOnDisplay : boolean})
    : T_OutputAdvanceToPurchaseTime | null {

    let advanceWithSingleProdRate = calcAdvanceToPurchaseTime({eggKey, eggQty, stockpiles, timeId, offlinePeriods, levels, premiumInfo, productionSettings, startedAt});
    if(advanceWithSingleProdRate === null){
        return null;
    }
    
    if(advanceWithSingleProdRate.timeReady >= OUT_OF_TIME){
        return advanceToEndOfEvent({stockpiles, levels, premiumInfo, productionSettings, timeId});
    }

    if( prodSettingsAtTop !== null 
        && isFirstOnDisplay
        && hasTwoProdRates({timeId, offlinePeriods, startedAt,
            interruptProdSettings: prodSettingsAtTop,  
            purchaseTimeId: advanceWithSingleProdRate.timeReady})
        && !isDuringOfflinePeriod(prodSettingsAtTop.timeId, offlinePeriods, startedAt)){

        return advanceWithTwoProdRates({levels, premiumInfo, productionSettings, stockpiles, timeId, prodSettingsAtTop, eggKey, eggQty, offlinePeriods, startedAt});
    }

    return advanceWithSingleProdRate;
}


function calcAdvanceToPurchaseTime({eggKey, eggQty, stockpiles, timeId, offlinePeriods, levels, premiumInfo, productionSettings, startedAt} 
    : I_AdvanceToTime)
    : T_OutputAdvanceToPurchaseTime | null {

    let eggsToProduce = eggQty - stockpiles[eggKey as keyof typeof stockpiles];
    let productionRates = calcProductionRates(levels, premiumInfo, productionSettings);
    if(productionRates === null){
        return null;
    }

    let timeToProduce = Math.ceil(eggsToProduce / productionRates[eggKey as keyof typeof productionRates]);
    let purchaseTimeId = nextOnlineTimeId(timeId + timeToProduce, offlinePeriods, startedAt);
    let timeToAdvance = purchaseTimeId - timeId;

    return {
        timeReady: purchaseTimeId,
        stockpilesAtTimeReady: advanceStockpilesByTime(stockpiles, timeToAdvance, productionRates),
        rates: productionRates
    }
}


function advanceToEndOfEvent({stockpiles, levels, premiumInfo, productionSettings, timeId} 
    : Pick<I_BuyUpgrade, "stockpiles" | "levels" | "premiumInfo" | "productionSettings" | "timeId">)
    : T_OutputAdvanceToPurchaseTime | null {

    let upToOutOfTime = advanceToTimeId({stockpiles, levels, premiumInfo, productionSettings,
        timeIdStart: timeId,
        timeIdEnd: OUT_OF_TIME
    });
    if(upToOutOfTime === null){
        return null;
    }
    return {
        timeReady: OUT_OF_TIME,
        stockpilesAtTimeReady: deepCopy(upToOutOfTime.stockpiles),
        rates: deepCopy(upToOutOfTime.rates),
    };
}


function advanceWithTwoProdRates({levels, premiumInfo, productionSettings, stockpiles, timeId, prodSettingsAtTop, eggKey, eggQty, offlinePeriods, startedAt} 
    : I_AdvanceToTime & Pick<I_BuyUpgrade, "prodSettingsAtTop">)
    : T_OutputAdvanceToPurchaseTime | null {

    if(prodSettingsAtTop == null){
        return null;
    }

    let initialProductionRates = calcProductionRates(levels, premiumInfo, productionSettings);
    if(initialProductionRates === null){
        return null;
    }

    let beforeSwitch = 
        advanceToTimeId({stockpiles, levels, premiumInfo, productionSettings,
            timeIdStart: timeId,
            timeIdEnd: prodSettingsAtTop.timeId
        })
    if(beforeSwitch === null){
        return null;
    }

    let advanceWithTwoProdRates = calcAdvanceToPurchaseTime({eggKey, eggQty, offlinePeriods, levels, premiumInfo, startedAt, 
        stockpiles: beforeSwitch.stockpiles, 
        timeId: prodSettingsAtTop.timeId, 
        productionSettings: prodSettingsAtTop.productionSettings
    });
    if(advanceWithTwoProdRates === null){
        return null;
    }

    return advanceWithTwoProdRates;  
}


interface I_AdvanceToTimeID extends Pick<I_AdvanceToTime, "stockpiles" | "levels" | "premiumInfo" | "productionSettings"> {
    timeIdStart : number,
    timeIdEnd : number,
}

function advanceToTimeId({stockpiles, timeIdStart, timeIdEnd, levels, premiumInfo, productionSettings}
    : I_AdvanceToTimeID)
    : null | Pick<T_OutputAdvanceToPurchaseTime, "rates"> & { stockpiles : T_Stockpiles }{

    let productionRates = calcProductionRates(levels, premiumInfo, productionSettings);
    if(productionRates === null){
        return null;
    }

    let timeToAdvance = timeIdEnd - timeIdStart;

    return {
        stockpiles: advanceStockpilesByTime(stockpiles, timeToAdvance, productionRates),
        rates: productionRates
    }
}

interface I_HasTwoProdRates extends 
    Pick<I_BuyUpgrade, "offlinePeriods" | "timeId"> {
    interruptProdSettings : T_InterruptProductionSettings,
    purchaseTimeId : number,
    startedAt : Date,
}
function hasTwoProdRates({interruptProdSettings, timeId, purchaseTimeId, offlinePeriods, startedAt} 
    : I_HasTwoProdRates) 
    : boolean {

    return interruptProdSettings !== null 
        && interruptProdSettings.timeId > timeId 
        && interruptProdSettings.timeId < purchaseTimeId
        && !isDuringOfflinePeriod(interruptProdSettings.timeId, offlinePeriods, startedAt)
}


export function advanceStockpilesByTime(stockpiles : T_Stockpiles, timeToAdvance : number, productionRates 
    : T_ProductionRates)
    : T_Stockpiles{

    let stockpilesAfter : T_Stockpiles = deepCopy(stockpiles);
    for(let rkey in stockpilesAfter){
        let producedDuringAddedTime = Math.round(timeToAdvance * productionRates[rkey as keyof typeof productionRates]);
        stockpilesAfter[rkey as keyof typeof stockpilesAfter] += producedDuringAddedTime;
    }
    return stockpilesAfter;
}


export function calcProductionRates(levels : T_Levels, premiumInfo : T_PremiumInfo, productionSettings 
    : T_ProductionSettings )
    : T_ProductionRates {

    return {
        blue: getProductionRate('blue', levels, premiumInfo, productionSettings),
        green: getProductionRate('green', levels, premiumInfo, productionSettings),
        red: getProductionRate('red', levels, premiumInfo, productionSettings),
        yellow: getProductionRate('yellow', levels, premiumInfo, productionSettings),
        dust: getProductionRate('dust', levels, premiumInfo, productionSettings),
    }
}

function getProductionRate(resourceKey : string, levels : T_Levels, premiumInfo : T_PremiumInfo, productionSettings : T_ProductionSettings)
    : number {

    let activeWorkerKeys = getActiveWorkerKeys(resourceKey, levels, productionSettings);
    if(activeWorkerKeys === null || activeWorkerKeys.length === 0){
        return 0;
    }

    let unbuffedProduction = listCurrentUnbuffedProduction(activeWorkerKeys, resourceKey, levels);
    if(unbuffedProduction === null || unbuffedProduction.length === 0){
        return 0;
    }

    return applyBuffsToProduction(unbuffedProduction, resourceKey, levels, premiumInfo);
}

function getActiveWorkerKeys(resourceKey : string, levels : T_Levels, productionSettings : T_ProductionSettings)
    : string[] | null {

    let activeWorkerKeys : string[] = [];
    for(let k in productionSettings){
        if (!(k in levels)){
            return null;
        }
        if(productionSettings[k as keyof typeof productionSettings] == resourceKey && levels[k as keyof typeof levels] > 0){
            activeWorkerKeys.push(k)
        }  
    }
    
    if(activeWorkerKeys.length == 0){
        return null;
    }
        
    return activeWorkerKeys
}

type T_UnbuffedProduction = {
    baseTime : string, 
    quantity : string
}

function listCurrentUnbuffedProduction(keys : string[], resourceKey : string, levels : T_Levels)
    : null | T_UnbuffedProduction[] {

    let productionData = [];
    for(let idx = 0; idx < keys.length; idx++){
        let workerKey = keys[idx];
        let data = UPGRADE_DATA[workerKey as keyof typeof UPGRADE_DATA];

        if('baseTime' in data){
            let upgradeIdx = levels[workerKey as keyof typeof levels] - 1;
            let resultsData = data.upgrades[upgradeIdx].results;
            let resourceIdx = null;
            if(resultsData[0].outputType === resourceKey){
                resourceIdx = 0
            }
            else if(resultsData[1].outputType === resourceKey){
                resourceIdx = 1;
            }

            if(resourceIdx === null){
                return null;
            }
            
            let thisElement = {
                'baseTime': data.baseTime,
                'quantity': resultsData[resourceIdx].quantity
            }
            productionData.push(thisElement)
        }
        else{
            return null
        }
    }

    return productionData;
}

function applyBuffsToProduction(unbuffedProduction : T_UnbuffedProduction[], resourceKey : string, levels : T_Levels, premiumInfo : T_PremiumInfo)
    : number {

    let totalProductionPerMinute = 0;
    let totalActionsPerMinute = 0;
    let speedMultiplier = calcSpeedMultiplier(levels, premiumInfo);

    for(let ubidx = 0; ubidx < unbuffedProduction.length; ubidx++){
        let secondsPerAction = parseFloat(unbuffedProduction[ubidx].baseTime) * speedMultiplier;
        let actionsPerMinute = 60 / secondsPerAction;
        totalActionsPerMinute += actionsPerMinute;

        let productionPerMinute = actionsPerMinute * parseInt(unbuffedProduction[ubidx].quantity);
        totalProductionPerMinute += productionPerMinute;
    }
    const DUST_KEY = 'dust';
    if(DUST_KEY === resourceKey){
        if(levels[DUST_KEY] > 0){
            let dustLevelAsIndex = levels[DUST_KEY] - 1;
            let dustMultiplierAsStr = UPGRADE_DATA[DUST_KEY].upgrades[dustLevelAsIndex].result;
            let dustMultiplier = parseFloat(dustMultiplierAsStr);
            totalProductionPerMinute *= 1 + dustMultiplier;
        }
    }
    else{
        let colourBuffLevel = levels[resourceKey as keyof typeof levels];
        if(colourBuffLevel > 0){
            let colourBuffProduction = colourBuffLevel * totalActionsPerMinute;
            totalProductionPerMinute += colourBuffProduction;
        }
        totalProductionPerMinute += premiumInfo.allEggs * totalActionsPerMinute;
    }

    return totalProductionPerMinute
}


function calcSpeedMultiplier(levels : T_Levels, premiumInfo : T_PremiumInfo)
    : number {

    let adBoost = premiumInfo.adBoost ? 0.25 : 0;

    const SPEED_KEY = 'speed';
    let upgradeBoost = 0;
    if(levels[SPEED_KEY] > 0){
        let upgradeIdx = levels[SPEED_KEY] - 1;
        let upgradeBoostAsStr = UPGRADE_DATA[SPEED_KEY].upgrades[upgradeIdx].result;
        upgradeBoost = parseFloat(upgradeBoostAsStr);
    }
    
    let multiplier = 1 - adBoost - upgradeBoost;
    return multiplier;
}


function nextOnlineTimeId(timeId : number, offlinePeriods : T_OfflinePeriod[], startedAt : Date)
    : number {

    let index = findIndexOfOfflinePeriod(timeId, offlinePeriods, startedAt);
    return index === -1 ? timeId : convertOfflineTimeToTimeId(offlinePeriods[index].end, startedAt);
}

function isDuringOfflinePeriod(timeId : number, offlinePeriods : T_OfflinePeriod[], startedAt : Date)
    : boolean {

    return findIndexOfOfflinePeriod(timeId, offlinePeriods, startedAt) !== -1;
}

function findIndexOfOfflinePeriod(timeId : number, offlinePeriods : T_OfflinePeriod[], startedAt : Date)
    : number {

    return offlinePeriods.findIndex(ele => {
        let start = convertOfflineTimeToTimeId(ele.start, startedAt);
        let end = convertOfflineTimeToTimeId(ele.end, startedAt);
        return timeId > start && timeId < end;
    });
}




interface T_CalcDustAtEnd extends 
    Pick<I_BuyUpgrade, "timeId" | "stockpiles" | "levels" | "premiumInfo" | "productionSettings">{};
export function calcDustAtEnd({timeId, stockpiles, levels, premiumInfo, productionSettings} 
    : T_CalcDustAtEnd)
    : T_AllToDustOutput | null{

    const remainingTime = MAX_TIME - timeId;

    if(remainingTime < 0){
        return null;
    }
    const dustySettings : T_ProductionSettings = productionSettingsAllToDust(productionSettings);
    const dustRate = getProductionRate('dust', levels, premiumInfo, dustySettings);

    return {
        value: Math.round(remainingTime * dustRate + stockpiles.dust),
        rate: dustRate
    };
}


function productionSettingsAllToDust(productionSettings : T_ProductionSettings)
    : T_ProductionSettings {

    let dustySettings : T_ProductionSettings = JSON.parse(JSON.stringify(productionSettings));
    for(const [key, value] of Object.entries(productionSettings)){
        if(key in dustySettings){
            let data = UPGRADE_DATA[key as keyof typeof UPGRADE_DATA];
            if('outputs' in data && data.outputs.includes('dust')){
                dustySettings[key as keyof typeof dustySettings] = 'dust';
            }
            else{
                dustySettings[key as keyof typeof dustySettings] = `${value}`;
            }
        }
    }
    return dustySettings;
}