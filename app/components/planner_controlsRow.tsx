import { buttonPrimaryCSSColours } from '../utils/formatting';
import { T_SwitchAction } from '../utils/types';

import ProductionSwitchButton from './planner_prodSwitchButton';

interface I_PropsControlsRow {
    displaySwitches : T_SwitchAction[],
    isDuringOfflinePeriod : boolean,
    showUpgradeButton : boolean,
    handleProductionClick: () => void,
    handleUpgradeClick : () => void,
}
export default function ControlsRow({displaySwitches, isDuringOfflinePeriod, showUpgradeButton, handleProductionClick, handleUpgradeClick} 
    : I_PropsControlsRow)
    : JSX.Element {

    const productionSwitchButtonWidth = displaySwitches.length === 0 ?
                                            "w-20"
                                            : "w-40" ;
    return(
        <div className={"flex justify-between px-1 py-1 w-full"}>
            <div className={"flex flex-col" + " " + productionSwitchButtonWidth}>
            {
                displaySwitches.length === 0 ?
                    <ProductionSwitchButton 
                        nameKey={null} 
                        setTo={null} 
                        handleClick={handleProductionClick} 
                        isDuringOfflinePeriod={isDuringOfflinePeriod}
                    />
                : displaySwitches.map((ele, idx) => {
                    return <ProductionSwitchButton key={'prodToggle_' + ele.key + '_' + idx } 
                                nameKey={ele.key} 
                                setTo={ele.to} 
                                handleClick={handleProductionClick}
                                isDuringOfflinePeriod={isDuringOfflinePeriod}
                            />
                })
            }
            </div>
            {showUpgradeButton ?
                <div>
                    <button 
                        className={"flex text-sm items-center px-2 py-0.5 rounded my-0.5 h-7" + " " + buttonPrimaryCSSColours}
                        onClick={handleUpgradeClick}
                        >
                        &laquo;&nbsp;insert
                    </button>
                </div>
                : null
            }
        </div>
    )
}

