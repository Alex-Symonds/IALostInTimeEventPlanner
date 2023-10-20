import { useState } from "react";

import { T_GameState, T_PurchaseData, T_Stockpiles, T_CostData, } from "../../utils/types";

import { moveIsValid } from '../planner/utils/moveIsValid';

import { BadgeCost, BadgeMaxed } from "../subcomponents/badges";
import Modal, { ModalLegend, ModalSubmitButton, I_Modal, ModalFieldsWrapper } from '../subcomponents/modal';
import StockpilesDisplay from "../subcomponents/stockpilesStrip";
import Tooltip from '../subcomponents/tooltip';

import { InfoButton } from "./subcomponents/buttons";
import Radio from './subcomponents/radio';

import { calcUpgradePickerRadioData, calcStockpilesIncludingCurrentPurchase } from "./utils/upgradePickerHelpers";


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
    const radioData = calcUpgradePickerRadioData({ targetIdx: pickerTargetIdx ?? -1, purchaseData, gameState });

    if(pickerTargetIdx === null){
        return;
    }

    function handleClick(e : React.FormEvent){
        e.preventDefault();
        movePlanElement({ oldIdx: fromIdx, newIdx: pickerTargetIdx ?? -1 });
        closeModal();
    }

    return(
        <Modal 
            heading={"Upgrade Picker"}
            closeModal={closeModal}
            >
            <form className={"flex flex-col items-center h-auto"} onSubmit={handleClick}>
                <fieldset className={"flex flex-col w-full"}> 
                    <ModalFieldsWrapper>
                        <ModalLegend>
                            Pick an upgrade for Position { pickerTargetIdx + 1 }
                        </ModalLegend>
                        <div className={"flex flex-col px-2"}>
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
                        
                    </ModalFieldsWrapper>
                </fieldset>
                <div className={"flex w-full justify-between relative"}>
                    <ModalSubmitButton label={"pick"} disabled={false} extraCSS={''} />
                    <MoreInfo stockpiles={ calcStockpilesIncludingCurrentPurchase(purchaseData[pickerTargetIdx]) } />
                </div>
            </form>
        </Modal>

    )
}


function MoreInfo({stockpiles} 
    : { stockpiles : T_Stockpiles })
    : JSX.Element {

    const [showStockpiles, setShowStockpiles] = useState<boolean>(false);

    return  <div className={"flex justify-end"}>                             
                <InfoButton showMore={showStockpiles} setShowMore={setShowStockpiles} modeKey={'primary'} />
                { showStockpiles ?
                    <Tooltip 
                        posAndWidthCSS={"bottom-1 right-8 z-30 w-11/12"}
                        close={() => setShowStockpiles(false)} 
                        >
                        <StockpilesSection stockpiles={stockpiles} />
                    </Tooltip>
                    : null
                }
            </div>
}


function StockpilesSection({stockpiles} 
    : {stockpiles : T_Stockpiles})
    : JSX.Element {

    return (
        <section className={"text-left"}>
            <h4 className={"text-sm font-medium"}>Current stockpiles</h4>
            <div className={"my-1"}>
                <StockpilesDisplay 
                    stockpiles={stockpiles}
                    extraCSS={"overflow-hidden gap-1"}
                    />
            </div>
        </section>
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
        <Radio checked={checked} disabled={disabled} onChange={handleSelection} value={myKey} name={"upgradePicker"}>
            <UnitPickerCard checked={checked} disabled={disabled} data={data}/>
        </Radio>
    )
}

interface I_UnitPickerCard extends Pick<I_UpgradeRadio, "checked" | "disabled">{
    data : T_UnitPickerData
}
export type T_UnitPickerData = {
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
                                "bg-transparent border-neutral-100 text-neutral-200"
                                : "bg-neutral-200 border-neutral-300 hover:bg-violet-50 hover:border-violet-300";


    let fadeCostBadge = disabled ?
                            "opacity-10"
                            : "";

    let radioCircle = checked ?
                        "bg-violet-500 border-violet-500"
                        : isHover && !disabled ?
                            "bg-violet-300 border-violet-400"
                            : disabled ?
                            "bg-neutral-50 border-neutral-100"
                            : "bg-white border-neutral-400";

    return(
        <div className={"ease-linear duration-75 flex border m-1 items-center rounded" + " " + wrapperColours} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <div className={"ease-linear duration-75 w-3 h-3 ml-2 border rounded-full" + " " + radioCircle}>
            </div>
            <div className={"grid grid-cols-[4.25rem_1.75rem_1fr] mr-5"}>
                <span className={"block text-sm ml-2 px-1 flex items-center"}>{data.name}</span>
                <span className={"block text-sm p-1 font-bold flex items-center"}>{data.isMaxLevel ? " " : data.level}</span>
                <div className={"flex gap-1 py-1" + " " + fadeCostBadge}>
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


