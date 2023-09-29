/*
    UI form for "plan mode"
    No need for "progress" inputs in this case, so we can show the user a more simplified form.
    Add ability to try different start times

*/

import AllEggs from "./fieldAllEggs";
import AdBoost from "./fieldAdBoost";

import { InputPageWrapper } from "../gameState"
import { SelectHours, SelectMinutes } from '../../subcomponents/select';
import { ModalSubmitButton } from "@/app/components/subcomponents/modal";
import { usePlanGameStatusForm } from "../utils/usePlanGameStatusForm";
import { deepCopy } from "@/app/utils/consts";
import { Label, I_StatusFormSharedProps } from "../gameState";

export default function FormPlanMode({gameState, setGameState, closeModal, isInitialisingMode } 
    : I_StatusFormSharedProps & { isInitialisingMode : boolean })
    : JSX.Element {

    const {
        onSubmit,
        setAllEggs,
        hasAdBoost,
        toggleAdBoost,
        startTime,
        setStartTime,
    } = usePlanGameStatusForm({gameState, setGameState, closeModal});


    return  <form onSubmit={(e) => onSubmit(e)}>
                <InputPageWrapper isVisible={true}>
                    <div className={`flex flex-col gap-6 ${isInitialisingMode ? "mt-3" : "mt-5"}`}>
                        <StartTime 
                            startTime={startTime} 
                            setStartTime={setStartTime} 
                        />
                        <AllEggs gameState={gameState} handleLevelChange={setAllEggs} />
                        <AdBoost hasAdBoost={hasAdBoost} toggleAdBoost={toggleAdBoost} />
                    </div>
                </InputPageWrapper>
                <ModalSubmitButton 
                    label={"submit"} 
                    disabled={false}
                />
            </form>
}


function StartTime({ startTime, setStartTime } : any) : JSX.Element {

    function handleHourChange(e : React.ChangeEvent<HTMLSelectElement>){
        let newTime = deepCopy(startTime);
        newTime.setHours(parseInt(e.target.value));
        setStartTime(newTime);
    }

    function handleMinuteChange(e : React.ChangeEvent<HTMLSelectElement>){
        let newTime = structuredClone(startTime);
        newTime.setMinutes(parseInt(e.target.value));
        setStartTime(newTime);
    }

    return  <fieldset className={"flex items-center"}>
                <span><Label htmlFor={""} tagName="legend">Starting At</Label></span>
                <div className={"flex items-center"}>
                    <SelectHours
                        id={"id_planStartHour"}
                        initValue={startTime.getHours().toString()}
                        handleChange={handleHourChange}
                    />
                    <SelectMinutes
                        id={"id_planStartMinute"}
                        initValue={startTime.getMinutes().toString()}
                        handleChange={handleMinuteChange}
                    />
                </div>
            </fieldset>
}


