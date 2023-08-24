interface I_Radio {
    checked : boolean, 
    extraCSS? : string, 
    disabled : boolean, 
    handleSelection: () => void, 
    value : string, 
    children : React.ReactNode
}

export default function Radio({checked, extraCSS, disabled, handleSelection, value, children} 
    : I_Radio)
    : JSX.Element {

    disabled = disabled ?? false;
    
    return  <label className={extraCSS}>
                <input type={"radio"} className={"sr-only"} value={value} checked={checked} disabled={disabled} onChange={() => handleSelection()} onClick={() => handleSelection()} />
                {children}
            </label>
}