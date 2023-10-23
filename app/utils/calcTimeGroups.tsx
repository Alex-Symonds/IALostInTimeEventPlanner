import { T_TimeData, T_PurchaseData, T_SwitchAction, T_SwitchData, T_TimeGroup, T_TimeDataUnit } from "./types";
import { deepCopy } from './utils';


interface I_GroupByTimeID {
    purchaseData : T_PurchaseData[],
    switchData : T_SwitchData,
    timeData : T_TimeData
}

export function calcTimeGroups({purchaseData, switchData, timeData} 
    : I_GroupByTimeID ) 
    : T_TimeGroup[]{

    if(purchaseData === null){
        return [];
    }

    let grouped : T_TimeGroup[] = [];
    let startIdx : number = 0;
    for(let i = 0; i < purchaseData.length; i++){
        const thisPurchase = purchaseData[i];
        const nextPurchase = i === purchaseData.length - 1 ?
                                null
                                : purchaseData[i + 1];

        if(nextPurchase === null || nextPurchase.purchaseTimeID !== thisPurchase.purchaseTimeID){
            const endIndex = nextPurchase !== null && nextPurchase.purchaseTimeID !== thisPurchase.purchaseTimeID ?
                                i + 1
                                : null;
            const newGroup = createNewGroup({timeID: thisPurchase.purchaseTimeID, endIndex: endIndex});
            grouped.push(newGroup);
            startIdx = i + 1;
        }
    }
    return grouped;


    function createNewGroup({timeID, endIndex} 
        : { timeID : number, endIndex : number | null }) 
        : T_TimeGroup {

        let purchases = endIndex === null ? 
            purchaseData.slice(startIdx)
            : purchaseData.slice(startIdx, endIndex);

        let switches : T_SwitchAction[] = getSwitchesAtThisTimeID(timeID);

        let key = timeID.toString();
        const timeDataThis : T_TimeDataUnit = deepCopy(timeData[key]);

        let newGroup = {
            timeID,
            ...timeDataThis,
            startPos: startIdx + 1,
            upgrades: purchases,
            switches: Array.from(new Set(switches)),
        }

        return newGroup;
    }

    function getSwitchesAtThisTimeID(timeID : number){
        let hasSwitches = timeID.toString() in switchData;
        return hasSwitches ? 
                switchData[timeID.toString() as keyof typeof switchData] 
                : [];
    }

}