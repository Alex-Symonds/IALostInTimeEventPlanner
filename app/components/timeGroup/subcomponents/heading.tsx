import { useState } from 'react';

import { T_TimeGroup, T_GameState } from '../../../utils/types';
import { calcDHMString, convertTimeIDToTimeRemaining, convertTimeIDToDate, getDateDisplayStr } from '../../../utils/dateAndTimeHelpers';
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
                                "bg-greyBlue-500 border-greyBlue-600 text-white"
                                : "bg-violet-100 border-violet-200 text-black";
    const fullOfflinePeriodCSS = isDuringOfflinePeriod && showFullOfflinePeriod ?
                                    "text-sm"
                                    : "";
    
    let startAsDate = data.startOfflinePeriodTimeID !== null ?
                        convertTimeIDToDate(data.startOfflinePeriodTimeID, gameState)
                        : null;

    let shortDisplayStr = getDateDisplayStr(timeAsDate);
    let fullDisplayStr = startAsDate !== null ? 
                            getDateDisplayStr(startAsDate) + " - " + shortDisplayStr
                            : shortDisplayStr;

    return(
        <div className={"flex items-center justify-between px-1 border-2 rounded-sm" + " " + conditionalClass}>
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
                            className={"hover:text-greyBlue-100" + " " + fullOfflinePeriodCSS} 
                            onClick={() => setShowFullOfflinePeriod(prev => !prev)}
                            onMouseEnter={() => setIsHover(true)}
                            onMouseLeave={() => setIsHover(false)}
                            >
                            { showFullOfflinePeriod ? fullDisplayStr : shortDisplayStr }
                        </button>
                    </>
            } 
        </div>
    )
}
