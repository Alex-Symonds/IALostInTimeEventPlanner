import Checkbox from "../../subcomponents/checkbox"

export interface I_AdBoostInputEle {
    hasAdBoost : boolean, 
    toggleAdBoost : () => void,
}
export default function AdBoost({hasAdBoost, toggleAdBoost}
    : I_AdBoostInputEle)
    : JSX.Element {

    return  <div className={"flex gap-2"}>
                <Checkbox 
                    checked={hasAdBoost} 
                    onChange={ toggleAdBoost } 
                    disabled={false}
                    idStr={"id_adBoost"}
                    name={"adBoost"}
                    displayText={"Ad Boost"}
                    value={"adBoost"}
                />
            </div>
}
