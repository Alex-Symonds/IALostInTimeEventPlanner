import UPGRADE_DATA from '../upgrades.json';
import { T_PurchaseData } from './types';

export type T_ValidMoveOutput = { 
    isValid : boolean, 
    reason? : string 
}

interface I_MoveIsValid {
    srcIdx : number,
    dstIdx : number,
    purchaseData : T_PurchaseData[]
}
export function moveIsValid({srcIdx, dstIdx, purchaseData} 
    : I_MoveIsValid) 
    : T_ValidMoveOutput {

    if(srcIdx === -1 || dstIdx === -1){
        return {
            isValid: false,
            reason: "Upgrade does not exist"
        }
    }

    let validAndReason;
    if(srcIdx > dstIdx){
        // Target moving up/earlier. Check it can go in front of each element between source and destination
        for(let i = srcIdx - 1; i >= dstIdx; i--){
            validAndReason = swapIsValidWithReason({idxBefore: srcIdx, idxAfter: i, purchaseData});
            if(!validAndReason.isValid){
                return validAndReason;
            }
        }
    }
    else if (srcIdx < dstIdx){
        // Target moving down/later. Check it can go behind each element between source and destination
        for(let i = srcIdx + 1; i <= dstIdx; i++){
            validAndReason = swapIsValidWithReason({idxBefore: i, idxAfter: srcIdx, purchaseData});
            if(!validAndReason.isValid){
                return validAndReason;
            }
        }
    }

    return {
        isValid: true
    }
}


interface I_SwapIsValidWithReason extends Pick<I_MoveIsValid, "purchaseData"> {
    idxBefore : number,
    idxAfter : number,
}
function swapIsValidWithReason({idxBefore, idxAfter, purchaseData} 
    : I_SwapIsValidWithReason)
    : T_ValidMoveOutput {

    function getCheckData(idx : number){
        let thisPlanData = purchaseData[idx];
        let thisFullData = UPGRADE_DATA[thisPlanData.key as keyof typeof UPGRADE_DATA];
        let thisUpgrade = thisFullData.upgrades[thisPlanData.level - 1];
        return {
            key: thisPlanData.key,
            level: thisPlanData.level,
            name: thisFullData.name,
            prereq: 'prereq' in thisUpgrade ? thisUpgrade.prereq : "",
            costs: thisUpgrade.costs
        }
    }

    let dataBefore = getCheckData(idxBefore);
    let dataAfter = getCheckData(idxAfter);

    if(dataBefore.key === dataAfter.key && dataBefore.level >= dataAfter.level){
        return {
            isValid: false,
            reason: `${dataBefore.name} lv${dataBefore.level} can't be purchased before lv${dataAfter.level}`
        }
    }

    if(dataBefore.prereq === dataAfter.key && dataAfter.level === 1){
        return {
            isValid: false,
            reason: `${dataBefore.name} lv ${dataBefore.level} can't be purchased before ${dataAfter.name} lv 1`
        }
    }

    if(dataBefore.costs.length > 0){
        for(let c = 0; c < dataBefore.costs.length; c++){
            let eggKey = dataBefore.costs[c].egg;
            let eggData = UPGRADE_DATA[eggKey as keyof typeof UPGRADE_DATA];
            
            if('firstCreatedBy' in eggData && eggData.firstCreatedBy === dataAfter.key && dataAfter.level === 1){
                return {
                    isValid: false,
                    reason: `${dataBefore.name} lv ${dataBefore.level} requires ${eggData.name.toLowerCase()} eggs`
                }
            }
        }
    }

    return {
        isValid: true
    }
}

