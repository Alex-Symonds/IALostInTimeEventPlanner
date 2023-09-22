import { MS_PER_MINUTE } from './consts';
import { T_OfflinePeriod, T_TimeOfflinePeriod } from "./types";


interface I_IsDuringOfflinePeriods {
    timeID : number, 
    offlinePeriods : T_OfflinePeriod[], 
    startedAt : Date
}
export function isDuringOfflinePeriod({timeID, offlinePeriods, startedAt}
    : I_IsDuringOfflinePeriods)
    : boolean {

    return findIndexOfOfflinePeriod({timeID, offlinePeriods, startedAt}) !== -1;
}


export function getOfflinePeriodAsTimeIDs({timeID, offlinePeriods, startedAt}
    : I_IsDuringOfflinePeriods){

    const idx = findIndexOfOfflinePeriod({timeID, offlinePeriods, startedAt});
    if(idx === -1){
        return null;
    }
    return {
        start: convertOfflineTimeToTimeID(offlinePeriods[idx].start, startedAt),
        end: convertOfflineTimeToTimeID(offlinePeriods[idx].end, startedAt),
    }
}


function findIndexOfOfflinePeriod({timeID, offlinePeriods, startedAt}
    : I_IsDuringOfflinePeriods)
    : number {

    return offlinePeriods.findIndex(ele => {
        let start = convertOfflineTimeToTimeID(ele.start, startedAt);
        let end = convertOfflineTimeToTimeID(ele.end, startedAt);
        return timeID >= start && timeID < end;
    });
}


export function convertOfflineTimeToDate(offlineTime : T_TimeOfflinePeriod, startedAt : Date)
    : Date {
        
    let result = new Date(startedAt.getTime());
    let toDate = startedAt.getDate() + offlineTime.dateOffset;
    result.setDate(toDate);
    result.setHours(offlineTime.hours, offlineTime.minutes);
    return result;
}


export function convertOfflineTimeToTimeID(offlineTime : T_TimeOfflinePeriod, startedAt : Date)
    : number {

    let targetDate = convertOfflineTimeToDate(offlineTime, startedAt);
    let differenceInMs = targetDate.getTime() - startedAt.getTime();
    return Math.round(differenceInMs / MS_PER_MINUTE);
}

