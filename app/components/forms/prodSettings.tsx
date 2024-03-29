import { useState } from "react";

import { capitalise, resourceCSS } from '@/app/utils/formatting';
import { T_DATA_KEYS, getWorkerOutputsFromJSON } from "@/app/utils/getDataFromJSON";
import { calcInitSettingsForModal } from "@/app/utils/productionSettingsHelpers";
import { T_Levels, T_ProductionSettings, T_SwitchAction, } from '@/app/utils/types';

import Modal, { ModalSubmitButton, ModalFieldsWrapper, I_Modal } from '../subcomponents/modal';

import Radio from './subcomponents/radio';
import { calcDateWithTimeDisplayStr, convertDateToTimeID } from "@/app/utils/dateAndTimeHelpers";
import { T_ProdSettingsNowModalProps } from "../planner/utils/useSwitchProductionNow";
import { useCurrentMinute } from "./utils/useCurrentMinute";

interface I_ModalProdSettings extends Pick<I_Modal, "closeModal"> {
    initialProdSettings : T_ProductionSettings, 
    currentSwitches : T_SwitchAction[], 
    updateProdSettings : (data : T_ProductionSettings) => void, 
    levels : T_Levels,
    nowModalProps? : T_ProdSettingsNowModalProps,
}
export default function ModalProdSettings({closeModal, initialProdSettings, currentSwitches, updateProdSettings, levels, nowModalProps } 
    : I_ModalProdSettings)
    : JSX.Element {

    const [toggles, setToggles] = useState<T_ProductionSettings>(calcInitSettingsForModal(initialProdSettings, currentSwitches));
    
    const timeNow : Date = useCurrentMinute();
    const disableEntireForm = isTooLateForSwitchAtTop({nowModalProps, timeNow});

    function handleChange(key : string, changeTo : string){
        setToggles(prev => {
            return {
                ...prev,
                [key]: changeTo
            }
        });
    }

    function handleSubmit(){
        updateProdSettings(toggles);
        closeModal();
    }

    return(
        <Modal 
            heading={"Production Settings"}
            closeModal={closeModal}
            >
            {
                nowModalProps === undefined ?
                    null
                    : disableEntireForm ?
                        <NotificationAtTop
                            message={"Too close to the time of the first upgrade. Please update game status."}
                            mode={"error"}
                        />
                        : nowModalProps.firstTimeGroup === undefined ?
                            <NotificationAtTop
                                message={"All upgrades are purchased, so changing production settings here will have no effect."}
                                mode={"attention"}
                            />
                            :                    
                            <MessageForNow 
                                firstTimeGroup={nowModalProps.firstTimeGroup}
                                timeNow={timeNow}
                            />
            }
            <form onSubmit={handleSubmit} className={"flex flex-col w-full"}>
                <ModalFieldsWrapper>
                    <div className={"flex flex-col items-center gap-6 my-1 mx-2"}>
                    {
                        Object.keys(initialProdSettings).map((myKey : string) => {
                            return <ProductionToggle key={myKey} 
                                        myKey={myKey} 
                                        toggledTo={toggles[myKey as keyof typeof toggles]} 
                                        handleSelection={handleChange} 
                                        disabled={disableEntireForm || levels[myKey as keyof typeof levels] === 0}
                                    />
                        })
                    }
                    </div>
                </ModalFieldsWrapper>
                <ModalSubmitButton label={"set"} extraCSS={''} disabled={disableEntireForm} />
            </form>
        </Modal>
    )
}


