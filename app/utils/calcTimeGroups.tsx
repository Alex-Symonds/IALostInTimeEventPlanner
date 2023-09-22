import { deepCopy } from "./consts";
import { T_TimeData, T_OfflinePeriod, T_PurchaseData, T_SwitchAction, T_SwitchData, T_TimeGroup } from "./types";
import { getOfflinePeriodAsTimeIDs } from "./offlinePeriodHelpers";



interface I_GroupByTimeID {
    purchaseData : T_PurchaseData[],
    switchData : T_SwitchData,
    offlinePeriods : T_OfflinePeriod[],
    startedAt : Date,
    timeData : T_TimeData
}


export function calcTimeGroups({purchaseData, switchData, offlinePeriods, startedAt, timeData} 
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

        let startOfflinePeriodTimeID : null | number = null;
        const offlinePeriodTimeIDs = getOfflinePeriodAsTimeIDs({ timeID: purchases[0].readyTimeID, offlinePeriods, startedAt });
        if(offlinePeriodTimeIDs !== null){
            startOfflinePeriodTimeID = offlinePeriodTimeIDs.start;
        }

        let key = timeID.toString();
        const timeDataThis = deepCopy(timeData[key]);

        let newGroup = {
            timeID,
            ...timeDataThis,
            startPos: startIdx + 1,
            upgrades: purchases,
            switches: Array.from(new Set(switches)),
            startOfflinePeriodTimeID,
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