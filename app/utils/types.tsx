import { SetStateAction, Dispatch } from "react";

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
export type T_DisplaySwitch = Pick<T_SwitchAction, "key" | "to">


export type T_PurchaseData = 
    T_UpgradeAction & {
    actionsIdx : number,
    readyTimeID : number,
    purchaseTimeID : number,
    levelsAbove: T_Levels,
    stockpiles : T_Stockpiles,
}

export type T_TimeData = {
    [key : string] : T_TimeDataUnit,
}
export type T_TimeDataUnit = {
    stockpilesAtEnd: T_Stockpiles,
    levelsAtEnd: T_Levels,
    ratesDuring: T_ProductionRates,
    productionSettingsDuring : T_ProductionSettings,
    allToDustAfter : T_AllToDustOutput,
    startOfflinePeriodTimeID : number | null,
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
    T_TimeDataUnit & {
    timeID : number,
    startPos : number,
    upgrades : T_PurchaseData[],
    switches : T_SwitchAction[],
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

export type T_ProductionSettingsNow = {
    timeID : number,
    productionSettings : T_ProductionSettings
};

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

export type T_ModalData =
    T_ModalDataShared & (
        T_ModalOpen | T_ModalToggle | (T_ModalToggle & T_ModalOpen)
    )

type T_ModalDataShared = {
    isVisible : boolean,
    closeModal : () => void,
    action : (data : any) => void | Dispatch<SetStateAction<any>>,
    data? : any
}
export type T_ModalWithOpen =
    T_ModalDataShared & T_ModalOpen;
    
export type T_ModalWithToggle =
    T_ModalDataShared & T_ModalToggle;

export type T_ModalWithOpenAndToggle =
    T_ModalDataShared & T_ModalToggle & T_ModalOpen;

type T_ModalToggle = {
    toggle : () => void,
}
type T_ModalOpen = {
    openModal : (data : any) => void | Dispatch<SetStateAction<any>>
}

export type T_SuggestionData = { dust : number, position : number };
export type T_ResultData = {
    hasWon : boolean,
    dustAtEnd : number,
    allToDust : T_SuggestionData | null,
}