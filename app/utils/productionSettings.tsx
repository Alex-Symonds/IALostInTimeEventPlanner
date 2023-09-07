import { deepCopy } from './consts';
import { defaultProductionSettings } from './defaults';
import { T_Action, T_ProductionSettings, T_TimeGroup } from './types';


export function getProductionSettings({actions, index} 
    : {actions : T_Action[], index : number})
    : T_ProductionSettings {

    let prodSwitchesOnly = actions.slice(0, index).filter((ele) => ele.type === 'switch');
    let result = deepCopy(defaultProductionSettings);

    for(let i = 0; i < prodSwitchesOnly.length; i++){
        let thisSwitch = prodSwitchesOnly[i];

        if('to' in thisSwitch){
            result[thisSwitch.key as keyof typeof result] = thisSwitch.to;
        }
    }

    return result;
}


export function removeAllSwitchActionsInTimeGroup({ timeGroupData, workingActions } 
    : { timeGroupData : T_TimeGroup, workingActions : T_Action[] })
    : T_Action[] {

    let firstIdx = timeGroupData.switches[0].actionsIdx;
    let lastIdx = timeGroupData.switches[timeGroupData.switches.length - 1].actionsIdx;
    workingActions = workingActions.filter((action, idx) => {
        return idx < firstIdx || idx > lastIdx || action.type === 'upgrade';
    });

    return workingActions;
}


export function countInternalProductionSwitches({ timeGroupData } 
    : { timeGroupData : T_TimeGroup })
    : number {

    let countInternalSwitches = 0;
    if(timeGroupData.upgrades.length > 1){
        let startUpgradeIdx = timeGroupData.upgrades[0].actionsIdx;
        let endUpgradeIdx = timeGroupData.upgrades[timeGroupData.upgrades.length - 1].actionsIdx;
        
        for(let i = 0; i < timeGroupData.switches.length; i++){
            let loopSwitch = timeGroupData.switches[0];
            if(startUpgradeIdx < loopSwitch.actionsIdx && loopSwitch.actionsIdx < endUpgradeIdx){
                countInternalSwitches += 1;
            }
        }
    }
    return countInternalSwitches;
}


export function getNewSwitchActions({ startSettings, newSettings, insertIdx } 
    : {startSettings : T_ProductionSettings, newSettings : T_ProductionSettings, insertIdx : number}) 
    : T_Action[]{

    let newSwitchActions : T_Action[] = [];
    let counter = 0;
    for(const [newK, newV] of Object.entries(newSettings)){
        let wantSwitch = newV !== startSettings[newK as keyof typeof startSettings];

        if(wantSwitch){
            let newSwitch : T_Action = {
                type: 'switch',
                key: newK,
                to: newV,
                actionsIdx: insertIdx + counter
            }
            newSwitchActions.push(newSwitch);
            counter++;
        }
    }

    return newSwitchActions;
}