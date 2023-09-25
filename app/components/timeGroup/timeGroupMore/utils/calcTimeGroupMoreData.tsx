import { deepCopy, MAX_TIME, WIN_CONDITION } from "../../../../utils/consts";
import { T_DATA_KEYS, getUpgradeDataFromJSON } from '../../../../utils/getDataFromJSON';
import { T_TimeGroup, T_Stockpiles, T_ProductionRates, } from "../../../../utils/types";

import { T_MoreData, T_ResourceColours } from "./types";


export function calcTimeGroupMoreData(data : T_TimeGroup, remainingTimeGroups : T_TimeGroup[])
    : T_MoreData {

    const rates = deepCopy(data.ratesDuring);
    const spendRemaining = calcSpendRemaining(remainingTimeGroups);
    const eggStockpiles = deepCopy(data.stockpilesAtEnd);
    delete eggStockpiles.dust;
    const totalAtRates = calcTotalAtRates(rates, data.stockpilesAtEnd, data.timeID);
    const doneAt = calcTimeIDProductionIsDone(spendRemaining, rates, data.stockpilesAtEnd, totalAtRates, data.timeID);
    const finishAt = calcTimeDustDone(data, data.timeID);

    return {
        stockpiles: eggStockpiles,
        rates: data.ratesDuring,
        spendRemaining: spendRemaining,
        totalAtRates,
        doneAt,
        dustNow: data.stockpilesAtEnd.dust,
        allToDust: data.allToDustAfter,
        finishAt
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


function calcTimeDustDone(data : T_TimeGroup, timeID : number)
    : number {

    const finishTime : number = -1;
    if(data.allToDustAfter !== null){
        if(data.allToDustAfter.value > WIN_CONDITION){
            const rate = data.allToDustAfter.rate;
            const difference = WIN_CONDITION - data.stockpilesAtEnd.dust;
            const timeIDAtFinish = Math.round(difference / rate) + timeID;
            return timeIDAtFinish;
        }
    }
    return finishTime;
}