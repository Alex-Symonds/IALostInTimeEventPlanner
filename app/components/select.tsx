interface I_SelectProps {
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


export type T_OptionData = {
    valueStr : string,
    displayStr : string   
}

function Option({valueStr, displayStr} : T_OptionData){
    return (
        <option value={valueStr}>{displayStr}</option>
    )
}