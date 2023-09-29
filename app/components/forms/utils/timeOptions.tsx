import { ChangeEvent } from "react";

import { T_GameState } from "@/app/utils/types";
import { calcMonthName } from "@/app/utils/dateAndTimeHelpers";

import { T_OptionData } from "../subcomponents/select";

//calcOptionsForNumberRange : (firstNum : number, lastNum : number) => T_OptionData[]
export function calcOptionsForNumberRange(firstNum : number, lastNum : number){
    let options : T_OptionData[] = [];
    for(let i = firstNum; i <= lastNum; i++){
        let iStr = i.toString();
        options.push({
            valueStr: iStr,
            displayStr: iStr.padStart(2, '0')
        });
    }
    return options;
}


interface I_ValidDatesKit {
    gameState : T_GameState,
}

type T_DateAndMonth = { date: number, month: number };
type T_OutputOfflineTimesInputKit = {
    selectedDateAsIndex : (e : ChangeEvent<HTMLSelectElement>) => number,
    validDates : T_DateAndMonth[],
    convertValidDatesToOptions : (dateObj : T_DateAndMonth[]) => T_OptionData[],
}
export function validDatesKit({ gameState }
    : I_ValidDatesKit )
    : T_OutputOfflineTimesInputKit {
    const validDates = calcValidDates();

    function selectedDateAsIndex(e : ChangeEvent<HTMLSelectElement>){
        return validDates.findIndex(ele => ele.date === parseInt(e.target.value));
    }

    function calcValidDates(){
        let endTime = new Date(gameState.startTime.getTime() + 3 * 24 * 60 * 60 * 1000);

        let validDates : { date: number, month: number }[] = [];
        let loopTime = new Date(gameState.startTime.getTime());
        while(loopTime.getTime() <= endTime.getTime()){
            validDates.push({
                date: loopTime.getDate(), 
                month: loopTime.getMonth()
            });
            loopTime.setDate(loopTime.getDate() + 1);
        }

        return validDates;
    }

    function convertValidDatesToOptions(validDates 
        : { date : number, month : number }[])
        : T_OptionData[]{

        return validDates.map(ele => {
            return {
                valueStr: ele.date.toString(),
                displayStr: `${ele.date} ${calcMonthName(ele.month)}`
            }
        });
    }

    return {
        selectedDateAsIndex,
        validDates,
        convertValidDatesToOptions
    }
}