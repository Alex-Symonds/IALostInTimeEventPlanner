import { useState, Dispatch, SetStateAction } from 'react';

import { toBillions } from '../../../utils/formatting';
import { T_SuggestionData, T_PurchaseData, T_GameState, T_Action, T_TimeGroup } from "../../../utils/types";
import { calcResultOfPlan } from '../../../utils/calcResults';


import Tooltip from '../../subcomponents/tooltip';


interface I_ResultAtTop { 
    planData : T_PurchaseData[], 
    gameState : T_GameState, 
    actions : T_Action[],
    timeIDGroups : T_TimeGroup[]
}
export default function ResultAtTop({gameState, actions, timeIDGroups} 
    : I_ResultAtTop)
    : JSX.Element {

    const resultOfPlan = calcResultOfPlan({gameState, actions, timeIDGroups});
    const bgColourCSS = 
        resultOfPlan.hasWon ?
            "bg-green-700"
            : "bg-red-700";

    return(
        <div className={`sticky z-10 top-12 md:top-[7.5rem] w-full mb-4 py-2 flex flex-col items-center shadow-md text-white ${bgColourCSS}`}>
            <div className={"font-bold text-lg"}>
                { resultOfPlan.hasWon ? "" : "NOT ENOUGH FOR " }1ST PRIZE
            </div>
            { resultOfPlan.allToDust === null ?
                <Result dustAtEnd={resultOfPlan.dustAtEnd} />
                : <ResultWithRec dustAtEnd={resultOfPlan.dustAtEnd} suggestionData={resultOfPlan.allToDust} hasWon={resultOfPlan.hasWon} />
            }
        </div>
    )
}


function Result({dustAtEnd} 
    : { dustAtEnd : number })
    : JSX.Element {

    return  <div className={"text-base"}>
                { dustAtEnd.toLocaleString() } {`(${toBillions(dustAtEnd)})`}
            </div>
}


function ResultWithRec({dustAtEnd, suggestionData, hasWon}
    : { dustAtEnd: number, suggestionData : T_SuggestionData, hasWon : boolean })
    : JSX.Element {

    const [showTooltip, setShowTooltip] = useState(false);

    const suggestionProps = {
        isVisible: showTooltip,
        setVisibility: setShowTooltip,
        position: suggestionData.position
    }

    return  <div className={"relative flex flex-col"}>
                <ResultWithRecRow label={"now"} quantity={dustAtEnd} />
                <ResultWithRecRow label={"rec."} quantity={suggestionData.dust} suggestionProps={suggestionProps} hasWon={hasWon} />
            </div>
}


type T_SuggestionProps = { 
    isVisible : boolean, 
    setVisibility : Dispatch<SetStateAction<boolean>>,
    position : number 
}
function ResultWithRecRow({label, quantity, suggestionProps, hasWon} 
    : { label : string, quantity : number, suggestionProps? : T_SuggestionProps, hasWon? : boolean }) 
    : JSX.Element {

    const buttonTextColour = hasWon ?
        "text-green-700"
        : "text-red-700";

    return  <div className={"grid grid-rows-1 [grid-template-columns:4rem_minmax(0,_1fr)_3rem_1.75rem]"}>
                <div className={"font-semibold"}>{ label }</div>
                <div className={"text-right"}>{ quantity.toLocaleString() }</div>
                <div className={"text-right"}>{`(${toBillions(quantity)})`}</div>
                { suggestionProps !== undefined ?
                    <div className={"text-right relative"}>
                        <button 
                            onClick={() => suggestionProps.setVisibility(prev => !prev)} 
                            className={`rounded-full w-5 h-5 text-center bg-white hover:opacity-90 font-bold text-sm ${buttonTextColour}`}
                            >
                            ?
                        </button>

                    { suggestionProps !== undefined && suggestionProps.isVisible ?
                        <Tooltip posAndWidthCSS={"-top-9 right-0"} close={() => suggestionProps.setVisibility(false)}>
                            <div className={"text-xs font-bold min-w-max"}>
                                Switch all to dust after position {suggestionProps.position}
                            </div>
                        </Tooltip>
                        : null
                    }
                    </div>
                    : null
                }
            </div>
}