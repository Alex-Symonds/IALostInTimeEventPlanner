import { T_PurchaseData, T_TimeGroup } from "./types";

interface I_GroupByTimeId {
    purchaseData : T_PurchaseData[],
    switchData : any
}

export function groupByTimeId({purchaseData, switchData} 
    : I_GroupByTimeId ) 
    : T_TimeGroup[]{

    if(purchaseData === null){
        return [];
    }

    let grouped : T_TimeGroup[] = [];
    let startIdx : number = 0;
    let prev : T_PurchaseData | null = null;

    for(let i = 0; i < purchaseData.length; i++){
        let loopPlan = purchaseData[i];
        if(prev !== null && prev.timeId !== loopPlan.timeId){
            let newGroup = getNewGroup({lastEle: prev, endIndex: i});
            grouped.push(newGroup);
            startIdx = i;
        }
        else if(i === purchaseData.length - 1){
            let newGroup = getNewGroup({lastEle: loopPlan, endIndex: null});
            grouped.push(newGroup);
            break;
        }
        prev = loopPlan;
    }

    function getNewGroup({lastEle, endIndex} 
        : {lastEle : T_PurchaseData, endIndex : number | null}) 
        : T_TimeGroup {

        let deepCopyPlanData = JSON.parse(JSON.stringify(purchaseData));
        let upgrades = endIndex === null ? 
            deepCopyPlanData.slice(startIdx)
            : deepCopyPlanData.slice(startIdx, endIndex);

        let hasSwitches = lastEle.timeId.toString() in switchData;
        let switches = hasSwitches ? 
                        switchData[lastEle.timeId.toString() as keyof typeof switchData] 
                        : [];

        let newGroup = {
            timeId: lastEle.timeId,
            productionSettings: upgrades[0].productionSettings,
            upgrades,
            switches,
            levels: lastEle.levels
        }
        return newGroup;
    }

    return grouped;
}