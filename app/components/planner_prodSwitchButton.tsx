import { resourceCSS, capitalise } from '../utils/formatting';

import { IconPointingRight } from './icons';
import { Button } from './buttons';


interface I_ProductionSwitchButton {
    nameKey : string | null, 
    setTo : string | null, 
    handleClick : () => void, 
}

export default function ProductionSwitchButton({nameKey, setTo, handleClick} 
    : I_ProductionSwitchButton)
    : JSX.Element {

    return setTo === null || nameKey === null ?
            <Button 
                size={'planner'}
                colours={'secondary'}
                onClick={handleClick}
                extraCSS={"plnMd:self-end"}
            >
                switch
            </Button>
            : 
            <ResourceSwitchButton setTo={setTo} nameKey={nameKey} handleClick={handleClick} />
}


function ResourceSwitchButton({setTo, nameKey, handleClick} 
    : Pick<I_ProductionSwitchButton, "handleClick"> & { setTo : string, nameKey : string }) 
    : JSX.Element{

    let conditionalCSS = resourceCSS[setTo as keyof typeof resourceCSS].badge + " " + resourceCSS[setTo as keyof typeof resourceCSS].hover;

    let svgFill = setTo === 'dust' || setTo === 'yellow' ?
            "#000"
            : "#FFF";

    return  <button 
                className={"flex plnMd:justify-between text-sm items-center px-2 py-0.5 rounded border-2 mb-1 " + " " + conditionalCSS}
                onClick={handleClick}
                >
                <div className={"w-10 plnMd:w-16 plnMd:flex plnMd:justify-start"}>{nameKey !== null ? capitalise(nameKey) : "Worker"}</div>
                <div className={"px-4"}>{IconPointingRight(svgFill)} <span className={"sr-only"}>to </span></div>
                <div className={"plnMd:w-16 plnMd:flex plnMd:justify-end"}>{setTo}</div>
            </button>
}