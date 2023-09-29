import { ChangeEvent } from "react";
import { calcOptionsForNumberRange } from "../utils/timeOptions";

export interface I_SelectProps {
    id : string,
    options : T_OptionData[],
    handleChange : (e: React.ChangeEvent<HTMLSelectElement>) => void,
    initValue : string | null | undefined,
    selectExtraCSS? : string
}

export default function Select({id, selectExtraCSS, options, handleChange, initValue} 
    : I_SelectProps)
    : JSX.Element {

    initValue = initValue === null ? undefined : initValue;

    return  <select id={id} onChange={(e) => handleChange(e)} defaultValue={initValue} className={"border border-neutral-300 rounded-sm"+ " " + selectExtraCSS}>
            {
                options.map( (ele, idx) => {
                    return <Option key={idx} valueStr={ele.valueStr} displayStr={ele.displayStr} />
                })
            }
            </select>
}

interface I_SelectWithLabelProps extends I_SelectProps {
    labelDisplay : string,
    labelExtraCSS? : string,
}

export function SelectWithLabel({id, labelExtraCSS, selectExtraCSS, labelDisplay, options, handleChange, initValue} 
    : I_SelectWithLabelProps)
    : JSX.Element {

    initValue = initValue === null ? undefined : initValue;

    return (
        <>
            <label className={labelExtraCSS} htmlFor={id}>{labelDisplay}</label>
            <Select id={id} selectExtraCSS={selectExtraCSS} options={options} handleChange={handleChange} initValue={initValue} />
        </>
    )

}


interface I_SelectWithSRLabel extends I_SelectProps {
    visualLabel: string,
    srLabel : string,
    extraCSS? : string,
}
export function SelectWithSRLabel({id, selectExtraCSS, options, handleChange, initValue, visualLabel, srLabel, extraCSS}
    : I_SelectWithSRLabel)
    : JSX.Element {

    return <div>
                <label htmlFor={id} className={"text-sm" + " " + extraCSS}>
                    <span className={"sr-only"}>{srLabel}</span>
                    <span aria-hidden={true}>{visualLabel}</span>
                </label>
                <Select id={id} selectExtraCSS={selectExtraCSS} options={options} handleChange={handleChange} initValue={initValue} />
            </div>
}


export function SelectHours({id, handleChange, initValue}
    : Pick<I_SelectProps, "id" | "handleChange" | "initValue">)
    : JSX.Element {
    return  <SelectWithSRLabel
                id={id}
                selectExtraCSS={undefined}
                handleChange={(e : ChangeEvent<HTMLSelectElement>) => handleChange(e)}
                initValue={initValue}
                options={calcOptionsForNumberRange(0, 23)} 
                visualLabel={""}
                srLabel={"time: hour"}
                extraCSS={"px-1"}
            />
}


export function SelectMinutes({id, handleChange, initValue}
    : Pick<I_SelectProps, "id" | "handleChange" | "initValue">)
    : JSX.Element {
    return  <SelectWithSRLabel
                id={id}
                selectExtraCSS={undefined}
                handleChange={(e : ChangeEvent<HTMLSelectElement>) => handleChange(e)}
                initValue={initValue}
                options={calcOptionsForNumberRange(0, 59)} 
                visualLabel={":"}
                srLabel={"time: minute"}
                extraCSS={"px-1"}
            />
}




export type T_OptionData = {
    valueStr : string,
    displayStr : string   
}

function Option({valueStr, displayStr} : T_OptionData){
    return (
        <option value={valueStr}>{displayStr}</option>
    )
}