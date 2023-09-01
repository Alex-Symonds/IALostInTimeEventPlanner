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
                                            : "w-40";
    return(
        <div className={"flex justify-between px-1 py-1 plnMd:justify-start plnMd:grid plnMd:gap-4 plnMd:grid-rows-1 plnMd:[grid-template-columns:18rem_auto]"}>
            <div className={"flex flex-col plnMd:[grid-column-start:2] plnMd:w-52 plnMd:[margin-top:2px]" + " " + productionSwitchButtonWidth}>
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
            <div className={'plnMd:[grid-column-start:1] plnMd:[grid-row-start:1] plnMd:justify-self-end plnMd:self-start plnMd:mr-2 '}>
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

