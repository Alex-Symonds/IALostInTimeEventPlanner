import { useState } from "react";

import UPGRADE_DATA from '../upgrades.json';

import { deepCopy } from "../utils/consts";
import { defaultProductionSettings } from '../utils/defaults';
import { capitalise, resourceCSS } from '../utils/formatting';
import { T_Levels, T_ProductionSettings, T_SwitchAction } from '../utils/types';

import Modal, { ModalHeading, ModalSubmitButton, I_Modal } from './modal';
import Radio from './radio';


interface I_ModalProdSettings extends Pick<I_Modal, "closeModal"> {
    currentProdSettings : T_ProductionSettings, 
    currentSwitches : T_SwitchAction[], 
    updateProdSettings : (data : T_ProductionSettings) => void, 
    levels : T_Levels
}
export default function ModalProdSettings({closeModal, currentProdSettings, currentSwitches, updateProdSettings, levels} 
    : I_ModalProdSettings)
    : JSX.Element {

    const [toggles, setToggles] = useState<T_ProductionSettings>(getInitSettingsForModal(currentProdSettings, currentSwitches));

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
        <Modal closeModal={closeModal}>
            <form onSubmit={handleSubmit} className={"flex flex-col w-full"}>
                <ModalHeading>
                    Switch Production
                </ModalHeading>

                <div className={"flex flex-col items-center gap-2 px-3 pb-4 mt-1"}>
                {
                    Object.keys(currentProdSettings).map((myKey : string) => {
                        return <ProductionToggle key={myKey} 
                                    myKey={myKey} 
                                    toggledTo={toggles[myKey as keyof typeof toggles]} 
                                    handleSelection={handleChange} 
                                    disabled={levels[myKey as keyof typeof levels] === 0}
                                />
                    })
                }
                </div>
                <ModalSubmitButton label={"submit"} extraCSS={"mt-2"} disabled={false} />
            </form>
        </Modal>
    )
}

function getInitSettingsForModal(currentProdSettings : T_ProductionSettings, currentSwitches : T_SwitchAction[])
    : T_ProductionSettings {

    let result : T_ProductionSettings = deepCopy(defaultProductionSettings);
    for(const [k, v] of Object.entries(currentProdSettings)){
        let idx = currentSwitches.findIndex(ele => ele.key === k);
        let newValue = v;
        if(idx !== -1){
            newValue = currentSwitches[idx].to
        }
        result[k as keyof T_ProductionSettings] = newValue;
    }
    return result;
}

interface I_ProductionToggle {
    myKey : string,
    toggledTo : string,
    disabled : boolean,
    handleSelection : (myKey : string, changeTo : string) => void
}
function ProductionToggle({myKey, toggledTo, handleSelection, disabled}
    : I_ProductionToggle)
    : JSX.Element | null {

    let data = UPGRADE_DATA[myKey as keyof typeof UPGRADE_DATA];
    if(!('outputs' in data)){
        return null;
    }
    let numOutputs = data.outputs.length;

    if(numOutputs === 1){
        return null;
    }

    let containerCSS = "w-32";
    let labelCSS = "mb-1";
    labelCSS += disabled ?
                " " + "text-gray-300"
                : "";
    
    return (
        <fieldset className={containerCSS}>
            <legend className={labelCSS} >
                { capitalise(myKey) }&nbsp;&raquo;&nbsp;{
                    disabled ?
                    <span>n/a</span>
                    : <CurrentAsCircleBadge type={toggledTo} />
                }
                </legend>
            <div className="flex">
            {
                data.outputs.map((d, idx) => {
                    return <Radio key={`${myKey}_${d}`} extraCSS={"w-2/4"} checked={d === toggledTo} disabled={false} handleSelection={() => handleSelection(myKey, d)} value={`${myKey}_${d}`}>
                        <ToggleDisplay thisOption={d} activeOption={toggledTo} roundLeft={idx === 0} roundRight={idx === numOutputs - 1} disabled={disabled} />
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
        <>
            <div className={"inline-block w-3 h-3 rounded-full" + " " + typeCSS.badge}>             
            </div>
            <span className={"pl-1"}>
                {type}
            </span>
        </>
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
    let opacityCSS = thisOption === activeOption && !disabled ?
                        "" 
                        : "opacity-20";
    let hoverCSS = disabled ?
                    ""
                    : typeCSS.hover;
    let conditionalCSS = roundingCSS + " " + opacityCSS + " " + hoverCSS;

    return(
        <div className={"flex justify-center content-center py-1 border-2" + " " + typeCSS.badge + " " + conditionalCSS}>
            {thisOption.charAt(0).toUpperCase()}
        </div>
    )
}