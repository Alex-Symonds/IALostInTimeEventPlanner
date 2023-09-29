import { deepCopy } from "@/app/utils/consts";
import { getEntriesFromJSON, getProductionCostsFromJSON, T_DATA_KEYS } from "@/app/utils/getDataFromJSON";
import { T_Stockpiles, T_PurchaseData } from "@/app/utils/types";

import { I_UpgradePickerModal, T_UnitPickerData } from "../upgradePicker";


interface I_CalcUpgradePickerRadioData extends Pick<I_UpgradePickerModal, "purchaseData" | "gameState">{
    targetIdx : number
}
type T_UpgradeRadioData = 
    T_UnitPickerData & {
    key : string,
    fromIdx : number,
}
export function calcUpgradePickerRadioData({ targetIdx, purchaseData, gameState } 
    : I_CalcUpgradePickerRadioData)
    : T_UpgradeRadioData[] {

    let result : T_UpgradeRadioData[] = [];
    let levelsAtStart = targetIdx === 0 ? 
                        gameState.levels
                        : purchaseData[targetIdx].levelsAbove;

    for(const [k, v] of getEntriesFromJSON()){
        let levelAtStart = levelsAtStart[k as keyof typeof levelsAtStart];
        let maxLevel = v.upgrades.length;
        let newLevel = levelAtStart + 1;

        let purchaseDataIdx = newLevel > maxLevel ?
                            -1
                            : purchaseData.findIndex((ele : any) => {
                                return ele.key === k && ele.level === newLevel
                            });

        result.push({
            key: k,
            fromIdx: purchaseDataIdx,
            name: v.name,
            level: newLevel,
            isMaxLevel: maxLevel < newLevel,
            costs: maxLevel < newLevel ? [] : v.upgrades[newLevel - 1].costs
        });
    }

    return result;
}


export function calcStockpilesIncludingCurrentPurchase(purchaseData 
    : T_PurchaseData) 
    : T_Stockpiles {

    let stockpiles = deepCopy(purchaseData.stockpiles);
    const costs = getProductionCostsFromJSON(purchaseData.key as T_DATA_KEYS, purchaseData.level);

    for(let i = 0; i < costs.length; i++){
        let loopKey = costs[i].egg;
        stockpiles[loopKey as keyof typeof stockpiles] = stockpiles[loopKey as keyof typeof stockpiles] + parseInt(costs[i].quantity);
    }

    return stockpiles;
}