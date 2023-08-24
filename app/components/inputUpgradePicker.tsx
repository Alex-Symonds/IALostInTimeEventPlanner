import { useState } from "react";

import UPGRADE_DATA from '../upgrades.json';

import { moveIsValid } from '../utils/editPlan';
import { toThousands, resourceCSS } from "../utils/formatting";

import { BadgeCost, BadgeMaxed } from "./badges";
import Modal, { ModalSubmitButton, I_Modal } from './modal';
import Radio from './radio';
import { T_GameState, T_PurchaseData, T_Stockpiles, T_CostData } from "../utils/types";



export interface I_UpgradePickerModal extends Pick<I_Modal, "closeModal"> {
    movePlanElement : (data : {oldIdx : number, newIdx : number}) => void, 
    pickerTargetIdx : number | null, 
    purchaseData : T_PurchaseData[], 
    gameState : T_GameState
}


export default function UpgradePickerModal({closeModal, movePlanElement, pickerTargetIdx, purchaseData, gameState } 
    : I_UpgradePickerModal)
    {
    const [fromIdx, setFromIdx] = useState<number>(pickerTargetIdx ?? -1);
    const radioData = getUpgradeRadioData({ targetIdx: pickerTargetIdx ?? -1, purchaseData, gameState });

    if(pickerTargetIdx === null){
        return;
    }

    function handleClick(e : React.FormEvent){
        e.preventDefault();
        movePlanElement({oldIdx: fromIdx, newIdx: pickerTargetIdx ?? -1});
        closeModal();
    }

    return(
        <Modal closeModal={closeModal}>
            <form className={"flex flex-col gap-2 items-center h-auto gap-2 mt-2 pb-2"} onSubmit={handleClick}>
                <fieldset className={"flex flex-col w-full mt-3"}> 
                    <legend className={"font-bold text-lg mb-1"}>Select upgrade</legend>
                    <StockpilesDisplay stockpiles={purchaseData[pickerTargetIdx].stockpiles} />
                    <div>
                        {
                            radioData.map((data, idx : number) => {
                                let result = moveIsValid({srcIdx: data.fromIdx, dstIdx: pickerTargetIdx, purchaseData});
                                let isDisabled = result.isValid === false;
                                let {key : myKey, fromIdx : myFromIdx, ...unitPickerData} = data;

                                return <UpgradeRadio key={idx}
                                            checked={myFromIdx === fromIdx} 
                                            myKey={myKey} 
                                            data={unitPickerData} 
                                            handleSelection={() => setFromIdx(myFromIdx)} 
                                            disabled={isDisabled} 
                                        />
                            })
                        }
                    </div>
                </fieldset>
                <ModalSubmitButton label={"pick"} disabled={false} extraCSS={undefined} />
            </form>
        </Modal>

    )
}


function StockpilesDisplay({stockpiles} 
    : {stockpiles : T_Stockpiles})
    : JSX.Element {

    return (
        <div className={"mt-1 mb-2"}>
            <div className={"flex overflow-hidden gap-1"}>
                <Stockpile myKey={'blue'} data={stockpiles} />
                <Stockpile myKey={'green'} data={stockpiles} />
                <Stockpile myKey={'red'} data={stockpiles} />
                <Stockpile myKey={'yellow'} data={stockpiles} />
            </div>
        </div>
    )
}


function Stockpile({myKey, data} 
    : { myKey : string, data : T_Stockpiles})
    : JSX.Element {

    return (
        <div className={"flex rounded justify-between text-sm w-16 px-1 gap-1" + " " + resourceCSS[myKey as keyof typeof resourceCSS].badge}>
            <div>{myKey.charAt(0).toUpperCase()}</div>
            <div>{toThousands(data[myKey as keyof typeof data])}</div>
        </div>
    )
}


interface I_UpgradeRadio {
    checked : boolean, 
    myKey : string, 
    data : T_UnitPickerData,
    handleSelection : () => void, 
    disabled : boolean
}

