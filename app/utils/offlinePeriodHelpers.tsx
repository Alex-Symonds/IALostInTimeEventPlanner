import { MAX_TIME, MS_PER_MINUTE, OUT_OF_TIME, deepCopy } from './consts';
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

    const targetDate = convertOfflineTimeToDate(offlineTime, startedAt);
    const differenceInMs = targetDate.getTime() - startedAt.getTime();
    const differenceInMinutes = Math.round(differenceInMs / MS_PER_MINUTE);
    
    return 0 > differenceInMinutes ?
            0
            : MAX_TIME < differenceInMinutes ?
                OUT_OF_TIME
                : differenceInMinutes;
}


export function printOfflineTime(dhm : T_TimeOfflinePeriod) : string{
    return `${dhm.dateOffset}d${dhm.hours}h${dhm.minutes}m`
}


export function calcSortedOfflinePeriods(offlinePeriods : T_OfflinePeriod[]){
    let sorted : T_OfflinePeriod[] = deepCopy(offlinePeriods);
    return sorted.sort((a, b) => {
        const aStart = convertOfflineTimeToNumber(a.start);
        const bStart = convertOfflineTimeToNumber(b.start);

        return aStart < bStart ?
                -1
                : aStart > bStart ?
                    1
                    : 0;
    });
}


// Used for comparing offline times to one another
export function convertOfflineTimeToNumber(time : T_TimeOfflinePeriod){
    const safeTime = fixOfflineTimeStrings(time);
    return safeTime.dateOffset * 24 * 60 + safeTime.hours * 60 + safeTime.minutes;
}


// If load/save has somehow resulted in strings, fix that
export function fixOfflineTimeStrings(offlineTime : T_TimeOfflinePeriod){
    const dateInt = typeof offlineTime.dateOffset === 'string' ? parseInt(offlineTime.dateOffset) : offlineTime.dateOffset;
    const hoursInt = typeof offlineTime.hours === 'string' ? parseInt(offlineTime.hours) : offlineTime.hours;
    const minutesInt = typeof offlineTime.minutes === 'string' ? parseInt(offlineTime.minutes) : offlineTime.minutes;
    
    return {
        dateOffset: dateInt,
        hours: hoursInt,
        minutes: minutesInt
    }
}

