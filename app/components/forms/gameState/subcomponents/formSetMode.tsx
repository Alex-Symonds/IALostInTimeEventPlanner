import { useState } from "react";

import { InputPageWrapper } from "../gameState";

import Radio from '../../subcomponents/radio';
import { PlanMode, T_PlanModeKit } from "@/app/utils/usePlanMode";
import { Button } from "../../subcomponents/buttons";


interface I_ModeSetter extends T_PlanModeKit{
    close : () => void,
}

export default function FormSetMode({ mode, setMode, close } 
    : I_ModeSetter) 
    : JSX.Element {

    const [controlled, setControlled] = useState<PlanMode | null>(null);

    function onSubmit(e : React.SyntheticEvent){
        e.preventDefault();
        if(controlled !== null){
            setMode(controlled);
        }
        close();
    }

    const planIsSelected = (controlled === null && mode === PlanMode.plan) || controlled === PlanMode.plan;
    const activeIsSelected = (controlled === null && mode === PlanMode.active) || controlled === PlanMode.active;
    const radioGroupName = "setMode";
    return  <form onSubmit={(e) => onSubmit(e)}>
                <InputPageWrapper isVisible={true}>
                    <fieldset className={"flex flex-col gap-6"}>
                        <legend className={"flex flex-col mb-5"}>
                            <span className={"font-bold text-base ml-1"}>Select input mode</span>
                            <span className={"font-medium text-sm text-neutral-600 ml-1"}>(you can change this later)</span>
                        </legend>

                        <Radio 
                            checked={ planIsSelected }
                            disabled={ false }
                            onChange={ () => setControlled(PlanMode.plan) }
                            value={"planMode"}
                            name={radioGroupName}
                            >
                                <OptionBox 
                                    title={"Plan"}
                                    description={"Work out a plan in advance"}
                                    bullets={[
                                        "Try different start times",
                                        "Skip inputting in-progress details",
                                    ]}
                                    isSelected={ planIsSelected } 
                                />
                        </Radio>
                        <Radio 
                            checked={ activeIsSelected }
                            disabled={ false }
                            onChange={ () => setControlled(PlanMode.active) }
                            value={"activeMode"}
                            name={radioGroupName}
                            >
                                <OptionBox 
                                    title={"Active"}
                                    description={"Event is running now: view and adjust your plan as you go"}
                                    bullets={[
                                        "Skip inputting start time",
                                        "Update time remaining, stockpiles and levels as necessary",
                                    ]}
                                    isSelected={ activeIsSelected } 
                                />
                        </Radio>
                    </fieldset>
                </InputPageWrapper>
            
                <Button
                    key={"mode_set"}
                    size={"default"}
                    colours={"primary"}
                    htmlType={"submit"}
                    disabled={ mode !== PlanMode.active && mode !== PlanMode.plan && controlled === null }
                    >
                    next&nbsp;&raquo;
                </Button>
            </form>
}//next&nbsp;&raquo;


function OptionBox({title, description, bullets, isSelected} : any){

    const [hover, setHover] = useState(false);

    const wrapperSelectedCSS = isSelected ? 
        "border-violet-500 bg-violet-100"
        : "border-gray-300 hover:bg-violet-50 hover:border-violet-300";
    const hrSelectedCSS = isSelected ?
        "border-violet-400"
        : hover ?
            "border-violet-300"
            : "border-gray-300";

    return  <div className={`ease-linear duration-75 border-2 rounded px-4 pt-3 pb-5 ${wrapperSelectedCSS} hover:border-violet-`}
                onMouseEnter={() => setHover(true) }
                onMouseLeave={() => setHover(false)}
                >
                <h4 className={"font-semibold text-base"}>{title}</h4>
                <p className={"mt-2 text-sm"}>{description}</p>
                <hr className={`ease-linear duration-75 my-4 border-t ${hrSelectedCSS}`}></hr>
                <ul className={"list-disc ml-5 text-xs"}>
                    { bullets.map((ele : string, idx : number) => {
                        return  <li key={`${idx}_${ele.substring(0,3)}_${ele.substring(-3)}`}
                                    className={"mt-1"}
                                    >
                                    {ele}
                                </li>
                    })

                    }
                </ul>
            </div>
}