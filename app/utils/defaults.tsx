import { MAX_TIME } from './consts';
import { T_DATA_KEYS, getMainKeysFromJSON, getMaxLevelFromJSON, getUpgradesDataFromJSON } from './getDataFromJSON';
import { T_GameState, T_Action, T_TimeRemainingDHM, T_Levels, T_Stockpiles, T_ProductionSettings, T_TimeOfflinePeriod } from './types';
import { deepCopy } from './utils';

export const startingTimeRemaining : T_TimeRemainingDHM = {
    days: 3,
    hours: 0,
    minutes: 0
}

export const startingStockpiles : T_Stockpiles = {
    dust: 0,
    blue: 0,
    green: 0,
    red: 0,
    yellow: 0,
}

export const startingProductionSettings : T_ProductionSettings = {
    trinity: "blue",
    bronte: "green",
    anne: "blue",
    petra: "red",
    manny: "dust",
    tony: "yellow",
    ruth: "red",
    rex: "dust",
}

export const startingLevels : T_Levels = {
    trinity : 0,
    bronte : 0,
    anne : 0,
    petra : 0,
    manny : 0,
    tony : 0,
    ruth : 0,
    rex : 0,
    blue : 0,
    green : 0,
    red : 0,
    yellow : 0,
    speed : 0,
    dust : 0
}

export const defaultGameState : T_GameState = {
    timestamp : new Date(),
    startTime : new Date(),
    timeRemaining : MAX_TIME,
    premiumInfo :  {
    adBoost : false,
    allEggs : 0,
    },
    stockpiles : deepCopy(startingStockpiles),
    levels : deepCopy(startingLevels),
}

export const maxLevels = () => {
    let maxLevels : T_Levels = deepCopy(startingLevels);
    Object.keys(maxLevels).forEach(key => {
        maxLevels[key as keyof typeof maxLevels] = getMaxLevelFromJSON(key as T_DATA_KEYS);
    });
    return maxLevels;
}

export const defaultOfflinePeriodStart : T_TimeOfflinePeriod = {
    dateOffset: 0,
    hours: 0,
    minutes: 0
}

export const defaultOfflinePeriodEnd : T_TimeOfflinePeriod = {
    dateOffset: 0,
    hours: 0,
    minutes: 1
}

export function defaultActionsList()
    : T_Action[]{

    let defaultPlanStart : T_Action[] = [
        {type: 'upgrade', key: 'trinity', level: 1},
        {type: 'upgrade', key: 'trinity', level: 2},
        {type: 'upgrade', key: 'trinity', level: 3},
    ]
    let productionUnlockKeys : string[] = ['bronte', 'anne', 'petra', 'manny', 'tony', 'ruth'];
    let unlockAllColours : T_Action[] = [];
    let afterUnlockingColours : T_Action[] = [];

    getMainKeysFromJSON().forEach(key => {
        let upgrades = getUpgradesDataFromJSON(key as T_DATA_KEYS);
        for(let idx = 0; idx < upgrades.length; idx++){
            if(!(key === 'trinity' && idx < 3)){
                let object = {
                    type: 'upgrade',
                    key, 
                    level: idx + 1
                };

                if(idx === 0 && productionUnlockKeys.includes(key)){
                    unlockAllColours.push(object);
                }
                else{
                    afterUnlockingColours.push(object);
                }
            }
        }
    });

    let result : T_Action[] = defaultPlanStart.concat(unlockAllColours).concat(afterUnlockingColours);
    return result;
}

export const lateGameSettings : any = {
    timeRemainingDHM : {
        days: 1,
        hours: 20,
        minutes: 40
    },
    hasAdBoost: true,
    allEggs: 2,
    stockpiles: {
        blue: 25000,
        green: 70000,
        red: 100,
        yellow: 1,
        dust: 5501345
    },
    levels: {
        trinity: 10,
        bronte: 10,
        anne: 8,
        petra: 10,
        tony: 7,
        manny: 1,
        ruth: 8,
        rex: 0,  
        blue: 4,
        green: 3,
        red: 2,
        yellow: 1,
        speed: 5,
        dust: 2,
    }
}

