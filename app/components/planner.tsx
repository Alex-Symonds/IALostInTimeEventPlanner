import {useState, Fragment} from 'react';

import { MAX_TIME, deepCopy } from '../utils/consts';
import { convertDateToTimeId, convertOfflineTimeToTimeId, getStartTime } from '../utils/dateAndTimeHelpers';
import { moveIsValid, T_ValidMoveOutput } from '../utils/editPlan';
import { removeAllSwitchActionsInTimeGroup, countInternalProductionSwitches, getNewSwitchActions } from '../utils/productionSettings';
import { T_OfflinePeriod, T_ProductionSettings, T_PurchaseData, T_TimeGroup, T_Action, T_GameState, T_Levels, T_InterruptProductionSettings } from '../utils/types';

import ProductionSwitcher from './inputProdSettings';
import UpgradePicker from './inputUpgradePicker';
import ControlsRow from './planner_controlsRow';
import TimeGroup from './planner_timeGroup';
import ProductionSummary from './productionSummary';
import PlannerFooter from './planner_footer';
import ResultAtTop from './resultAtTop';


interface I_Planner {
    actions : T_Action[], 
    setActions : React.Dispatch<React.SetStateAction<T_Action[]>>, 
    gameState : T_GameState, 
    offlinePeriods : T_OfflinePeriod[],
    purchaseData : T_PurchaseData[],
    timeIdGroups : T_TimeGroup[],
    prodSettingsAtTop : T_InterruptProductionSettings | null,
    setProdSettingsAtTop : React.Dispatch<React.SetStateAction<T_InterruptProductionSettings | null>>
}

