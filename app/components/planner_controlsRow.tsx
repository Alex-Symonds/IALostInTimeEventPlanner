import { T_SwitchAction } from '../utils/types';

import ProductionSwitchButton from './planner_prodSwitchButton';
import { Button } from './buttons';

interface I_PropsControlsRow {
    displaySwitches : T_SwitchAction[],
    showUpgradeButton : boolean,
    handleProductionClick: () => void,
    handleUpgradeClick : () => void,
}
export default function ControlsRow({displaySwitches, showUpgradeButton, handleProductionClick, handleUpgradeClick} 
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
                    />
                : displaySwitches.map((ele, idx) => {
                    return <ProductionSwitchButton key={'prodToggle_' + ele.key + '_' + idx } 
                                nameKey={ele.key} 
                                setTo={ele.to} 
                                handleClick={handleProductionClick}
                            />
                })
            }
            </div>
        {showUpgradeButton ?
            <div>
                <Button
                    size={'planner'}
                    colours={'primary'}
                    onClick={handleUpgradeClick}
                    extraCSS={"flex items-center justify-center my-0.5"}
                    >
                    &laquo;&nbsp;insert
                </Button>
            </div>
            : null
        }
        </div>
    )
}

