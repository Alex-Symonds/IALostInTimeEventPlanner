import { deepCopy } from "./utils";
import { T_Stockpiles, T_ProductionRates } from "./types";


export function calcStockpilesAdvancedByTime(stockpiles : T_Stockpiles, timeToAdvance : number, productionRates : T_ProductionRates)
    : T_Stockpiles {

    let newStockpiles = deepCopy(stockpiles);
    for(let rkey in stockpiles){
        let producedDuringTime = Math.round(timeToAdvance * productionRates[rkey as keyof typeof productionRates]);
        newStockpiles[rkey as keyof typeof newStockpiles] += producedDuringTime;
    }
    return newStockpiles;
}
