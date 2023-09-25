import { T_GameState } from "@/app/utils/types";
import {  T_AllToDustOutput } from "../../../../utils/types";


export interface I_MoreSections {
    leftHeadingWidth : string,
    gameState : T_GameState,
    isDuringOfflinePeriod : boolean,
    moreData : T_MoreData,
}


export type T_MoreData = {
    stockpiles : T_ResourceColours,
    rates : T_ResourceColours,
    spendRemaining : T_ResourceColours,
    totalAtRates : T_ResourceColours,
    doneAt : T_ResourceColours,
    dustNow : number,
    allToDust : T_AllToDustOutput,
    finishAt : number,
}


export type T_ResourceColours = {
    blue : number,
    green : number,
    red : number,
    yellow : number,
}