function UpgradeRadio({checked, myKey, data, handleSelection, disabled} 
    : I_UpgradeRadio)
    : JSX.Element {

    return(
        <Radio checked={checked} disabled={disabled} handleSelection={handleSelection} value={myKey}>
            <UnitPickerCard checked={checked} disabled={disabled} data={data}/>
        </Radio>
    )
}

interface I_UnitPickerCard extends Pick<I_UpgradeRadio, "checked" | "disabled">{
    data : T_UnitPickerData
}
type T_UnitPickerData = {
    name : string,
    level : number,
    isMaxLevel: boolean,
    costs: T_CostData[]
}
function UnitPickerCard({checked, disabled, data} 
    : I_UnitPickerCard)
    : JSX.Element {

    const [isHover, setIsHover] = useState(false);

    let wrapperColours = checked ?
                            "bg-violet-100 border-violet-500"
                            : disabled ?
                                "bg-gray-100 border-gray-200 text-gray-300"
                                : "bg-gray-200 border-gray-300 hover:bg-violet-50 hover:border-violet-300"
    
    let wrapperRounded = checked ?
                            "rounded-r"
                            : disabled ?
                                "rounded":
                                isHover ?
                                    "rounded-r"
                                    : "rounded";

    let conditionalCSS_wrapper = wrapperColours + " " + wrapperRounded;

    let costCSS = disabled ?
                            "opacity-20"
                            : "";

    let selectedMarker = checked ?
                        "bg-violet-500"
                        : isHover && !disabled ?
                            "bg-violet-300"
                            : "bg-transparent";

    return(
        <div className={"flex border m-1" + " " + conditionalCSS_wrapper} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <div className={"w-1" + " " + selectedMarker}>
            </div>
            <div className={"upgradePicker-card mr-5"}>
                <span className={"block text-sm ml-2 px-1 flex items-center"}>{data.name}</span>
                <span className={"block text-sm p-1 font-bold flex items-center"}>{data.isMaxLevel ? " " : data.level}</span>
                <div className={"flex gap-1 py-1" + " " + costCSS}>
                    {   
                        data.isMaxLevel ?
                            <BadgeMaxed extraCSS={undefined} />
                            : data.costs === null || data.costs.length === 0 ?
                                "free"
                                : data.costs.map((cost : any, idx : number) => {
                                    return <BadgeCost key={idx} data={cost} extraCSS={undefined}/>
                                })
                    }
                </div>
            </div>
        </div>
    )
}


interface I_GetUpgradeRadioData extends Pick<I_UpgradePickerModal, "purchaseData" | "gameState">{
    targetIdx : number
}
type T_UpgradeRadioData = 
    T_UnitPickerData & {
    key : string,
    fromIdx : number,
}
function getUpgradeRadioData({ targetIdx, purchaseData, gameState } 
    : I_GetUpgradeRadioData)
    : T_UpgradeRadioData[] {

    let result : T_UpgradeRadioData[] = [];

    // planData[#].levels displays the level of each unit after purchasing the planned upgrade.
    // To get the levels before purchasing the planned upgrade, consult the previous element.
    let levelsAtStart = targetIdx === 0 ? 
                        gameState.levels
                        : purchaseData[targetIdx - 1].levels;

    for(const [k, v] of Object.entries(UPGRADE_DATA)){
        let levelAtStart = levelsAtStart[k as keyof typeof levelsAtStart];
        let maxLevel = v.upgrades.length;
        let newLevel = levelAtStart + 1;

        let purchaseDataIdx = newLevel > maxLevel ?
                            -1
                            : purchaseData.findIndex((ele : any) => {
                                return ele.key === k && ele.level === newLevel
                            });

        result.push({
            key: k,
            fromIdx: purchaseDataIdx,
            name: v.name,
            level: newLevel,
            isMaxLevel: maxLevel < newLevel,
            costs: maxLevel < newLevel ? [] : v.upgrades[newLevel - 1].costs
        });
    }

    return result;
}