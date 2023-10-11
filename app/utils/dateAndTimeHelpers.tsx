import { nbsp } from './formatting';
import { T_GameState, T_TimeOfflinePeriod, T_TimeRemainingDHM } from "./types";
import { MS_PER_MINUTE } from './consts';


export function convertDateToTimeID(targetTime : Date, gameState : T_GameState) 
    : number {

    let difference =  Math.abs(targetTime.getTime() - gameState.startTime.getTime());
    return Math.round(difference / MS_PER_MINUTE);
}


export function convertTimeIDToDate(targetTimeID : number, gameState : T_GameState) 
    : Date {

    return new Date(gameState.startTime.getTime() + targetTimeID * MS_PER_MINUTE);
}

export function convertTimeIDToDHM(timeId: number)
    : T_TimeRemainingDHM {

    let days : number = Math.floor(timeId / 60 / 24);
    let hours : number, minutes : number;

    if(days === 3){
        return {
            days: 3,
            hours: 0,
            minutes: 0
        }
    }

    let remainingTime = timeId - days * 24 * 60;
    minutes = remainingTime % 60;
    hours = (remainingTime - minutes) / 60;

    return{
        days, hours, minutes
    }
}

export function convertTimeIDToTimeRemaining(
    timeId : number)
    : T_TimeRemainingDHM {

    let dayNum = Math.max(Math.floor(timeId / 24 / 60), 0);

    return {
        days: dayNum,
        hours: Math.floor((timeId - (dayNum * 24 * 60)) / 60),
        minutes: timeId % 60
    } 
}


export function convertTimeRemainingToMinutes(timeAsDHM : T_TimeRemainingDHM) 
    : number {

    const days = isNaN(timeAsDHM.days) ? 0 : timeAsDHM.days;
    const hours = isNaN(timeAsDHM.hours) ? 0 : timeAsDHM.hours;
    const minutes = isNaN(timeAsDHM.minutes) ? 0 : timeAsDHM.minutes;
    return days * 24 * 60 + hours * 60 + minutes;
}



export function calcDHMString(timeAsDHM : T_TimeRemainingDHM) : string {
    return `${timeAsDHM.days}d${nbsp()}${timeAsDHM.hours}h${nbsp()}${timeAsDHM.minutes}m`
}


export function calcMonthName(monthNumber : number) : string {
    const date = new Date();
    date.setMonth(monthNumber);
  
    // Using the browser's default locale.
    return date.toLocaleString([], { month: 'short' });
}


export function calcDateDisplayStr(myDate : Date) : string {
    return myDate.getDate().toString().padStart(2, '0') + nbsp() + calcMonthName(myDate.getMonth()) + nbsp() + myDate.toLocaleTimeString([], {timeStyle: 'short', hourCycle: 'h23' });
}

export function printOfflineTime(dhm : T_TimeOfflinePeriod) : string{
    return `${dhm.dateOffset}d${dhm.hours}h${dhm.minutes}m`
}

