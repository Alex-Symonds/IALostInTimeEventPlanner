import { T_TimeGroup, T_GameState } from "@/app/utils/types";

import { calcTimeGroupMoreData} from '../utils/calcTimeGroupMoreData';
import ProductionTableSection from './sectionProductionTable';
import DustStatsSection from './sectionDustStats';
import ProductionSettingsSection from "./sectionProductionSettings";



interface I_TimeGroupMore {
    data : T_TimeGroup,
    remainingTimeGroups : T_TimeGroup[],
    gameState : T_GameState,
    borderColour : string,
    isDuringOfflinePeriod : boolean
}

export default function TimeGroupMore({ data, remainingTimeGroups, gameState, borderColour, isDuringOfflinePeriod } 
    : I_TimeGroupMore )
    : JSX.Element {

    const moreData = calcTimeGroupMoreData(data, remainingTimeGroups, gameState);
    const leftHeadingWidth = "w-20";

    const offlineModeCSS = isDuringOfflinePeriod ?
                            "bg-greyBlue-100 text-black"
                            : "bg-white";
    const offlineModeHr = isDuringOfflinePeriod ?
                            ""
                            : "border-b border-gray-200 mt-2";

    return (
        <section className={"flex flex-col gap-5 border-l border-r px-2 pb-4" + " " + borderColour + " " + offlineModeCSS}>
            <div className={"-mb-2" + " " + offlineModeHr}></div>
            <ProductionSettingsSection 
                productionSettings={ data.productionSettingsDuring } 
                levels={ data.levelsAtEnd } 
                leftHeadingWidth={leftHeadingWidth} 
                isDuringOfflinePeriod={isDuringOfflinePeriod} 
            />
            <DustStatsSection 
                moreData={moreData} 
                gameState={gameState} 
                leftHeadingWidth={leftHeadingWidth} 
            />
            <ProductionTableSection 
                moreData={moreData} 
                gameState={gameState} 
                leftHeadingWidth={leftHeadingWidth} 
            />
        </section>
    )
}









