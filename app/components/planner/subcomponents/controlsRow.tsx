import { T_DisplaySwitch } from '../../../utils/types';

import ProductionSwitchButton from './prodSwitchButton';
import { Button } from '../../forms/subcomponents/buttons';

interface I_PropsControlsRow {
    displaySwitches : T_DisplaySwitch[],
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
        <div className={"w-full plnMd:w-min flex justify-between px-1 py-1 plnMd:justify-start plnMd:grid plnMd:gap-4 plnMd:grid-rows-1 plnMd:[grid-template-columns:18rem_auto]"}>
            
            {showUpgradeButton ?
            <div className={'flex flex-col justify-start plnMd:[grid-column-start:1] plnMd:justify-self-start plnMd:self-start'}>
                <Button
                    size={'planner'}
                    colours={'primary'}
                    onClick={handleUpgradeClick}
                    extraCSS={"flex items-center justify-center my-0.5"}
                    >
                    insert&nbsp;&raquo;
                </Button>
            </div>
            : null
        }
            <div className={"flex flex-col [padding-top:2px] plnMd:[grid-column-start:2] plnMd:w-52" + " " + productionSwitchButtonWidth}>
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

        </div>
    )
}