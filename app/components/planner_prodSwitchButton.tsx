import { resourceCSS, capitalise, buttonSecondaryCSSColours_onDark, buttonSecondaryCSSColours } from '../utils/formatting';

import { IconPointingRight } from './icons';


interface I_ProductionSwitchButton {
    nameKey : string | null, 
    setTo : string | null, 
    isDuringOfflinePeriod : boolean
    handleClick : () => void, 
}

export default function ProductionSwitchButton({nameKey, setTo, isDuringOfflinePeriod, handleClick} 
    : I_ProductionSwitchButton)
    : JSX.Element {

    let conditionalCSS = setTo !== null && nameKey !== null ?
                            resourceCSS[setTo as keyof typeof resourceCSS].badge + " " + resourceCSS[setTo as keyof typeof resourceCSS].hover
                            : isDuringOfflinePeriod ?
                                buttonSecondaryCSSColours_onDark + " " + "justify-center"
                                : buttonSecondaryCSSColours + " " + "justify-center";


    let svgFill = setTo === null ?
                    ""
                    : setTo === 'dust' || setTo === 'yellow' ?
                        "#000"
                        : "#FFF";

    return(
        <button className={"flex text-sm items-center px-2 py-0.5 rounded border-2 my-0.5 " + " " + conditionalCSS} onClick={handleClick}>
            {
                setTo !== null && nameKey !== null ?
                    <>
                        <div className={"w-10"}>{capitalise(nameKey)}</div>
                        <div className={"px-4"}>{IconPointingRight(svgFill)} <span className={"sr-only"}>to </span></div>
                        <div>{setTo}</div>
                    </>
                    :
                    <div>switch</div>
            }
        </button>
    )
}



