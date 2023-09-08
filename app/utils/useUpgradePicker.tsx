import { useState } from 'react';

import { deepCopy } from './consts';
import { moveIsValid, T_ValidMoveOutput } from './editPlan';
import { T_PurchaseData, T_Action } from '../utils/types';


interface I_UseUpgradePicker {
    actions : T_Action[], 
    setActions : React.Dispatch<React.SetStateAction<T_Action[]>>, 
    purchaseData : T_PurchaseData[],
}

type T_OutputUseUpgradePicker = { 
    openModal : (idx : number) => void, 
    props : T_PropsUpgradePickerModal 
}

export type T_PropsUpgradePickerModal = {
    showModal : boolean,
    closeModal : () => void,
    movePlanElement : (data : { oldIdx : number, newIdx : number }) => void,
    pickerTargetIdx : number | null,
}

export function useUpgradePicker({purchaseData, actions, setActions}
    : I_UseUpgradePicker)
    : T_OutputUseUpgradePicker {

    const [showUpgradePicker, setShowUpgradePicker] = useState(false);
    const [pickerTargetIdx, setPickerTargetIdx] = useState<number | null>(null);

    function openModal(idx : number)
        : void {

        setPickerTargetIdx(idx);
        setShowUpgradePicker(true);
    }

    function movePlanElement({oldIdx, newIdx} 
        : { oldIdx : number, newIdx : number }) 
        : void {
       
        let validMoveCheck : T_ValidMoveOutput = moveIsValid({srcIdx: oldIdx, dstIdx: newIdx, purchaseData});

        let actionsOldIdx = purchaseData[oldIdx].actionsIdx;
        let actionsNewIdx = purchaseData[newIdx].actionsIdx;

        if(validMoveCheck.isValid){
            let upgradeOrderDeepCopy = deepCopy(actions);
            let targetElement = upgradeOrderDeepCopy[actionsOldIdx];

            upgradeOrderDeepCopy.splice(actionsOldIdx, 1);
            upgradeOrderDeepCopy.splice(actionsNewIdx, 0, targetElement);

            setActions(upgradeOrderDeepCopy);
        }
        else {
            console.log(`TODO: response to invalid move (${validMoveCheck.reason})`);
        }
    }

    let props : T_PropsUpgradePickerModal = {
        showModal: showUpgradePicker,
        closeModal: () => setShowUpgradePicker(false),
        movePlanElement: movePlanElement,
        pickerTargetIdx: pickerTargetIdx
    }

    return {
        openModal,
        props
    }
}
