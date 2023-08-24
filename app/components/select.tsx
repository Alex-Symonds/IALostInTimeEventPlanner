interface I_SelectProps {
    id : string,
    labelDisplay : string,
    options : T_OptionData[],
    handleChange : (e: React.ChangeEvent<HTMLSelectElement>) => void,
    initValue : string | null | undefined,
    labelExtraCSS? : string,
    selectExtraCSS? : string
}

export default function Select({id, labelExtraCSS, selectExtraCSS, labelDisplay, options, handleChange, initValue} : I_SelectProps){
    initValue = initValue === null ? undefined : initValue;

    return (
        <>
            <label className={labelExtraCSS} htmlFor={id}>{labelDisplay}</label>
            <select id={id} onChange={(e) => handleChange(e)} defaultValue={initValue} className={"border border-neutral-200"+ " " + selectExtraCSS}>
            {
                options.map( (ele, idx) => {
                    return <Option key={idx} valueStr={ele.valueStr} displayStr={ele.displayStr} />
                })
            }
            </select>
        </>
    )

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