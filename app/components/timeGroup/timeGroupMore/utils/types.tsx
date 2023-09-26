import { T_GameState } from "@/app/utils/types";
import {  T_AllToDustOutput } from "../../../../utils/types";


export interface I_MoreSections {
    leftHeadingWidth : string,
    gameState : T_GameState,
    isDuringOfflinePeriod : boolean,
    moreData : T_MoreData,
}


export type T_MoreData = {
    eggStockpiles : T_ResourceColours,
    eggRates : T_ResourceColours,
    eggsSpendRemaining : T_ResourceColours,
    eggsTotalAtEnd : T_ResourceColours,
    eggsDoneAt : T_ResourceColours,
    dustNow : number,
    dustRates: number[],
    dustFinishTimes: number[],
    dustTotals: number[],
}


export type T_ResourceColours = {
    blue : number,
    green : number,
    red : number,
    yellow : number,
}