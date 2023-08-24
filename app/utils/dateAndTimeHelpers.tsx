import { nbsp } from './formatting';
import { T_GameState, T_TimeOfflinePeriod, T_TimeRemainingDHM } from "./types";

const msPerMin = 60000;

export function convertOfflineTimeToDate(offlineTime : T_TimeOfflinePeriod, startedAt : Date)
    : Date {
        
    let result = new Date(startedAt.getTime());
    let toDate = startedAt.getDate() + offlineTime.dateOffset;
    result.setDate(toDate);
    result.setHours(offlineTime.hours, offlineTime.minutes);
    return result;
}


export function convertOfflineTimeToTimeId(offlineTime : T_TimeOfflinePeriod, startedAt : Date)
    : number {

    let targetDate = convertOfflineTimeToDate(offlineTime, startedAt);
    let differenceInMs = targetDate.getTime() - startedAt.getTime();
    return Math.round(differenceInMs / msPerMin);
}


export function convertDateToTimeId(targetTime : Date, gameState : T_GameState) 
    : number {

    let startedAt : Date = getStartTime(gameState);
    let difference =  Math.abs(targetTime.getTime() - startedAt.getTime());
    return Math.round(difference / msPerMin);
}


export function convertTimeIdToDate(targetTimeId : number, gameState : T_GameState) 
    : Date {

    let startedAt : Date = getStartTime(gameState);
    return new Date(startedAt.getTime() + targetTimeId * msPerMin);
}


export function convertTimeRemainingToMinutes(timeAsDHM : T_TimeRemainingDHM) 
    : number {

    return timeAsDHM.days * 24 * 60 + timeAsDHM.hours * 60 + timeAsDHM.minutes;
}


export function convertTimeIdToTimeRemaining(
    timeId : number)
    : T_TimeRemainingDHM {

    let dayNum = Math.max(Math.floor(timeId / 24 / 60), 0);

    return {
        days: dayNum,
        hours: Math.floor((timeId - (dayNum * 24 * 60)) / 60),
        minutes: timeId % 60
    } 
}

export function calcDHMString(timeAsDHM : T_TimeRemainingDHM) : string {
    return `${timeAsDHM.days}d${nbsp()}${timeAsDHM.hours}h${nbsp()}${timeAsDHM.minutes}m`
}


export function getStartTime(
    gameState : T_GameState) 
    : Date {
        
    let startedAt : Date;
    const TIME_REMAINING_AT_START = 3 * 24 * 60;

    if(gameState.timeRemaining === TIME_REMAINING_AT_START){
        startedAt = gameState.timeEntered;
    }
    else{
        let timePassed = (TIME_REMAINING_AT_START - gameState.timeRemaining) * msPerMin;
        startedAt = new Date(gameState.timeEntered.getTime() - timePassed);
    }
    return startedAt;
}


export function getMonthName(monthNumber : number) : string {
    const date = new Date();
    date.setMonth(monthNumber);
  
    // Using the browser's default locale.
    return date.toLocaleString([], { month: 'short' });
}


export function getDateDisplayStr(myDate : Date) : string {
    return myDate.getDate() + nbsp() + getMonthName(myDate.getMonth()) + nbsp() + myDate.toLocaleTimeString([], {timeStyle: 'short', hourCycle: 'h23' });
}

export function printOfflineTime(dhm : T_TimeOfflinePeriod) : string{
    return `${dhm.dateOffset}d${dhm.hours}h${dhm.minutes}m`
}

