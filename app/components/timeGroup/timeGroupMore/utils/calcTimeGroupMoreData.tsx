import { deepCopy, MAX_TIME, OUT_OF_TIME, WIN_CONDITION } from "../../../../utils/consts";
import { T_DATA_KEYS, getUpgradeDataFromJSON } from '../../../../utils/getDataFromJSON';
import { T_TimeGroup, T_Stockpiles, T_ProductionRates, T_Levels, T_PremiumInfo, T_GameState, T_ProductionSettings, } from "../../../../utils/types";

import { T_MoreData, T_ResourceColours } from "./types";

import { calcMaxDustRate } from "@/app/utils/calcResults";
import { calcProductionRates } from "@/app/utils/calcProductionRates";

export function calcTimeGroupMoreData(data : T_TimeGroup, remainingTimeGroups : T_TimeGroup[], gameState : T_GameState)
    : T_MoreData {

    const newRates = calcProductionRates(data.levelsAtEnd, gameState.premiumInfo, data.productionSettingsDuring);
    const spendRemaining = calcSpendRemaining(remainingTimeGroups);
    const eggStockpiles = deepCopy(data.stockpilesAtEnd);
    delete eggStockpiles.dust;
    const eggsTotalAtEnd = calcTotalAtRates(newRates, data.stockpilesAtEnd, data.timeID);
    const eggsDoneAt = calcTimeIDProductionIsDone(spendRemaining, newRates, data.stockpilesAtEnd, eggsTotalAtEnd, data.timeID);

    const dustInfo = calcDustTableInfo(newRates.dust, deepCopy(data.levelsAtEnd), gameState.premiumInfo, data.stockpilesAtEnd.dust, data.timeID);
    const {dust: _, ...eggRates} = newRates;

    return {
        eggStockpiles: eggStockpiles,
        eggRates: eggRates,
        eggsTotalAtEnd,
        eggsDoneAt,
        eggsSpendRemaining: spendRemaining,
        dustNow: data.stockpilesAtEnd.dust,
        ...dustInfo
    }
}


function calcDustTableInfo(rateNow : number, levels : T_Levels, premiumInfo : T_PremiumInfo, dustNow : number, timeID : number){
    const rateMax = calcMaxDustRate(levels, premiumInfo);

    const finishTimeCurrent = calcTimeDustDone(rateNow, dustNow, timeID);
    const finishTimeMax = calcTimeDustDone(rateMax, dustNow, timeID);

    const minsRemaining = MAX_TIME - timeID;
    const endTotalCurrent = Math.round(minsRemaining * rateNow) + dustNow;
    const endTotalMax = Math.round(minsRemaining * rateMax) + dustNow;

    return {
        dustRates: [Math.round(rateNow), Math.round(rateMax)],
        dustFinishTimes: [finishTimeCurrent, finishTimeMax],
        dustTotals: [endTotalCurrent, endTotalMax],
    }
}



function calcSpendRemaining(timeGroups : T_TimeGroup[])
    : T_ResourceColours {

    const initAccumulator : T_ResourceColours = { blue: 0, green: 0, red: 0, yellow: 0 };

    return timeGroups.reduce((mainAcc, currentTimeGroup) => {

        const groupResult = currentTimeGroup.upgrades.reduce((groupAcc, currentUpgrade) => {
            const data = getUpgradeDataFromJSON(currentUpgrade.key as T_DATA_KEYS, currentUpgrade.level);
            for(let i = 0; i < data.costs.length; i++){
                const keyName = data.costs[i].egg;
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


function calcTotalAtRates(rates : T_ProductionRates, stockpiles : T_Stockpiles, timeID : number)
    : T_ResourceColours{

    const minutesRemaining = MAX_TIME - timeID;
    return {
        blue: Math.floor(minutesRemaining * rates.blue) + stockpiles.blue,
        green: Math.floor(minutesRemaining * rates.green) + stockpiles.green,
        red: Math.floor(minutesRemaining * rates.red) + stockpiles.red,
        yellow: Math.floor(minutesRemaining * rates.yellow) + stockpiles.yellow,
    }
}


function calcTimeIDProductionIsDone(spendRemaining : T_ResourceColours, rates : T_ProductionRates, stockpiles : T_Stockpiles, projectedTotal : T_ResourceColours, timeID : number)
    : T_ResourceColours {

    return Object.keys(spendRemaining).reduce((attrs, key) => {
        const projected = projectedTotal[key as keyof typeof projectedTotal];
        const current = stockpiles[key as keyof typeof stockpiles];
        const goal = spendRemaining[key as keyof typeof spendRemaining];
        const rate = rates[key as keyof typeof rates];

        return {
            ...attrs,
            [key]: projected < goal ? 
                    -1
                    : current > goal ?
                        0
                        : Math.round((goal - current) / rate) + timeID
        }
    }, { blue: -1, green: -1, red: -1, yellow: -1 })
}


function calcTimeDustDone(rate : number, dustNow : number, timeID : number)
    : number {

    const difference = WIN_CONDITION - dustNow;
    const timeNeeded = Math.round(difference / rate);
    const timeIDAtFinish = timeID + timeNeeded;
    return timeIDAtFinish < OUT_OF_TIME ? timeIDAtFinish : -1;
}