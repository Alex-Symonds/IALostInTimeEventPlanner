import { T_ProductionSettings, T_Levels } from "@/app/utils/types";

import ProductionSettingsSummary from './productionSummary';

import { I_MoreSections } from "../utils/types";
import TimeGroupMoreSubheading from './subheading';



interface I_ProductionSettingsSection extends 
    Pick<I_MoreSections, "isDuringOfflinePeriod" | "leftHeadingWidth"> {
    levels : T_Levels, 
    productionSettings : T_ProductionSettings
}
export default function ProductionSettingsSection({productionSettings, levels, isDuringOfflinePeriod, leftHeadingWidth} 
    : I_ProductionSettingsSection)
    : JSX.Element {

    let extraCSS = leftHeadingWidth === "w-20" ?
                    "ml-20"
                    : "";

    return (
        <section className={"py-1 flex flex-col gap-1"}>
            <TimeGroupMoreSubheading text={"Current Settings"} />
            <ProductionSettingsSummary 
                productionSettings={productionSettings} 
                levels={levels} 
                extraCSS={extraCSS}
                wantHeadings={true} 
                isDuringOfflinePeriod={isDuringOfflinePeriod}
            />
        </section>
    )
}