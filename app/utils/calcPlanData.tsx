import { calcProductionRates } from './calcProductionRates';
import { calcStockpilesAdvancedByTime } from './calcStockpilesAdvancedByTime';
import { calcDustAtEndWithMaxDustProduction } from './calcResults';
import { MAX_TIME, OUT_OF_TIME } from './consts';
import { T_DATA_COSTS, T_DATA_KEYS, getProductionCostsFromJSON } from './getDataFromJSON';
import { isDuringOfflinePeriod, getOfflinePeriodAsTimeIDs } from './offlinePeriodHelpers';
import { calcProductionSettingsBeforeIndex as calcProductionSettingsBeforeIndex } from './productionSettingsHelpers';
import { T_SwitchAction, T_ProductionRates, T_PurchaseData, T_Levels, T_OfflinePeriod, T_UpgradeAction, T_ProductionSettings, T_Stockpiles, T_Action, T_SwitchData, T_ProductionSettingsNow, T_GameState, T_TimeData, T_TimeDataUnit } from './types';
import { deepCopy } from './utils';

interface I_CalcPlanData {
    gameState : T_GameState,
    actions : T_Action[],
    offlinePeriods : T_OfflinePeriod[],
    prodSettingsNow : T_ProductionSettingsNow | null,
}

type T_OutputPlanData = {
    purchaseData : T_PurchaseData[],
    switchData : T_SwitchData,
    productionSettingsBeforeNow : T_ProductionSettings,
    timeData : T_TimeData,
}

type T_SwitchLoop = {
    switchAction : T_SwitchAction,
    idx : number
}

type T_UpgradeLoop = {
    upgradeAction : T_UpgradeAction,
    idx : number
}

type T_ActiveOfflinePeriod = {
    startTimeID : number,
    endTimeID : number,
    levels : T_Levels,
    productionSettings : T_ProductionSettings
}


enum RateChangeMode {
    prodSettingsNow = 'prodSettingsNow',
    offlinePeriodEnd = 'offlinePeriodEnd',
    noChange = 'noChange',
}


