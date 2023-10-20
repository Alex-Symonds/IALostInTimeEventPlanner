import { useState } from 'react';

import { T_TimeGroup, T_GameState } from '../../../utils/types';
import { calcDHMString, convertTimeIDToTimeRemaining, convertTimeIDToDate, calcDateWithTimeDisplayStr } from '../../../utils/dateAndTimeHelpers';
import { MAX_TIME } from '../../../utils/consts';

import { IconMoon } from '../../subcomponents/icons';

interface I_TimeGroupHeading {
    gameState : T_GameState, 
    data : T_TimeGroup,
}
export default function TimeGroupHeading({data, gameState} : I_TimeGroupHeading){
    const [showFullOfflinePeriod, setShowFullOfflinePeriod] = useState<boolean>(false);
    const [isHover, setIsHover] = useState(false);

    const timeAsDHM = convertTimeIDToTimeRemaining(MAX_TIME - data.timeID);
    const timeAsDate = convertTimeIDToDate(data.timeID, gameState);

    const isDuringOfflinePeriod = data.startOfflinePeriodTimeID !== null;

    const conditionalClass = isDuringOfflinePeriod ?
                                "bg-greyBlue-500 border-greyBlue-600 text-white border-2"
                                : "border-neutral-200 text-black border-b-2";
    const fullOfflinePeriodCSS = isDuringOfflinePeriod && showFullOfflinePeriod ?
                                    "text-sm"
                                    : "";
    
    let startAsDate = data.startOfflinePeriodTimeID !== null ?
                        convertTimeIDToDate(data.startOfflinePeriodTimeID, gameState)
                        : null;

    let shortDisplayStr = calcDateWithTimeDisplayStr(timeAsDate);
    let fullDisplayStr = startAsDate !== null ? 
                            calcDateWithTimeDisplayStr(startAsDate) + " - " + shortDisplayStr
                            : shortDisplayStr;

    return(
        <h3 className={"w-full flex items-center justify-between px-1 rounded-sm" + " " + conditionalClass}>
            <div>
                {calcDHMString(timeAsDHM)}
            </div>
            {
                startAsDate === null ?
                    <div suppressHydrationWarning={true}>
                        { shortDisplayStr }
                    </div>
                    : 
                    <>
                        { !showFullOfflinePeriod ?
                            <div>{IconMoon("16", isHover ? "#dde6ff" : "#fff")}</div>
                            : null
                        }
                        <button 
                            suppressHydrationWarning={true} 
                            className={"hover:text-greyBlue-100 plnMd:hidden" + " " + fullOfflinePeriodCSS} 
                            onClick={() => setShowFullOfflinePeriod(prev => !prev)}
                            onMouseEnter={() => setIsHover(true)}
                            onMouseLeave={() => setIsHover(false)}
                            >
                            { showFullOfflinePeriod ? fullDisplayStr : shortDisplayStr }
                        </button>
                        <div className={"text-sm hidden plnMd:block"} suppressHydrationWarning={true}>
                            { fullDisplayStr }
                        </div>

                    </>
            } 
        </h3>
    )
}