export default function Planner({timeIdGroups, gameState, actions, setActions, offlinePeriods, purchaseData, prodSettingsAtTop, setProdSettingsAtTop} 
    : I_Planner)
    : JSX.Element {

    const [showUpgradePicker, setShowUpgradePicker] = useState(false);
    const [pickerTargetIdx, setPickerTargetIdx] = useState<number | null>(null);
    const [showProdSetter, setShowProdSetter] = useState(false);
    const [modalProdSwitchData, setModalProdSwitchData] = useState<T_TimeGroup | null>(null);
    const [showProdSetterTop, setShowProdSetterTop] = useState(false);
    
    const numValid : number = purchaseData.filter(ele => ele.timeId < MAX_TIME).length;

    function movePlanElement({oldIdx, newIdx} 
        : { oldIdx : number, newIdx : number }) 
        : void {
       
        let validMoveCheck : T_ValidMoveOutput = moveIsValid({srcIdx: oldIdx, dstIdx: newIdx, purchaseData});

        let actionsOldIdx = purchaseData[oldIdx].actionsIdx;
        let actionsNewIdx = purchaseData[newIdx].actionsIdx;

        if(validMoveCheck.isValid){
            let upgradeOrderDeepCopy = deepCopy(actions);
            let targetElement = upgradeOrderDeepCopy[actionsOldIdx];

            upgradeOrderDeepCopy.splice(actionsOldIdx, 1);
            upgradeOrderDeepCopy.splice(actionsNewIdx, 0, targetElement);

            setActions(upgradeOrderDeepCopy);
        }
        else {
            console.log(`TODO: response to invalid move (${validMoveCheck.reason})`);
        }
    }

    function updateProductionSettings(newSettings : T_ProductionSettings)
        : void {

        if(modalProdSwitchData === null){
            return;
        }

        let workingActions : T_Action[] = deepCopy(actions);
        let numInternalSwitches = 0;

        if(modalProdSwitchData.switches.length > 0){
            workingActions = removeAllSwitchActionsInTimeGroup({ timeGroupData: modalProdSwitchData, workingActions });
            numInternalSwitches = countInternalProductionSwitches({ timeGroupData: modalProdSwitchData });
        }

        let lastUpgrade = modalProdSwitchData.upgrades[modalProdSwitchData.upgrades.length - 1];
        let insertIdx = lastUpgrade.actionsIdx + 1 - numInternalSwitches;

        let newSwitchActions = getNewSwitchActions({
            startSettings: modalProdSwitchData.productionSettings,
            newSettings,
            insertIdx
        });

        workingActions = workingActions.slice(0, insertIdx).concat(newSwitchActions).concat(workingActions.slice(insertIdx));  
        setActions(workingActions);
    }


    function openUpgradePicker(idx : number)
        : void {

        setPickerTargetIdx(idx);
        setShowUpgradePicker(true);
    }

    function openProdSettingsModal(data : T_TimeGroup)
        : void {

        setModalProdSwitchData(data);
        setShowProdSetter(true);
    }

    function updateInterrupt(newSettings : T_ProductionSettings) 
        : void {

        setProdSettingsAtTop({
            productionSettings: newSettings,
            timeId: convertDateToTimeId(new Date(), gameState)
        })
    }

    let initialProdSettings : T_ProductionSettings = prodSettingsAtTop === null ?
                                timeIdGroups[0].productionSettings
                                : prodSettingsAtTop.productionSettings;


    let upgradePickerProps : T_PropsUpgradePickerModal = {
        showModal: showUpgradePicker,
        closeModal: () => setShowUpgradePicker(false),
        movePlanElement: movePlanElement,
        pickerTargetIdx: pickerTargetIdx
    }

    let middleProdSwitcherProps : T_PropsMiddleProdSwitcherModal = {
        showModal: showProdSetter,
        closeModal: () => setShowProdSetter(false),
        data: modalProdSwitchData,
        updateProdSettings: updateProductionSettings
    }

    let topProdSwitcherProps : T_PropsTopProdSwitcherModal = {
        showModal: showProdSetterTop,
        closeModal: () => setShowProdSetterTop(false),
        initialProdSettings,
        updateProdSettings: updateInterrupt,
        levelsAtStart: timeIdGroups[0].levels
    }

    return(
        <div className={"flex flex-col items-center bg-white"}>
            
            <ResultAtTop planData={purchaseData} gameState={gameState} actions={actions} timeIdGroups={timeIdGroups} />
            {
                <Modal 
                    purchaseData={purchaseData} 
                    gameState={gameState} 
                    upgradePickerProps={upgradePickerProps}
                    middleProdSwitcherProps={middleProdSwitcherProps}
                    topProdSwitcherProps={topProdSwitcherProps}
                />
            }

            { timeIdGroups.length > 0 && gameState.levels.trinity > 0 ?
                <ProductionStrip
                    currentProdSettings={initialProdSettings} 
                    gameState={gameState} 
                />
                : null
            }
            
            <div className={"flex flex-col gap-1 w-min"}>
            {
                timeIdGroups.length === 0 ?
                    null
                    : 
                    <>
                        <ControlsRow 
                            displaySwitches={timeIdGroups[0].switches.filter(ele => {
                                let data = timeIdGroups[0];
                                return data.productionSettings[ele.key as keyof typeof data.productionSettings] !== ele.to;
                            })}
                            handleProductionClick={() => setShowProdSetterTop(true)} 
                            handleUpgradeClick={() => openUpgradePicker(0)}
                            showUpgradeButton={true}
                        />
                        <TimeGroupsList
                            gameState={gameState}
                            offlinePeriods={offlinePeriods}
                            timeIdGroups={timeIdGroups}
                            openUpgradePicker={openUpgradePicker}
                            openProdSwitcherModal={openProdSettingsModal}
                            purchasesPassTimeLimit={numValid < purchaseData.length}
                        />
                    </>
            }
            </div>

            {
                purchaseData !== null && purchaseData.length > 0 ?
                <PlannerFooter unboughtUpgrades={purchaseData.length - numValid} />
                : null
            }
        </div>
    )
}

type T_PropsUpgradePickerModal = {
    showModal : boolean,
    closeModal : () => void,
    movePlanElement : (data : { oldIdx : number, newIdx : number }) => void,
    pickerTargetIdx : number | null,
}

type T_PropsMiddleProdSwitcherModal = {
    showModal : boolean,
    closeModal : () => void,
    data : T_TimeGroup | null,
    updateProdSettings : (newSettings : T_ProductionSettings) => void,
}

type T_PropsTopProdSwitcherModal = {
    showModal : boolean,
    closeModal : () => void,
    initialProdSettings : T_ProductionSettings,
    updateProdSettings : (newSettings : T_ProductionSettings) => void,
    levelsAtStart : T_Levels
}

interface I_PlannerModals extends 
    Pick<I_Planner, "gameState" | "purchaseData">{
    upgradePickerProps : T_PropsUpgradePickerModal,
    middleProdSwitcherProps : T_PropsMiddleProdSwitcherModal,
    topProdSwitcherProps : T_PropsTopProdSwitcherModal,
}

