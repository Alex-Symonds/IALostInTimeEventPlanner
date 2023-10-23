/*
    Hook to support operation of the production switch modal.

    Note: suitable for all "switch" buttons, with one exception: the first switch button, at the top.
    That one requires useSwitchProductionNow.

    ---

    Assumption: while users /could/ switch production at any time they please, it's unlikely that they'll
    have a burning desire to switch to producing, say, green at precisely 16:32. It'd make more sense for
    them to want to do it at one of these three times:
        1) When they've just purchased an upgrade and they'd benefit from different settings going forwards
        2) Now (e.g. it's mid-event, they just realised they're producing the wrong thing and they want to 
           see how badly that's messed up their performance and whether they can fix it)
        3) Once a particular quantity of eggs have been produced

    This hook is intended for case #1, which can be planned in advance. It adds production switches to the 
    list of planned 'actions', which will cause it to be applied to the plan after the preceeding upgrade 
    is complete.
*/
import { useState } from 'react';

import { deepCopy } from '../../../utils/utils';
import { removeAllSwitchActionsInTimeGroup, countInternalProductionSwitches, calcNewSwitchActions } from '../../../utils/productionSettingsHelpers';
import { I_ProductionSwitcherModalUniversal, T_ProductionSettings, T_TimeGroup, T_Action } from '../../../utils/types';


interface I_UseSwitchProductionFuture {
    actions : T_Action[], 
    setActions :(data : T_Action[]) => void,
}

type T_OutputUseProductionSwitcher = {
    openModal: (data : T_TimeGroup) => void,
    props : T_PropsSwitchProdFutureModal
}
export type T_PropsSwitchProdFutureModal = 
    I_ProductionSwitcherModalUniversal & {
    data : T_TimeGroup | null,
}
export function useSwitchProductionFuture({actions, setActions}
    : I_UseSwitchProductionFuture)
    : T_OutputUseProductionSwitcher {

    const [isVisible, setIsVisible] = useState(false);
    const [targetTimeGroup, setTargetTimeGroup] = useState<T_TimeGroup | null>(null);

    function openModal(data : T_TimeGroup)
        : void {

        setTargetTimeGroup(data);
        setIsVisible(true);
    }

    function updateSettings(newSettings : T_ProductionSettings)
        : void {

        if(targetTimeGroup === null){
            return;
        }

        let workingActions = deepCopy(actions);
        let numInternalSwitches = 0;

        if(targetTimeGroup.switches.length > 0){
            workingActions = removeAllSwitchActionsInTimeGroup({ timeGroupData: targetTimeGroup, workingActions });
            numInternalSwitches = countInternalProductionSwitches({ timeGroupData: targetTimeGroup });
        }

        let lastUpgrade = targetTimeGroup.upgrades[targetTimeGroup.upgrades.length - 1];
        let insertIdx = lastUpgrade.actionsIdx + 1 - numInternalSwitches;

        let newSwitchActions = calcNewSwitchActions({
            startSettings: targetTimeGroup.productionSettingsDuring,
            newSettings,
            insertIdx
        });

        workingActions = workingActions.slice(0, insertIdx).concat(newSwitchActions).concat(workingActions.slice(insertIdx));  
        setActions(workingActions);
    }


    let props : T_PropsSwitchProdFutureModal = {
        isVisible: isVisible,
        closeModal: () => setIsVisible(false),
        data: targetTimeGroup,
        updateProdSettings: updateSettings
    }

    return {
        openModal: openModal,
        props,
    }
}
