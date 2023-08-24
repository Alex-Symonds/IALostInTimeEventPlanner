import { MAX_TIME } from './consts';
import { advanceStockpilesByTime, calcProductionRates, calcDustAtEnd } from './getPlanData';
import { T_ProductionSettings, T_GameState, T_Stockpiles, T_AllToDustOutput } from './types';

type T_EndInfo = { 
    dust : T_AllToDustOutput | null, 
    stockpiles : T_Stockpiles 
}

export default function calcEndInfo({timeRemaining, stockpiles, levels, premiumInfo, productionSettings}
    : { productionSettings: T_ProductionSettings } & Pick<T_GameState, "timeRemaining" | "stockpiles"| "levels" | "premiumInfo">)
    : T_EndInfo | null {

    let productionRates = calcProductionRates(levels, premiumInfo, productionSettings);
    if(productionRates === null){
        return null;
    }

    let newStockpiles = advanceStockpilesByTime(stockpiles, timeRemaining, productionRates);

    let dust = calcDustAtEnd({
        timeId: MAX_TIME - timeRemaining,
        stockpiles: stockpiles,
        levels: levels,
        premiumInfo: premiumInfo,
        productionSettings 
    }) 

    return {
        dust,
        stockpiles: newStockpiles
    };
}