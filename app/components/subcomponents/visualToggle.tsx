import { IconEyeClosed, IconEyeOpen } from "./icons";

interface I_VisualToggle {
    onChange : () => void,
    toggledOn : boolean,
    displayText : string,
    idStr : string,
    name : string,
    value : string,
}

export default function VisualToggle({onChange, idStr, name, value, toggledOn, displayText} 
    : I_VisualToggle)
    : JSX.Element {

    return  <form className={"md:hidden"}>
                <label className={"flex flex-col items-center gap-0.5"}>
                    <input  checked={toggledOn} type="checkbox" 
                            disabled={false} id={idStr} name={name} value={value} 
                            onChange={onChange}
                            className={"sr-only"}
                    />
                    <span className={"block text-xs text-black font-medium"}>
                        { displayText }
                    </span>
                    <div
                        className={`relative h-6 w-[3.25rem] px-1 rounded-full ${toggledOn ? "bg-violet-600 hover:bg-violet-500" : "bg-neutral-400 hover:bg-neutral-500"}`}
                        >
                    {toggledOn ?
                        <div className={"absolute left-1.5 top-[calc(0.25rem_-_1px)]"}>
                            <IconEyeOpen size={"18px"} colour={ toggledOn ? "white" : "transparent" }/>
                            <p className={"sr-only"}>shown</p>
                        </div>
                        :
                        <div className={"absolute right-1.5 top-1"}>
                            <IconEyeClosed size={"18px"} colour={ toggledOn ? "transparent" : "white" } />
                            <p className={"sr-only"}>hidden</p>
                        </div>
                    }
                        <div className={`absolute top-1 h-4 w-4 bg-white rounded-full ease-in duration-200 ${toggledOn ? "translate-x-[1.75rem]" : ""}`}></div> 
                    </div>
                </label>
            </form>

}