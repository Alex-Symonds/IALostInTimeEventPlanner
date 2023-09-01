import { useState } from 'react';

import { T_OfflinePeriod, T_TimeGroup,  T_GameState} from '../utils/types';
import { calcDHMString, convertOfflineTimeToTimeId, convertTimeIdToTimeRemaining, convertTimeIdToDate, getDateDisplayStr, getStartTime } from '../utils/dateAndTimeHelpers';
import { MAX_TIME } from '../utils/consts';

import UpgradeCard from './planner_upgradeCard';
import TimeGroupMore from './planner_timeGroupMore';
import TimeGroupHeading from './planner_timeGroupHeading';

import { IconMoon } from './icons';

interface I_TimeGroup {
    gameState : T_GameState, 
    offlinePeriods : T_OfflinePeriod[],
    groupData : T_TimeGroup, 
    startPos : number, 
    openUpgradePicker: (idx : number) => void, 
    remainingGroups : T_TimeGroup[]
}

export default function TimeGroup({groupData, startPos, openUpgradePicker, offlinePeriods, gameState, remainingGroups} 
    : I_TimeGroup)
    : JSX.Element {

    const [showMore, setShowMore] = useState(false);
    
    const startedAt = getStartTime(gameState);
    const activeOfflinePeriodIdx = offlinePeriods.findIndex(ele => convertOfflineTimeToTimeId(ele.end, startedAt) === groupData.timeId);
    const isDuringOfflinePeriod = activeOfflinePeriodIdx !== -1;

    const offlineCSS = isDuringOfflinePeriod ?
                            "bg-greyBlue-200"
                            : "";
    const borderColour = isDuringOfflinePeriod ?
                            "border-greyBlue-300"
                            : "border-neutral-200";
    
    return (
        <>
            <TimeGroupHeading 
                data={groupData} 
                startOfOfflinePeriod={isDuringOfflinePeriod ? convertOfflineTimeToTimeId(offlinePeriods[activeOfflinePeriodIdx].start, startedAt) : null} 
                gameState={gameState}
            />
        <div className={"flex flex-col mt-1 border-b border-t shadow w-72" + " " + offlineCSS + " " + borderColour}>

            <div className={"flex justify-center pt-1 px-1 border-l border-r" + " " + borderColour}>
                <div className={"flex"}>
                    <UpdateCardContainer 
                        upgrades={groupData.upgrades}
                        startPos={startPos}
                        isDuringOfflinePeriod={isDuringOfflinePeriod}
                        openUpgradePicker={openUpgradePicker}
                    />
                    <MoreButtonContainer 
                        showMore={showMore}
                        setShowMore={setShowMore}
                        isDuringOfflinePeriod={isDuringOfflinePeriod}
                    />
                </div>
            </div>
            { showMore ?
                <TimeGroupMore 
                    data={groupData} 
                    productionSettings={groupData.productionSettings} 
                    levels={groupData.levels} 
                    remainingTimeGroups={remainingGroups}
                    gameState={gameState}
                    borderColour={borderColour}
                    isDuringOfflinePeriod={isDuringOfflinePeriod}
                    />
                : null
            }
    </div>
    </>
    )
}


interface I_UpdateCardContainer extends Pick<T_TimeGroup, "upgrades">, 
                                        Pick<I_TimeGroup, "openUpgradePicker" | "startPos"> {
        isDuringOfflinePeriod : boolean,
    }

function UpdateCardContainer({upgrades, startPos, isDuringOfflinePeriod, openUpgradePicker} 
    : I_UpdateCardContainer)
    : JSX.Element {

    return(
        <div className={"flex flex-col gap-1 pt-1.5 pb-2"}>
        {
            upgrades.map((data, idx) => {
                return <UpgradeCard key={data.timeId + "_" + data.key + "_" + data.level} 
                            data={data} 
                            pos={startPos + idx} 
                            openUpgradePicker={openUpgradePicker} 
                            isDuringOfflinePeriod={isDuringOfflinePeriod} 
                        />
            }) 
        }
        </div>
    )
}




interface I_MoreButtonContainer {
    showMore : boolean,
    setShowMore : React.Dispatch<React.SetStateAction<boolean>>,
    isDuringOfflinePeriod : boolean,
}
function MoreButtonContainer({showMore, setShowMore, isDuringOfflinePeriod,} 
    : I_MoreButtonContainer)
    : JSX.Element {

    const COLOURS = {
        normal: {
            on:     "bg-violet-300      border-violet-400   text-violet-600     hover:bg-violet-200     hover:text-violet-400",
            off:    "bg-violet-200      border-violet-200   text-white          hover:bg-violet-100     hover:text-violet-400",
        },
        offlineMode: {
            on:     "bg-greyBlue-600    border-greyBlue-800 text-white          hover:bg-greyBlue-300   hover:text-greyBlue-100",
            off:    "bg-greyBlue-400    border-greyBlue-400 text-white          hover:bg-greyBlue-300   hover:text-greyBlue-100",
        }
    }

    const modeKey = isDuringOfflinePeriod ? 'offlineMode' : 'normal';
    const onOffKey = showMore ? 'on' : 'off';
    const toggleMoreCSS = COLOURS[modeKey][onOffKey];

    return (
        <div className={"self-end pb-2 pl-1"}>
            <button className={"border-2 rounded-full flex align-center justify-center w-7 h-7" + " " + toggleMoreCSS} 
                    onClick={() => setShowMore(prev => !prev)}
                    >
                <span aria-hidden={true}>...</span>
                <span className={"sr-only"}>more info</span>
            </button>
        </div>
    )
}