function Modal({ purchaseData, gameState, upgradePickerProps, middleProdSwitcherProps: middleSwitcher, topProdSwitcherProps: topSwitcher } 
    : I_PlannerModals) 
    : JSX.Element | null{


    return upgradePickerProps.showModal ?
            <UpgradePicker 
                closeModal={ upgradePickerProps.closeModal } 
                movePlanElement={ upgradePickerProps.movePlanElement } 
                pickerTargetIdx={ upgradePickerProps.pickerTargetIdx } 
                purchaseData={ purchaseData } 
                gameState={ gameState } 
             />
            : middleSwitcher.showModal && middleSwitcher.data !== null ?
                <ProductionSwitcher 
                    closeModal={ middleSwitcher.closeModal } 
                    currentProdSettings={ middleSwitcher.data.productionSettings } 
                    currentSwitches={ middleSwitcher.data.switches } 
                    updateProdSettings={ middleSwitcher.updateProdSettings }
                    levels={ middleSwitcher.data.levels }
                />
                : topSwitcher.showModal ?
                    <ProductionSwitcher 
                        closeModal={ topSwitcher.closeModal } 
                        currentProdSettings={ topSwitcher.initialProdSettings } 
                        currentSwitches={ [] } 
                        updateProdSettings={ topSwitcher.updateProdSettings }
                        levels={ topSwitcher.levelsAtStart }
                    />
                    : null;
}


function ProductionStrip({currentProdSettings, gameState} 
    : Pick<I_Planner, "gameState"> & {currentProdSettings : T_ProductionSettings})
    : JSX.Element {

    return(
        <div className={"flex px-2 py-2 justify-center items-center"}>
            <div className={"flex gap-2 relative"}>
            <h4 className={"text-xs absolute -left-9 top-0.5"}>Prod.</h4>
            { currentProdSettings !== null ?
                <ProductionSummary 
                    productionSettings={currentProdSettings} 
                    levels={gameState.levels} 
                    extraCSS={undefined}
                    wantHeadings={false}
                    isDuringOfflinePeriod={false}
                />
                : null
            }
            </div>
        </div>
    )
}


interface I_TimeGroupList extends 
    Pick<I_Planner, "offlinePeriods" | "gameState" | "timeIdGroups">{
    openUpgradePicker : (index : number) => void,
    openProdSwitcherModal: (data : T_TimeGroup) => void,
    purchasesPassTimeLimit : boolean
}
function TimeGroupsList({timeIdGroups, offlinePeriods, gameState, openUpgradePicker, openProdSwitcherModal, purchasesPassTimeLimit} : I_TimeGroupList)
    : JSX.Element {

    let groupStartPos = 1;

    return <>
        { timeIdGroups.map((data, idx) => {
            if(data.timeId > MAX_TIME){
                return null;
            }

            const displaySwitches = data.switches.filter(ele => {
                return data.productionSettings[ele.key as keyof typeof data.productionSettings] !== ele.to;
            });

            let startPos = groupStartPos;
            groupStartPos += data.upgrades.length;
            let nextPos = groupStartPos;

            return <div key={'tgcr' + idx} className={"w-min"}>
                        <TimeGroup 
                            groupData={data} 
                            startPos={startPos} 
                            openUpgradePicker={ openUpgradePicker } 
                            offlinePeriods={offlinePeriods} 
                            gameState={gameState} 
                            remainingGroups={timeIdGroups.slice(idx + 1)}
                        />
                        <ControlsRow
                            displaySwitches={displaySwitches}
                            handleProductionClick={() => openProdSwitcherModal(data)} 
                            handleUpgradeClick={() => openUpgradePicker(nextPos - 1)}
                            showUpgradeButton={ idx < timeIdGroups.length - 1 || purchasesPassTimeLimit }
                        />
                    </div>
            // return <Fragment key={'tgcr' + idx}>
            //             <TimeGroup 
            //                 groupData={data} 
            //                 startPos={startPos} 
            //                 openUpgradePicker={ openUpgradePicker } 
            //                 offlinePeriods={offlinePeriods} 
            //                 gameState={gameState} 
            //                 remainingGroups={timeIdGroups.slice(idx + 1)}
            //             />
            //             <ControlsRow
            //                 displaySwitches={displaySwitches}
            //                 handleProductionClick={() => openProdSwitcherModal(data)} 
            //                 handleUpgradeClick={() => openUpgradePicker(nextPos - 1)}
            //                 showUpgradeButton={ idx < timeIdGroups.length - 1 || purchasesPassTimeLimit }
            //             />
            //         </Fragment>
        })}
        </>
}