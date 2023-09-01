import { T_TimeRemainingDHM, T_Levels, T_Stockpiles, T_ProductionSettings } from "./types"

export const MAX_DAYS = 3;
export const MAX_TIME = MAX_DAYS * 24 * 60;
export const OUT_OF_TIME = MAX_TIME + 1;
export const WIN_CONDITION = 10000000000;
export const SAVE_FILE_PREFIX = "saveFile_";
export const MAX_ALL_EGGS = 5;
export const TAILWIND_MD_BREAKPOINT = 768;

export function deepCopy(target : any){
    return JSON.parse(JSON.stringify(target));
}







