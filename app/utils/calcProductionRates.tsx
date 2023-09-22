import { T_DATA_KEYS, getBuffResultFromJSON, getUnitDataFromJSON } from './getDataFromJSON';
import {
    T_ProductionRates, 
    T_PremiumInfo, 
    T_Levels, 
    T_ProductionSettings
} from './types';


export function calcProductionRates(levels : T_Levels, premiumInfo : T_PremiumInfo, productionSettings 
    : T_ProductionSettings )
    : T_ProductionRates {

    return {
        blue: calcProductionRate('blue', levels, premiumInfo, productionSettings),
        green: calcProductionRate('green', levels, premiumInfo, productionSettings),
        red: calcProductionRate('red', levels, premiumInfo, productionSettings),
        yellow: calcProductionRate('yellow', levels, premiumInfo, productionSettings),
        dust: calcProductionRate('dust', levels, premiumInfo, productionSettings),
    }
}


export function calcProductionRate(resourceKey : keyof T_ProductionRates, levels : T_Levels, premiumInfo : T_PremiumInfo, productionSettings : T_ProductionSettings)
    : number {

    const activeWorkerKeys = getActiveWorkerKeys(resourceKey, levels, productionSettings);
    if(activeWorkerKeys === null || activeWorkerKeys.length === 0){
        return 0;
    }

    const unbuffedProductionData = retrieveActiveUnbuffedProductionData(activeWorkerKeys, resourceKey, levels);
    if(unbuffedProductionData === null || unbuffedProductionData.length === 0){
        return 0;
    }

    const unbuffedProduction = calcUnbuffedProductionFigures(levels, premiumInfo, unbuffedProductionData);

    return applyBuffsToProduction(unbuffedProduction.productionPerMin, unbuffedProduction.actionsPerMin, resourceKey, levels, premiumInfo);
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
    return activeWorkerKeys
}


type T_UnbuffedProductionData = {
    baseTime : string, 
    quantity : string
}
function retrieveActiveUnbuffedProductionData(keys : string[], resourceKey : string, levels : T_Levels)
    : null | T_UnbuffedProductionData[] {

    let productionData = [];
    for(let idx = 0; idx < keys.length; idx++){
        const workerKey = keys[idx];
        const data = getUnitDataFromJSON(workerKey as T_DATA_KEYS);

        if('baseTime' in data){
            const upgradeIdx = levels[workerKey as keyof typeof levels] - 1;
            const resultsData = data.upgrades[upgradeIdx].results;
            let resourceIdx = null;
            if(resultsData[0].outputType === resourceKey){
                resourceIdx = 0;
            }
            else if(resultsData[1].outputType === resourceKey){
                resourceIdx = 1;
            }

            if(resourceIdx === null){
                return null;
            }
            
            const thisElement = {
                'baseTime': data.baseTime,
                'quantity': resultsData[resourceIdx].quantity
            }
            productionData.push(thisElement)
        }
        else{
            return null;
        }
    }

    return productionData;
}


function calcUnbuffedProductionFigures(levels : T_Levels, premiumInfo : T_PremiumInfo, unbuffedData : any)
    : { productionPerMin : number, actionsPerMin : number }{

    let totalProductionPerMinute = 0;
    let totalActionsPerMinute = 0;
    const speedMultiplier = calcSpeedMultiplier(levels, premiumInfo);

    for(let idx = 0; idx < unbuffedData.length; idx++){
        const secondsPerAction = parseFloat(unbuffedData[idx].baseTime) * speedMultiplier;
        const actionsPerMinute = 60 / secondsPerAction;
        const productionPerMinute = actionsPerMinute * parseInt(unbuffedData[idx].quantity);

        totalActionsPerMinute += actionsPerMinute;
        totalProductionPerMinute += productionPerMinute;
    }

    return {
        productionPerMin: totalProductionPerMinute,
        actionsPerMin: totalActionsPerMinute
    }
}


function applyBuffsToProduction(productionPerMin : number, actionsPerMin : number, resourceKey : keyof T_ProductionRates, levels : T_Levels, premiumInfo : T_PremiumInfo)
    : number {

    const DUST_KEY = 'dust';
    if(DUST_KEY === resourceKey){
        if(levels[DUST_KEY] > 0){
            const dustMultiplierAsStr = getBuffResultFromJSON(DUST_KEY, levels[DUST_KEY]);
            if(dustMultiplierAsStr === null || dustMultiplierAsStr === undefined){
                throw Error("Dust upgrade buff not applied");
            }
            const dustMultiplier = parseFloat(dustMultiplierAsStr);
            productionPerMin *= 1 + dustMultiplier;
        }
    }
    else{
        productionPerMin += levels[resourceKey as keyof typeof levels] * actionsPerMin
        productionPerMin += premiumInfo.allEggs * actionsPerMin;
    }

    return productionPerMin;
}


function calcSpeedMultiplier(levels : T_Levels, premiumInfo : T_PremiumInfo)
    : number {

    let adBoost = premiumInfo.adBoost ? 0.25 : 0;

    const SPEED_KEY = 'speed';
    let upgradeBoost = 0;
    if(levels[SPEED_KEY] > 0){
        let upgradeBoostAsStr = getBuffResultFromJSON(SPEED_KEY, levels[SPEED_KEY]);
        if(upgradeBoostAsStr === null || upgradeBoostAsStr === undefined){
            throw Error("Speed upgrade buff not applied");
        }
        upgradeBoost = parseFloat(upgradeBoostAsStr);
    }
    
    let multiplier = 1 - adBoost - upgradeBoost;
    return multiplier;
}