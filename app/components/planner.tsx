import { MAX_TIME } from '../utils/consts';
import { T_OfflinePeriod, T_ProductionSettings, T_PurchaseData, T_TimeGroup, T_Action, T_GameState, T_ProductionSettingsNow } from '../utils/types';

import { useSwitchProductionNow, T_PropsSwitchProdNowModal } from '../utils/useSwitchProductionNow';
import { useSwitchProductionFuture, T_PropsSwitchProdFutureModal } from '../utils/useSwitchProductionFuture';
import { useUpgradePicker, T_PropsUpgradePickerModal } from '../utils/useUpgradePicker';

import ProductionSwitcher from './inputProdSettings';
import UpgradePicker from './inputUpgradePicker';
import ControlsRow from './planner_controlsRow';
import TimeGroup from './planner_timeGroup';
import PlannerFooter from './planner_footer';
import ResultAtTop from './resultAtTop';



interface I_Planner {
    actions : T_Action[], 
    setActions : React.Dispatch<React.SetStateAction<T_Action[]>>, 
    gameState : T_GameState, 
    offlinePeriods : T_OfflinePeriod[],
    purchaseData : T_PurchaseData[],
    timeIdGroups : T_TimeGroup[],
    prodSettingsNow : T_ProductionSettingsNow | null,
    setProdSettingsNow : React.Dispatch<React.SetStateAction<T_ProductionSettingsNow | null>>
}

export default function Planner({timeIdGroups, gameState, actions, setActions, offlinePeriods, purchaseData, prodSettingsNow: prodSettingsNow, setProdSettingsNow: setProdSettingsNow} 
    : I_Planner)
    : JSX.Element {

    const numValid : number = purchaseData.filter(ele => ele.timeId < MAX_TIME).length;

    let initialProdSettings : T_ProductionSettings = prodSettingsNow === null ?
                                timeIdGroups[0].productionSettings
                                : prodSettingsNow.productionSettings;

    const { openModal: openUpgradePicker, props: upgradePickerProps } = useUpgradePicker({purchaseData, actions, setActions});
    const { openModal: openSwitchFutureModal, props: switchProdFutureProps } = useSwitchProductionFuture({ actions, setActions });
    const { openModal: openSwitchNowModal, props: switchProdNowProps } = useSwitchProductionNow({ initialProdSettings, setProdSettingsNow, gameState, timeIdGroups });
    
    return(
        <div className={"flex flex-col items-center bg-white"}>
            <ResultAtTop 
                planData={purchaseData} 
                gameState={gameState} 
                actions={actions} 
                timeIdGroups={timeIdGroups} 
            />
            <Modals 
                purchaseData={purchaseData} 
                gameState={gameState} 
                upgradePickerProps={upgradePickerProps}
                switchProdFutureProps={switchProdFutureProps}
                switchProdNowProps={switchProdNowProps}
            />

            <div className={"flex flex-col gap-1 w-min"}>
            {
                timeIdGroups.length === 0 ?
                    null
                    : 
                    <>
                        { gameState.levels.trinity > 0 ?
                            <ControlsRow 
                                displaySwitches={timeIdGroups[0].switches.filter(ele => {
                                    let data = timeIdGroups[0];
                                    return data.productionSettings[ele.key as keyof typeof data.productionSettings] !== ele.to;
                                })}
                                handleProductionClick={openSwitchNowModal} 
                                handleUpgradeClick={() => openUpgradePicker(0)}
                                showUpgradeButton={true}
                            />
                            : null
                        }

                        <TimeGroupsList
                            gameState={gameState}
                            offlinePeriods={offlinePeriods}
                            timeIdGroups={timeIdGroups}
                            openUpgradePicker={openUpgradePicker}
                            openProdSwitcherModal={openSwitchFutureModal}
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


interface I_PlannerModals extends Pick<I_Planner, "gameState" | "purchaseData"> {
    upgradePickerProps : T_PropsUpgradePickerModal,
    switchProdFutureProps : T_PropsSwitchProdFutureModal,
    switchProdNowProps : T_PropsSwitchProdNowModal,
}
function Modals({ purchaseData, gameState, upgradePickerProps, switchProdFutureProps: switchFuture, switchProdNowProps: switchNow } 
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
            : switchFuture.isVisible && switchFuture.data !== null ?
                <ProductionSwitcher 
                    closeModal={ switchFuture.closeModal } 
                    currentProdSettings={ switchFuture.data.productionSettings } 
                    currentSwitches={ switchFuture.data.switches } 
                    updateProdSettings={ switchFuture.updateProdSettings }
                    levels={ switchFuture.data.levels }
                />
                : switchNow.isVisible ?
                    <ProductionSwitcher 
                        closeModal={ switchNow.closeModal } 
                        currentProdSettings={ switchNow.initialProdSettings } 
                        currentSwitches={ [] } 
                        updateProdSettings={ switchNow.updateProdSettings }
                        levels={ switchNow.levelsAtStart }
                    />
                    : null;
}


interface I_TimeGroupList extends 
    Pick<I_Planner, "offlinePeriods" | "gameState" | "timeIdGroups">{
    openUpgradePicker : (index : number) => void,
    openProdSwitcherModal: (data : T_TimeGroup) => void,
    purchasesPassTimeLimit : boolean
}
function TimeGroupsList({timeIdGroups, offlinePeriods, gameState, openUpgradePicker, openProdSwitcherModal, purchasesPassTimeLimit} 
    : I_TimeGroupList)
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
            })}
        </>
}