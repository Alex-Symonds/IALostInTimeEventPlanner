import { useState, Dispatch, SetStateAction } from 'react';

import { toBillions } from '../utils/formatting';
import { T_SuggestionData, T_PurchaseData, T_GameState, T_Action, T_TimeGroup } from "../utils/types";
import { calcResultOfPlan } from '../utils/calcResults';


import Tooltip from './tooltip';

interface I_ResultAtTop { 
    planData : T_PurchaseData[], 
    gameState : T_GameState, 
    actions : T_Action[],
    timeIDGroups : T_TimeGroup[]
}
export default function ResultAtTop({planData, gameState, actions, timeIDGroups} 
    : I_ResultAtTop)
    : JSX.Element {

    let resultOfPlan = calcResultOfPlan({gameState, actions, timeIDGroups});
    let conditionalCSS = 
        resultOfPlan.hasWon ?
            "bg-green-700 text-white"
            : "bg-red-700 text-white";

    return(
        <div className={"sticky top-12 md:top-[7.5rem] shadow-md py-2 flex flex-col items-center w-full mb-4" + " " + conditionalCSS}>
            <div className={"font-bold text-lg"}>
                { resultOfPlan.hasWon ? "" : "NOT ENOUGH FOR " }1ST PRIZE
            </div>
            { resultOfPlan.allToDust === null ?
                <Result dustAtEnd={resultOfPlan.dustAtEnd} />
                : <ResultWithRec dustAtEnd={resultOfPlan.dustAtEnd} suggestionData={resultOfPlan.allToDust} />
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


function ResultWithRec({dustAtEnd, suggestionData}
    : { dustAtEnd: number, suggestionData : T_SuggestionData })
    : JSX.Element {

    const [showTooltip, setShowTooltip] = useState(false);

    const suggestionProps = {
        isVisible: showTooltip,
        setVisibility: setShowTooltip,
        position: suggestionData.position
    }

    return  <div className={"relative flex flex-col"}>
                <ResultWithRecRow label={"now"} quantity={dustAtEnd} />
                <ResultWithRecRow label={"rec."} quantity={suggestionData.dust} suggestionProps={suggestionProps} />
            </div>
}


type T_SuggestionProps = { 
    isVisible : boolean, 
    setVisibility : Dispatch<SetStateAction<boolean>>,
    position : number 
}
function ResultWithRecRow({label, quantity, suggestionProps} 
    : { label : string, quantity : number, suggestionProps? : T_SuggestionProps}) 
    : JSX.Element {

    return  <div className={"grid grid-rows-1 [grid-template-columns:4rem_minmax(0,_1fr)_3rem_1.75rem]"}>
                <div className={"font-semibold"}>{ label }</div>
                <div className={"text-right"}>{ quantity.toLocaleString() }</div>
                <div className={"text-right"}>{`(${toBillions(quantity)})`}</div>
                { suggestionProps !== undefined ?
                    <div className={"text-right relative"}>
                        <button 
                            onClick={() => suggestionProps.setVisibility(prev => !prev)} 
                            className={"rounded-full w-5 h-5 bg-white hover:opacity-90 text-red-700 font-bold text-sm"}
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