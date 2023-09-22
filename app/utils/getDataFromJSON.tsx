import UPGRADE_DATA from '../upgrades.json'; // This import style requires "esModuleInterop", see "side notes"

export type T_DATA_KEYS = keyof typeof UPGRADE_DATA;


type T_Upgrade = {
    level : string,
    costs: T_Cost[],
    results? : T_Result[],
    result? : string,
}

type T_Outputs = string[];

export type T_DATA_COSTS = T_Cost[];
type T_Cost = {
    egg: string,
    quantity : string
}

type T_Result = {
    outputType : string,
    quantity : string,
}

const EGGS = ["blue", "green", "red", "yellow"];


export function getUnitDataFromJSON(key : T_DATA_KEYS){
    return UPGRADE_DATA[key as keyof typeof UPGRADE_DATA];
}


export function getProductionCostsFromJSON(key : T_DATA_KEYS, level : number)
    : T_DATA_COSTS {

    let data = getUnitDataFromJSON(key);
    let upgradeData = data.upgrades[level - 1];
    for(let i = 0; i < upgradeData.costs.length; i++){
        if(!EGGS.includes(upgradeData.costs[i].egg)){
            throw Error("JSON error: costs");
        }
    }
    return upgradeData.costs;
}

export function getWorkerOutputsFromJSON(key : T_DATA_KEYS)
    : T_Outputs | null {

    let data = getUnitDataFromJSON(key);
    if('outputs' in data){
        return data.outputs;
    }
    if(data.type === 'Worker'){
        throw Error("JSON error: Worker has no outputs");
    }
    return null;
}


export function getUpgradeDataFromJSON(key : T_DATA_KEYS, level : number)
    : T_Upgrade{
        
    let data = getUnitDataFromJSON(key);
    if(level <= data.upgrades.length){
        return data.upgrades[level - 1];
    }
    throw Error("JSON error: nonexistent upgrade level");
}


export function getBuffResultFromJSON(key : T_DATA_KEYS, level : number){
    let upgrade = getUpgradeDataFromJSON(key, level)
    if('result' in upgrade){
        return upgrade.result;
    }

    let data = getUnitDataFromJSON(key);
    if(data.type === 'Buff'){
        throw Error("JSON error: Buff has no result");
    }

    return null;
}


export function getMaxLevelFromJSON(key : T_DATA_KEYS){
    let data = getUpgradesDataFromJSON(key);
    return data.length;
}


export function getUpgradesDataFromJSON(key : T_DATA_KEYS){
    let data = getUnitDataFromJSON(key);
    return data.upgrades;
}


export function getMainKeysFromJSON(){
    return Object.keys(UPGRADE_DATA);
}


export function getEntriesFromJSON(){
    return Object.entries(UPGRADE_DATA);
}