import { useState, Dispatch, SetStateAction } from 'react';

import { theme, toBillions, topForStickybar } from '../../../utils/formatting';
import { T_SuggestionData, T_PurchaseData, T_GameState, T_Action, T_TimeGroup } from "../../../utils/types";
import { calcResultOfPlan } from '../../../utils/calcResults';


import Tooltip from '../../subcomponents/tooltip';
import HeaderFooterContentWrapper from './sideBorderWrapper';


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
    return( 
        <div className={`sticky z-10 ${topForStickybar} md:[top:calc(7.25rem_+_1px)] w-full ${theme.mainAsBg} mb-4 shadow-md`}>
            <div className={`${theme.plannerHeaderFooterBgAndText} mt-1 md:rounded-t w-full py-2 flex flex-col items-start `}>
            <HeaderFooterContentWrapper 
                borderColour={resultOfPlan.hasWon ?     "border-green-600"  : "border-red-600"}
                padding={resultOfPlan.hasWon ?          "pl-3 py-1"         : "pl-3 md:pl-4 py-1"}
                margins={"mx-4"}
                >
                <div className={"font-bold text-lg"}>
                    { resultOfPlan.hasWon ? "" : "Not enough for " }
                    <span className={"ordinal"}>1st</span> prize
                    { resultOfPlan.hasWon ? " is yours!" : "" }
                </div>
                <div className={"text-sm"}>
                { resultOfPlan.allToDust === null ?
                    <Result dustAtEnd={resultOfPlan.dustAtEnd} />
                    : <ResultWithRec dustAtEnd={resultOfPlan.dustAtEnd} suggestionData={resultOfPlan.allToDust} />
                }
                </div>
            </HeaderFooterContentWrapper>
            </div>
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
    : { label : string, quantity : number, suggestionProps? : T_SuggestionProps }) 
    : JSX.Element {

    const buttonTextColour = "text-neutral-700";

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
                            <div className={"text-xs font-medium min-w-max"}>
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