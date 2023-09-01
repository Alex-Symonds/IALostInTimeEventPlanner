import { useState } from 'react';

import { T_TimeGroup, T_GameState } from '../utils/types';
import { calcDHMString, convertOfflineTimeToTimeId, convertTimeIdToTimeRemaining, convertTimeIdToDate, getDateDisplayStr, getStartTime } from '../utils/dateAndTimeHelpers';
import { MAX_TIME } from '../utils/consts';

import { IconMoon } from './icons';

interface I_TimeGroupHeading {
    gameState : T_GameState, 
    data : T_TimeGroup,
    startOfOfflinePeriod : number | null,
}
export default function TimeGroupHeading({data, startOfOfflinePeriod, gameState} : I_TimeGroupHeading){
    const [showFullOfflinePeriod, setShowFullOfflinePeriod] = useState<boolean>(false);
    const [isHover, setIsHover] = useState(false);

    const timeAsDHM = convertTimeIdToTimeRemaining(MAX_TIME - data.timeId);
    const timeAsDate = convertTimeIdToDate(data.timeId, gameState);

    const isDuringOfflinePeriod = startOfOfflinePeriod !== null;

    const conditionalClass = isDuringOfflinePeriod ?
                                "bg-greyBlue-500 border-greyBlue-600 text-white"
                                : "bg-violet-100 border-violet-200 text-black";
    const fullOfflinePeriodCSS = isDuringOfflinePeriod && showFullOfflinePeriod ?
                                    "text-sm"
                                    : "";
    
    let startAsDate = isDuringOfflinePeriod ?
                        convertTimeIdToDate(startOfOfflinePeriod, gameState)
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
