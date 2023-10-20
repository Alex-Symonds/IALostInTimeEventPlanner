import { MutableRefObject, useRef } from 'react';

import { T_DATA_COSTS, T_DATA_KEYS, getProductionCostsFromJSON } from '@/app/utils/getDataFromJSON';
import { MAX_TIME } from '@/app/utils/consts';
import { startingProductionSettings } from '@/app/utils/defaults';
import { capitalise, theme } from '@/app/utils/formatting';
import { calcNewSwitchDisplay } from '@/app/utils/productionSettingsHelpers';
import { T_ProductionSettings, T_PurchaseData, T_TimeGroup, T_Action, T_GameState, T_ProductionSettingsNow, T_ProductionRates } from '@/app/utils/types';

import ProductionSwitcher from '../forms/prodSettings';
import UpgradePicker from '../forms/upgradePicker';

import { BadgeCost } from '../subcomponents/badges';

import TimeGroup from '../timeGroup/timeGroup';

import ControlsRow from './subcomponents/controlsRow';
import PlannerFooter from './subcomponents/footer';
import ResultAtTop from './subcomponents/resultAtTop';
import AllUpgradesPurchased from './subcomponents/allUpgradesPurchased';

import { useSwitchProductionNow, T_PropsSwitchProdNowModal } from './utils/useSwitchProductionNow';
import { useSwitchProductionFuture, T_PropsSwitchProdFutureModal } from './utils/useSwitchProductionFuture';
import { useUpgradePicker, T_PropsUpgradePickerModal } from './utils/useUpgradePicker';
import TimeGroupHeading from './subcomponents/timeHeading';



interface I_Planner {
    actions : T_Action[], 
    setActions : (data : T_Action[]) => void, 
    gameState : T_GameState, 
    purchaseData : T_PurchaseData[],
    timeIDGroups : T_TimeGroup[],
    prodSettingsNow : T_ProductionSettingsNow | null,
    setProdSettingsNow : (data : T_ProductionSettingsNow | null) => void,
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
                                    startingProductionSettings
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
        <div className={`flex flex-col items-center ${theme.panelBg}`}>
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

                    <div className={"flex flex-col gap-4 w-full px-1 sm:px-4 items-center"}>
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
                { purchaseData !== null && purchaseData.length > 0 ?
                    <PlannerFooter unboughtUpgrades={purchaseData.length - numValid} />
                    : null
                }
                </>
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
                        nowModalProps={ switchNow.modalProps }
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
                    const targetUpgrade = data.upgrades[0];
                    const {costs, costsWithZeroRate} = insufficientProductionData({ rates: data.ratesDuring, targetUpgrade});
                    if(costsWithZeroRate.length > 0){
                        return  <div key={"nextUpgradeIsImpossibleWarningThingKey"}
                                    className={"w-full border-l-[4px] border-amber-400 bg-amber-50 text-black my-3 px-4 py-5 text-sm"}
                                    >
                                    <InsufficientProductionMessage
                                        targetUpgrade={targetUpgrade}
                                        costs={costs}
                                        costsWithZeroRate={costsWithZeroRate}
                                    />
                                </div>
                    }
                    return null;
                }

                const displaySwitches = data.switches.filter(ele => {
                    return data.productionSettingsDuring[ele.key as keyof typeof data.productionSettingsDuring] !== ele.to;
                });

                const bgConditionalOnOffline = data.startOfflinePeriodTimeID !== null ?
                    "bg-black bg-opacity-5 rounded-b"
                    : "";
                let nextPos = data.startPos + data.upgrades.length;
                return  <div key={'tgcr' + idx} className={"w-full flex flex-col items-center" + " " + bgConditionalOnOffline}>
                            <TimeGroupHeading 
                                data={data} 
                                gameState={gameState}
                            />
                            <div className={"w-min"}>
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
                        </div>
            })}
        </>
}


function InsufficientProductionMessage({targetUpgrade, costs, costsWithZeroRate}
    : { costs : T_DATA_COSTS, costsWithZeroRate : T_DATA_COSTS, targetUpgrade : T_PurchaseData })
    : JSX.Element {

    return  <>
            <p>
                {`Your next upgrade, `}
                <span className={"font-semibold"}>
                    { capitalise(targetUpgrade.key) }&nbsp;{ targetUpgrade.level }
                </span>
                {`, costs `}
                <span className={"inline-block"}>
                    <span className={"flex gap-1"}>
                    { costs.map(cost =>
                        <BadgeCost key={`failedPurchaseCost${cost.egg}`} 
                            data={cost} 
                            extraCSS={"justify-between max-w-max px-2 py-0.5 rounded text-xs"}
                        />
                    )}
                    </span>
                </span>
                {` but your production of ${ 
                    costsWithZeroRate.length === 1 ?
                        `${costsWithZeroRate[0].egg}`
                        : `both ${costsWithZeroRate[0].egg} and ${costsWithZeroRate[1].egg}`
                    } 
                    eggs is zero.`}
            </p>

            <p className={"mt-4"}>
                {`Try switching your workers to producing ${costsWithZeroRate[0].egg}${
                    costsWithZeroRate.length === 1 ?
                        ""
                        : ` and ${costsWithZeroRate[1].egg}`
                    } eggs or select a different upgrade.`
                }
            </p>
        </>
}


function insufficientProductionData({rates, targetUpgrade}
    : { rates : T_ProductionRates, targetUpgrade : T_PurchaseData }
    ){

    const costs = getProductionCostsFromJSON(targetUpgrade.key as T_DATA_KEYS, targetUpgrade.level);
    const costsWithZeroRate = costs.filter((cost) => rates[cost.egg as keyof typeof rates] === 0);
    
    return {
        costs,
        costsWithZeroRate
    }
}