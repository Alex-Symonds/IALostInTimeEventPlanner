import { within } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"

export const offlinePeriodOvernight = {
    start: {    
        dateOffset: 1,
        hours: 0,
        minutes: 0
    },
    end: {    
        dateOffset: 1,
        hours: 8,
        minutes: 0
    }
}


export const textIdentifiers = {
    gameStateForm: {
        planMode: "Select input mode",
    }
}


export const workerLevels = {
    trinity: 10,
    bronte: 9,
    anne: 8,
    petra: 7,
    manny: 6,
    tony: 5,
    ruth: 4,
    rex: 3
}


export const levels = {
    ...workerLevels,
    blue: 2,
    green: 3,
    red: 1,
    yellow: 1,
    dust: 2,
    speed: 4,
}

export const nonZeroEggStockpiles = {
    blue: 236544,
    green: 12345,
    red: 2534,
    yellow: 4374,
}

export const nonZeroStockpiles = {
    ...nonZeroEggStockpiles,
    dust: 47845747,
}


export async function checkSelect(selectEle : HTMLSelectElement, optionText : string, optionId : string){
    await userEvent.selectOptions(selectEle, [within(selectEle).getByText(optionText)]);
    expect(selectEle.value).toBe(optionId);
}