export default function calcPlanData({ gameState, actions, offlinePeriods, prodSettingsNow } 
    : I_CalcPlanData)
    : T_OutputPlanData | null {

    if(gameState === null){
        return null;
    }

    let purchaseData : T_PurchaseData[] = [];
    let switchData : T_SwitchData = {};
    let timeData : T_TimeData = {};

    const productionSettingsBeforeFirstAction = calcProductionSettingsBeforeIndex({actions, index: 0});
    let productionSettingsBeforeNow : T_ProductionSettings = deepCopy(productionSettingsBeforeFirstAction);
    let flagFirstIsDone = false;

    const startedAt : Date = gameState.startTime;
    let stockpiles : T_Stockpiles = deepCopy(gameState.stockpiles);
    let levels : T_Levels = deepCopy(gameState.levels);
    let productionSettings : T_ProductionSettings = deepCopy(productionSettingsBeforeFirstAction);
    let productionRates : T_ProductionRates = calcProductionRates(levels, gameState.premiumInfo, productionSettings);
    let timeID = MAX_TIME > gameState.timeRemaining ? MAX_TIME - gameState.timeRemaining : 0;
    let activeOfflinePeriod : null | T_ActiveOfflinePeriod = null;

    try{
        for(let idx = 0; idx < actions.length; idx++){
            let {type, ...loopAction} = actions[idx];
            if(type === 'switch'){
                handleSwitchAction({ idx, switchAction: loopAction as T_SwitchAction });
            }
            else {
                handleUpgradeAction({ idx, upgradeAction: loopAction as T_UpgradeAction });
            }
        }

        if(activeOfflinePeriod !== null){
            timeID = updateForEndOfActiveOfflinePeriod(timeID);
        }

        return { purchaseData, switchData, productionSettingsBeforeNow, timeData };
    }
    catch(e){
        //console.log(e);
        return null;
    }


    function handleSwitchAction({ switchAction, idx }
        : T_SwitchLoop)
        : void {
    
        if(timeID >= OUT_OF_TIME){
            return;
        }
    
        // Either update production settings or stash the would-be update until the offline period ends
        let activeProductionSettings = activeOfflinePeriod === null ? productionSettings : activeOfflinePeriod.productionSettings;
        activeProductionSettings[switchAction.key as keyof typeof activeProductionSettings] = switchAction.to;

        // If the first upgrade has been purchased, this switch action hasn't happened yet. 
        // Add it to switchData so it can appear under the upgrades in the time group.
        if(flagFirstIsDone){
            addToSwitchData({switchAction, idx});
        } 
    }


    function handleUpgradeAction({ upgradeAction, idx }
        : T_UpgradeLoop)
        : void {

        if(upgradeAction.level <= levels[upgradeAction.key as keyof typeof levels]){
            return;
        }

        if(!flagFirstIsDone){
            Object.assign(productionSettingsBeforeNow, deepCopy(productionSettings));
        }

        if(timeID >= OUT_OF_TIME){
            handleOutOfTimeUpgradeAction({ upgradeAction, idx });
            return;
        }

        const costs = getProductionCostsFromJSON(upgradeAction.key as T_DATA_KEYS, upgradeAction.level);
        updateProductionRatesIfNotOffline();
        timeID = advanceStockpilesToReadyToPurchaseTimeID(costs);

        if(timeID >= OUT_OF_TIME){
            handleOutOfTimeUpgradeAction({ upgradeAction, idx });
        }
        else {
            handleInTimeUpgradeAction({upgradeAction, idx, costs});
        }
        
        if(!flagFirstIsDone){
            flagFirstIsDone = true;
        }
    }


    function addToSwitchData({switchAction, idx}
        : T_SwitchLoop){

        // Store switchData under either the current timeID or the timeID at the end of the offline period.
        let newSwitch = {
            key: switchAction.key,
            to: switchAction.to,
            actionsIdx: idx
        }
        
        const switchKey = activeOfflinePeriod === null ? timeID.toString() : activeOfflinePeriod.endTimeID.toString();
        if(!(switchKey in switchData)){
            switchData[switchKey] = [];
        }

        const idxSameWorker = switchData[switchKey].findIndex(ele => ele.key === newSwitch.key);
        if(idxSameWorker === -1){
            switchData[switchKey].push(newSwitch);
        }
        else{
            switchData[switchKey][idxSameWorker] = newSwitch;
        } 
    }

    
    function addToTimeData(keyTimeID : number) 
        : void {

        if(!(keyTimeID.toString() in timeData)){
            timeData[keyTimeID.toString() as keyof typeof timeData] = createTimeData(keyTimeID);
        }
        else {
            updateTimeData(keyTimeID);
        }
    }


    function advanceStockpilesToReadyToPurchaseTimeID( costs : T_DATA_COSTS, working = { timeID: timeID, prodSettingsNow: false, offlinePeriodEnd: false })
        : number {

        const productionTimeNeeded = calcProductionTimeNeededUsingSingleRate(costs, stockpiles, productionRates);
        let readyTimeID = working.timeID + productionTimeNeeded;
        const rateChangeMode = calcRateChangeMode(readyTimeID, working);

        if(rateChangeMode === RateChangeMode.prodSettingsNow && !working.prodSettingsNow){
            working.timeID = advanceStockpilesAndRatesToProdSettingsNow(working.timeID);
            working.prodSettingsNow = true;
            return advanceStockpilesToReadyToPurchaseTimeID(costs, working);
        }

        if(rateChangeMode === RateChangeMode.offlinePeriodEnd && !working.prodSettingsNow){
            working.timeID = updateForEndOfActiveOfflinePeriod(working.timeID);
            working.offlinePeriodEnd = true;
            return advanceStockpilesToReadyToPurchaseTimeID(costs, working);
        }

        if(readyTimeID > MAX_TIME){
            advanceStockpilesToValidTimeID({ startTimeID: working.timeID, endTimeID: OUT_OF_TIME });
            return OUT_OF_TIME;
        }

        if(activeOfflinePeriod === null && isDuringOfflinePeriod({timeID: readyTimeID, offlinePeriods, startedAt})){
            createActiveOfflinePeriod(readyTimeID);
        }

        advanceStockpilesToValidTimeID({ startTimeID: working.timeID, endTimeID: readyTimeID });

        return readyTimeID;
    }


    function advanceStockpilesAndRatesToProdSettingsNow(prevTimeID : number){
        if(prodSettingsNow === null){
            return timeID;
        }
        advanceStockpilesToValidTimeID({ startTimeID: prevTimeID, endTimeID: prodSettingsNow.timeID });
        Object.assign(productionSettings, prodSettingsNow.productionSettings);
        updateProductionRates();
        return prodSettingsNow.timeID;
    }


    function advanceStockpilesToValidTimeID({ startTimeID, endTimeID }
        : { startTimeID : number, endTimeID : number })
        : void {

        endTimeID = endTimeID > OUT_OF_TIME ? OUT_OF_TIME : endTimeID;
        const timeToAdvance = endTimeID - startTimeID;
        const newStockpiles = calcStockpilesAdvancedByTime(stockpiles, timeToAdvance, productionRates)
        Object.assign(stockpiles, newStockpiles);
    }


    function calcProductionTimeNeededUsingSingleRate(costsData : T_DATA_COSTS, stockpiles : T_Stockpiles, productionRates : T_ProductionRates)
        : number {

        let timeNeeded = 0;
        for(let c = 0; c < costsData.length; c++){
            const costEggKey = costsData[c].egg;
            const eggsNeeded = parseInt(costsData[c].quantity);
            const eggsInStockpile = stockpiles[costEggKey as keyof typeof stockpiles];

            if(eggsNeeded > eggsInStockpile){
                if(productionRates[costEggKey as keyof typeof productionRates] === 0){
                    return OUT_OF_TIME;
                }
                const eggShortfall = eggsNeeded - eggsInStockpile;
                const timeToProduce = Math.ceil(eggShortfall / productionRates[costEggKey as keyof typeof productionRates]);
                timeNeeded = timeNeeded > timeToProduce ? timeNeeded : timeToProduce;
            }
        }
        return timeNeeded;
    }


    function calcRateChangeMode(readyTimeID : number, handled : { prodSettingsNow : boolean, offlinePeriodEnd : boolean }){
        let rateChangeProdSettingsNow = !handled.prodSettingsNow && prodSettingsNowAppliesToThisPurchase({ prevTimeID: timeID, thisTimeID: readyTimeID });
        let rateChangeEndOfflinePeriod = !handled.offlinePeriodEnd && activeOfflinePeriod !== null && readyTimeID > activeOfflinePeriod.endTimeID;

        // If both apply to this upgrade, go in chronological order
        if(rateChangeProdSettingsNow && rateChangeEndOfflinePeriod && prodSettingsNow !== null && activeOfflinePeriod !== null){
            const earliestRateChange = Math.min(activeOfflinePeriod.endTimeID, prodSettingsNow.timeID);
            return earliestRateChange === prodSettingsNow.timeID ? 
                    RateChangeMode.prodSettingsNow 
                    : RateChangeMode.offlinePeriodEnd;
        }

        return  rateChangeProdSettingsNow ?
                    RateChangeMode.prodSettingsNow
                    : rateChangeEndOfflinePeriod ?
                        RateChangeMode.offlinePeriodEnd
                        : RateChangeMode.noChange;
    }


    function createActiveOfflinePeriod(timeID : number){
        const periodTimeIDs = getOfflinePeriodAsTimeIDs({timeID, offlinePeriods, startedAt});
        if(periodTimeIDs === null){
            return;
        }
        activeOfflinePeriod = {
            startTimeID: periodTimeIDs.start,
            endTimeID: periodTimeIDs.end,
            productionSettings: deepCopy(productionSettings),
            levels: deepCopy(levels),
        }
    }


    function createPurchaseData({ upgradeAction, idx, readyTimeID, purchaseTimeID }
        : T_UpgradeLoop & { readyTimeID : number, purchaseTimeID : number })
        : T_PurchaseData {

        let levelsAbove = activeOfflinePeriod === null ? deepCopy(levels) : deepCopy(activeOfflinePeriod.levels);
        levelsAbove[upgradeAction.key as keyof typeof levelsAbove] = upgradeAction.level - 1;
        return {
            ...upgradeAction,
            readyTimeID: readyTimeID,
            purchaseTimeID: purchaseTimeID,
            actionsIdx : idx,
            stockpiles: deepCopy(stockpiles),
            levelsAbove,
        }
    }


    function createTimeData(timeID : number) : T_TimeDataUnit {
        const allToDust = calcDustAtEndWithMaxDustProduction({timeID, stockpiles, levels, premiumInfo: gameState.premiumInfo, productionSettings});
        return {
            productionSettingsDuring: deepCopy(productionSettings),
            ratesDuring: deepCopy(productionRates),
            levelsAtEnd: deepCopy(levels),
            stockpilesAtEnd: deepCopy(stockpiles),
            allToDustAfter: allToDust,
            startOfflinePeriodTimeID: activeOfflinePeriod ? activeOfflinePeriod.startTimeID : null,
        }
    }


    function handleInTimeUpgradeAction({ upgradeAction, idx, costs } 
        : T_UpgradeLoop & { costs : T_DATA_COSTS })
        : void {

        payForUpgrade(costs);
        updateLevelsAfterPurchase(upgradeAction);

        const purchaseTimeID = activeOfflinePeriod === null ? timeID : activeOfflinePeriod.endTimeID;
        const purchaseDataElement : T_PurchaseData 
            = createPurchaseData({ 
                upgradeAction, 
                idx, 
                readyTimeID: timeID, 
                purchaseTimeID
            });
        purchaseData.push(purchaseDataElement);

        if(activeOfflinePeriod === null){
            addToTimeData(purchaseTimeID);
        }
    }

    function handleOutOfTimeUpgradeAction({ upgradeAction, idx } 
        : T_UpgradeLoop)
        : void {

        const OOTData = createPurchaseData({ 
            upgradeAction, 
            idx, 
            readyTimeID: OUT_OF_TIME, 
            purchaseTimeID: OUT_OF_TIME
        });
        purchaseData.push(OOTData);

        if(!(OUT_OF_TIME.toString() in timeData)){
            addToTimeData(OUT_OF_TIME);
        }
    }


    function payForUpgrade(costs : T_DATA_COSTS) 
        : void {

        for(let c = 0; c < costs.length; c++){
            let eggKey = costs[c].egg;
            let eggQty = parseInt(costs[c].quantity);

            if( eggQty > stockpiles[eggKey as keyof typeof stockpiles]){
                throw Error('Purchase failed, not enough eggs');
            }

            stockpiles[eggKey as keyof typeof stockpiles] -= eggQty;
        }
    }


    function prodSettingsNowAppliesToThisPurchase({prevTimeID, thisTimeID}
        : { prevTimeID : number, thisTimeID : number }){

        return  prodSettingsNow !== null 
                && !flagFirstIsDone
                && prodSettingsNow.timeID >= prevTimeID 
                && prodSettingsNow.timeID < thisTimeID;
    }


    function updateForEndOfActiveOfflinePeriod(prevTimeID : number)
        : number {

        if(activeOfflinePeriod === null){
            return timeID;
        }

        const endTimeID = activeOfflinePeriod.endTimeID;
        const validEndTimeID = endTimeID < OUT_OF_TIME ? endTimeID : OUT_OF_TIME;

        // Update everything that's needed in the timeData for the offline period, then store timeData
        advanceStockpilesToValidTimeID({ startTimeID: prevTimeID, endTimeID: validEndTimeID });
        if(endTimeID < OUT_OF_TIME){
            Object.assign(levels, activeOfflinePeriod.levels);
        }
        addToTimeData(validEndTimeID);

        // Complete the update, for everything that applies going forwards
        Object.assign(productionSettings, activeOfflinePeriod.productionSettings);
        updateProductionRates();

        activeOfflinePeriod = null;
        return validEndTimeID;
    }


    function updateLevelsAfterPurchase(upgradeAction : T_UpgradeAction)
        : void {

        const activeLevels = activeOfflinePeriod === null ? levels : activeOfflinePeriod.levels;
        activeLevels[upgradeAction.key as keyof typeof activeLevels] = upgradeAction.level;
    }


    function updateProductionRates(){
        Object.assign(productionRates, calcProductionRates(levels, gameState.premiumInfo, productionSettings));
    }


    function updateProductionRatesIfNotOffline()
        : void {

        if(isDuringOfflinePeriod({timeID, offlinePeriods, startedAt})){
            return;
        }
        updateProductionRates();
    }


    function updateTimeData(timeID : number){
        const timeDataNow = createTimeData(timeID);
        const oldTimeData = timeData[timeID.toString() as keyof typeof timeData];
        const oldProdSettings = deepCopy(oldTimeData.productionSettingsDuring);
        const oldRates = deepCopy(oldTimeData.ratesDuring);
        Object.assign(oldTimeData, timeDataNow);
        oldTimeData.productionSettingsDuring = oldProdSettings;
        oldTimeData.ratesDuring = oldRates;
    }
}

