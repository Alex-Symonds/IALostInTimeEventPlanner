import { useState } from "react";

import { deepCopy } from "../utils/consts";
import { moveIsValid } from '../utils/editPlan';
import { T_DATA_KEYS, getEntriesFromJSON, getProductionCostsFromJSON } from "../utils/getDataFromJSON";
import { T_GameState, T_PurchaseData, T_Stockpiles, T_CostData, } from "../utils/types";

import { BadgeCost, BadgeMaxed } from "./badges";
import Modal, { ModalHeading, ModalLegend, ModalSubmitButton, I_Modal, ModalFieldsWrapper } from './modal';
import Radio from './radio';
import { InfoButton } from "./buttons";
import StockpilesDisplay from "./stockpilesStrip";
import Tooltip from './tooltip';


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
        movePlanElement({ oldIdx: fromIdx, newIdx: pickerTargetIdx ?? -1 });
        closeModal();
    }

    return(
        <Modal closeModal={closeModal}>
            <ModalHeading>
                Upgrade Picker
            </ModalHeading>
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
            <h4 className={"text-sm"}>Current stockpiles</h4>
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
                                "bg-transparent border-gray-100 text-gray-200"
                                : "bg-gray-200 border-gray-300 hover:bg-violet-50 hover:border-violet-300";
    
    let fadeCostBadge = disabled ?
                            "opacity-10"
                            : "";

    let radioCircle = checked ?
                        "bg-violet-500 border-violet-500"
                        : isHover && !disabled ?
                            "bg-violet-300 border-violet-400"
                            : disabled ?
                            "bg-gray-50 border-gray-100"
                            : "bg-white border-neutral-400";

    return(
        <div className={"ease-linear duration-75 flex border m-1 items-center rounded" + " " + wrapperColours} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <div className={"ease-linear duration-75 w-3 h-3 ml-2 border rounded-full" + " " + radioCircle}>
            </div>
            <div className={"upgradePicker-card mr-5"}>
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
    let levelsAtStart = targetIdx === 0 ? 
                        gameState.levels
                        : purchaseData[targetIdx].levelsAbove;

    for(const [k, v] of getEntriesFromJSON()){
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

function calcStockpilesIncludingCurrentPurchase(purchaseData 
    : T_PurchaseData) 
    : T_Stockpiles {

    let stockpiles = deepCopy(purchaseData.stockpiles);
    const costs = getProductionCostsFromJSON(purchaseData.key as T_DATA_KEYS, purchaseData.level);

    for(let i = 0; i < costs.length; i++){
        let loopKey = costs[i].egg;
        stockpiles[loopKey as keyof typeof stockpiles] = stockpiles[loopKey as keyof typeof stockpiles] + parseInt(costs[i].quantity);
    }

    return stockpiles;
}