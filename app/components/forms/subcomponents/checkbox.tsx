
import { IconCheck } from "../../subcomponents/icons";

interface I_Checkbox{
    checked: boolean,
    disabled: boolean,
    idStr: string,
    name: string,
    displayText: string,
    value: string,
    onChange: () => void,
}
export default function Checkbox({checked, disabled, onChange, idStr, name, displayText, value} : I_Checkbox){

    const checkedClasses = checked ?
        "bg-violet-600 border-violet-800"
        : "bg-white border-neutral-300"

    return  <label className={"flex gap-2 items-center"}>
                <input  hidden 
                        checked={checked} type="checkbox" 
                        disabled={disabled} id={idStr} name={name} value={value} 
                        onChange={onChange}
                />
                <span className={"block w-20 ml-2 text-black font-semibold"}>
                    { displayText }
                </span>
                <span className={`ease-in duration-100 rounded w-5 h-5 flex items-center justify-center border ${checkedClasses}`}>
                    { checked ?
                        <IconCheck size={"16"} colour={"white"}/>
                        : null
                    }
                </span>
            </label>
}