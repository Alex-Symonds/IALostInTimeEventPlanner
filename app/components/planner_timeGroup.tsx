import { useState } from 'react';

import { T_OfflinePeriod, T_TimeGroup,  T_GameState} from '../utils/types';
import { convertOfflineTimeToTimeId, getStartTime } from '../utils/dateAndTimeHelpers';

import UpgradeCard from './planner_upgradeCard';
import TimeGroupMore from './planner_timeGroupMore';
import TimeGroupHeading from './planner_timeGroupHeading';
import { MoreButton } from './buttons';


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
                    <div className={"self-end pb-2 pl-1"}>
                        <MoreButton 
                            showMore={showMore}
                            setShowMore={setShowMore}
                            modeKey={isDuringOfflinePeriod ? 'moreOffline' : 'more'}
                        />
                    </div>
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


