export type T_GameState = {
    timeEntered : Date,
    timeRemaining : number,
    premiumInfo : T_PremiumInfo,
    stockpiles : T_Stockpiles,
    levels : T_Levels,
}

export type T_TimeRemainingDHM = {
    days : number,
    hours : number,
    minutes : number
}

export type T_PremiumInfo = {
    adBoost : boolean,
    allEggs : number,
}

export type T_Stockpiles = {
    blue : number,
    green : number,
    red : number,
    yellow : number,
    dust : number,
}

export type T_Levels = {
    trinity : number,
    bronte : number,
    anne : number,
    petra : number,
    manny : number,
    tony : number,
    ruth : number,
    rex : number,
    blue : number,
    green : number,
    red : number,
    yellow : number,
    speed : number,
    dust : number
}

export type T_OfflinePeriod = {
    start : T_TimeOfflinePeriod,
    end : T_TimeOfflinePeriod
}

export type T_TimeOfflinePeriod = {
    dateOffset : number,
    hours : number,
    minutes : number
}

export type T_OfflinePeriodForm = 
    T_OfflinePeriod & {
        id: string,
        isValid : boolean
}


export type T_Action = {
    type : string,
} & (T_UpgradeAction | T_SwitchAction);

    export type T_UpgradeAction = {
        key : string,
        level : number,
    }
    export type T_SwitchAction = {
        key : string,
        to : string,
        actionsIdx : number
    }



export type T_PurchaseData = 
    T_UpgradeAction & {
    actionsIdx : number,
    stockpiles : T_Stockpiles,
    timeId : number,
    levels: T_Levels,
    allToDust : T_AllToDustOutput | null,
    rates: T_ProductionRates,
    productionSettings : T_ProductionSettings
}

export type T_SwitchData = {
    [key : string]: T_SwitchAction[]
}

export type T_CostData = {
    egg : string,
    quantity: string,
}

export type T_ProductionRates = {
    blue : number,
    green : number,
    red : number,
    yellow : number,
    dust : number,
}

export type T_TimeGroup = 
    Pick<T_PurchaseData, "timeId" | "productionSettings"> & {
    upgrades : T_PurchaseData[],
    switches : T_SwitchAction[],
    levels : T_Levels,
};

export type T_ProductionSettings = {
    trinity : string,
    bronte : string,
    anne : string,
    petra : string,
    manny : string,
    tony : string,
    ruth : string,
    rex : string,
}

export type T_ProductionSettingsNow = 
    Pick<T_PurchaseData, "timeId"> &
    Pick<T_PurchaseData, "productionSettings">;












// type T_ProductionSettings = {
//     [key : string] : T_ProductionStatus,
// }

// type T_MaxDustInfo = {
//     planDataIndex : number,
//     dust : number
// }

export type T_AllToDustOutput = {
    value : number,
    rate : number
}

export type T_ViewToggle = {
    displayStr : string,
    value : any,
    toggle : () => void
}


export interface I_ProductionSwitcherModalUniversal {
    isVisible : boolean,
    closeModal : () => void,
    updateProdSettings : (newSettings : T_ProductionSettings) => void,
}