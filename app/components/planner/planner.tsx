import { MutableRefObject, useRef } from 'react';

import { MAX_TIME } from '../../utils/consts';
import { defaultProductionSettings } from '../../utils/defaults';
import { calcNewSwitchDisplay } from '../../utils/productionSettingsHelpers';
import { T_ProductionSettings, T_PurchaseData, T_TimeGroup, T_Action, T_GameState, T_ProductionSettingsNow } from '../../utils/types';

import ProductionSwitcher from '../forms/prodSettings';
import UpgradePicker from '../forms/upgradePicker';

import TimeGroup from '../timeGroup/timeGroup';

import ControlsRow from './subcomponents/controlsRow';
import PlannerFooter from './subcomponents/footer';
import ResultAtTop from './subcomponents/resultAtTop';
import AllUpgradesPurchased from './subcomponents/allUpgradesPurchased';

import { useSwitchProductionNow, T_PropsSwitchProdNowModal } from './utils/useSwitchProductionNow';
import { useSwitchProductionFuture, T_PropsSwitchProdFutureModal } from './utils/useSwitchProductionFuture';
import { useUpgradePicker, T_PropsUpgradePickerModal } from './utils/useUpgradePicker';

interface I_Planner {
    actions : T_Action[], 
    setActions : React.Dispatch<React.SetStateAction<T_Action[]>>, 
    gameState : T_GameState, 
    purchaseData : T_PurchaseData[],
    timeIDGroups : T_TimeGroup[],
    prodSettingsNow : T_ProductionSettingsNow | null,
    setProdSettingsNow : React.Dispatch<React.SetStateAction<T_ProductionSettingsNow | null>>,
    prodSettingsBeforeNow : T_ProductionSettings,
}

export default function Planner({timeIDGroups, gameState, actions, setActions, purchaseData, prodSettingsNow, setProdSettingsNow, prodSettingsBeforeNow} 
    : I_Planner)
    : JSX.Element {

    const numValid : number = purchaseData.filter(ele => ele.readyTimeID < MAX_TIME).length;

    let initialProdSettingsForNowModal : T_ProductionSettings = 
                            prodSettingsNow !== null ?
                            prodSettingsNow.productionSettings
                                : timeIDGroups.length === 0 ?
                                    defaultProductionSettings
                                    : timeIDGroups[0].productionSettingsDuring;

    const prodSettingsBeforeNowRef : MutableRefObject<T_ProductionSettings | undefined>  = useRef();
    prodSettingsBeforeNowRef.current = prodSettingsBeforeNow;

    const { openModal: openUpgradePicker, props: upgradePickerProps } = useUpgradePicker({purchaseData, actions, setActions});
    const { openModal: openSwitchFutureModal, props: switchProdFutureProps } = useSwitchProductionFuture({ actions, setActions });
    const { openModal: openSwitchNowModal, props: switchProdNowProps } = useSwitchProductionNow({ initialProdSettings: initialProdSettingsForNowModal, setProdSettingsNow, gameState, timeIDGroups, prodSettingsBeforeNowRef });

    function calcDisplaySwitchesForProdSettingsNow(){
        if(prodSettingsNow === null){
            return [];
        }
        return calcNewSwitchDisplay({ 
                startSettings: prodSettingsBeforeNow, 
                newSettings: prodSettingsNow.productionSettings
            });
    }

    return(
        <div className={"flex flex-col items-center"}>
            <ResultAtTop 
                planData={purchaseData} 
                gameState={gameState} 
                actions={actions} 
                timeIDGroups={timeIDGroups} 
            />
            { timeIDGroups.length === 0 ?
                <AllUpgradesPurchased />
            : <>
                <Modals 
                    purchaseData={purchaseData} 
                    gameState={gameState} 
                    upgradePickerProps={upgradePickerProps}
                    switchProdFutureProps={switchProdFutureProps}
                    switchProdNowProps={switchProdNowProps}
                />
                <div className={"flex flex-col gap-1 w-min"}>
                        { gameState.levels.trinity > 0 ?
                            <ControlsRow 
                                displaySwitches={ calcDisplaySwitchesForProdSettingsNow() }
                                handleProductionClick={ openSwitchNowModal } 
                                handleUpgradeClick={() => openUpgradePicker(0)}
                                showUpgradeButton={true}
                            />
                            : null
                        }
                    <TimeGroupsList
                        gameState={gameState}
                        timeIDGroups={timeIDGroups}
                        openUpgradePicker={openUpgradePicker}
                        openProdSwitcherModal={openSwitchFutureModal}
                        purchasesPassTimeLimit={numValid < purchaseData.length}
                    />
                </div>
            </>
            }

            { purchaseData !== null && purchaseData.length > 0 ?
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
                    initialProdSettings={ switchFuture.data.productionSettingsDuring } 
                    currentSwitches={ switchFuture.data.switches } 
                    updateProdSettings={ switchFuture.updateProdSettings }
                    levels={ switchFuture.data.levelsAtEnd }
                />
                : switchNow.isVisible ?
                    <ProductionSwitcher 
                        closeModal={ switchNow.closeModal } 
                        initialProdSettings={ switchNow.initialProdSettings } 
                        currentSwitches={ [] } 
                        updateProdSettings={ switchNow.updateProdSettings }
                        levels={ switchNow.levelsAtStart }
                    />
                    : null;
}


interface I_TimeGroupList extends 
    Pick<I_Planner, "gameState" | "timeIDGroups">{
    openUpgradePicker : (index : number) => void,
    openProdSwitcherModal: (data : T_TimeGroup) => void,
    purchasesPassTimeLimit : boolean
}
function TimeGroupsList({timeIDGroups, gameState, openUpgradePicker, openProdSwitcherModal, purchasesPassTimeLimit} 
    : I_TimeGroupList)
    : JSX.Element {

    return <>
            { timeIDGroups.map((data, idx) => {
                if(data.timeID > MAX_TIME){
                    return null;
                }

                const displaySwitches = data.switches.filter(ele => {
                    return data.productionSettingsDuring[ele.key as keyof typeof data.productionSettingsDuring] !== ele.to;
                });

                let nextPos = data.startPos + data.upgrades.length;
                return <div key={'tgcr' + idx} className={"w-min"}>
                            <TimeGroup 
                                groupData={data} 
                                startPos={data.startPos} 
                                openUpgradePicker={ openUpgradePicker } 
                                gameState={gameState} 
                                remainingGroups={timeIDGroups.slice(idx + 1)}
                            />
                            <ControlsRow
                                displaySwitches={displaySwitches}
                                handleProductionClick={() => openProdSwitcherModal(data)} 
                                handleUpgradeClick={() => openUpgradePicker(nextPos - 1)}
                                showUpgradeButton={ idx < timeIDGroups.length - 1 || purchasesPassTimeLimit }
                            />
                        </div>
            })}
        </>
}