interface I_ProductionToggle {
    myKey : string,
    toggledTo : string,
    disabled : boolean,
    handleSelection : (myKey : string, changeTo : string) => void
}
function ProductionToggle({ myKey, toggledTo, handleSelection, disabled }
    : I_ProductionToggle)
    : JSX.Element | null {

    let outputs = getWorkerOutputsFromJSON(myKey as T_DATA_KEYS);
    if(outputs === null){
        return null;
    }
    let numOutputs = outputs.length;

    if(numOutputs === 1){
        return null;
    }

    let labelCSS = disabled ?
                    " " + "text-gray-300"
                    : "";
    return (
        <fieldset className={"w-full relative flex justify-end"}>
            <legend className={"absolute top-0 left-0 mb-1 flex items-center gap-2 block" + labelCSS} >
                <span className={"w-14 font-semibold"}>{ capitalise(myKey) }</span>
                <span className={"sr-only"}>is producing</span>
                {
                    disabled ?
                    <span>n/a</span>
                    : <CurrentAsCircleBadge type={toggledTo} />
                }
            </legend>
            <div className="flex w-24">
            {
                outputs.map((output, idx) => {
                    return  <Radio key={`${myKey}_${output}`} 
                                extraCSS={"w-2/4"} 
                                checked={output === toggledTo} 
                                disabled={false} 
                                onChange={() => handleSelection(myKey, output)} 
                                value={`${myKey}_${output}`}
                                name={"productionSettings"}
                                >
                                <ToggleDisplay 
                                    thisOption={output} 
                                    activeOption={toggledTo} 
                                    roundLeft={idx === 0} 
                                    roundRight={idx === numOutputs - 1} 
                                    disabled={disabled} 
                                />
                            </Radio> 
                })
            }
            </div>
        </fieldset>
    )
}


function CurrentAsCircleBadge({type} 
    : { type: string })
    : JSX.Element {

    let typeCSS = resourceCSS[type as keyof typeof resourceCSS];

    return(
        <div className={"flex items-center"}>
            <div className={"inline-block w-3 h-3 rounded-full border" + " " + typeCSS.badge}>             
            </div>
            <span className={"pl-1"}>
                { type }
            </span>
        </div>
    )
}

interface I_ToggleDisplay {
    thisOption : string, 
    activeOption : string, 
    roundLeft : boolean, 
    roundRight : boolean, 
    disabled : boolean,
}
function ToggleDisplay({thisOption, activeOption, roundLeft, roundRight, disabled} 
    : I_ToggleDisplay)
    : JSX.Element {

    let typeCSS = resourceCSS[thisOption as keyof typeof resourceCSS];

    let roundingCSS =  roundLeft ?
                            "rounded-l-full"
                            : roundRight ?
                                "rounded-r-full"
                                : "";
    let opacityCSS = disabled ?
                        "opacity-10"
                        : thisOption !== activeOption ?
                            "opacity-30" 
                            : "";
    let hoverCSS = disabled ?
                    ""
                    : typeCSS.hover;
    let conditionalCSS = roundingCSS + " " + opacityCSS + " " + hoverCSS;

    return(
        <div className={"duration-75 ease-linear flex justify-center content-center border-2" + " " + typeCSS.badge + " " + conditionalCSS}>
            { thisOption.charAt(0).toLowerCase() }
        </div>
    )
}


function NotificationAtTop({message, mode}
    : { message : string, mode : "error" | "attention" })
    : JSX.Element {

    let conditionalCSSForP : string = mode === "error" ?
        "border-red-600 bg-white"
        : "border-amber-500 bg-amber-50";

    return  <p className={`mt-5 py-1 text-xs border-l-4 shadow px-2 ${conditionalCSSForP}`}>
                {message}
            </p>
}


function MessageForNow({firstTimeGroup, timeNow }:
    Pick<T_ProdSettingsNowModalProps, "firstTimeGroup"> & { timeNow : Date })
    : JSX.Element | null {

    if(firstTimeGroup === undefined){
        return  <NotificationAtTop
                    message={"An error has occurred. Try refreshing the page or updating the game status."}
                    mode={"error"}
                />
    }

    return  <p className={"mt-5 text-sm flex flex-col items-center gap-1 bg-white rounded py-2"}>
                Adjusting settings starting from
                <span className={"block font-semibold inline rounded px-1.5 py-0.5 bg-violet-100"}>
                    {calcDateWithTimeDisplayStr(timeNow)}
                </span>
            </p>
}


function isTooLateForSwitchAtTop({nowModalProps, timeNow}
    : Pick<I_ModalProdSettings, "nowModalProps"> & { timeNow: Date })
    : boolean {

    let disableEntireForm = false;
    if(nowModalProps !== undefined && nowModalProps.firstTimeGroup !== undefined){
        const minimumProductionTimeUnit = 1;
        const adjustForTimeIDRoundingErrors = 2;
        const expiryTimeID = nowModalProps.firstTimeGroup.timeID - minimumProductionTimeUnit - adjustForTimeIDRoundingErrors;
        const nowTimeID = convertDateToTimeID(timeNow, nowModalProps.gameState);
        disableEntireForm = nowTimeID >= expiryTimeID;
    }
    return disableEntireForm;
}