import { resourceCSS } from "../../../../utils/formatting"
import { T_ProductionSettings, T_Levels } from "../../../../utils/types";


interface I_ProductionSettingsSummary {
    productionSettings : T_ProductionSettings, 
    levels : T_Levels, 
    extraCSS? : string, 
    wantHeadings : boolean, 
    isDuringOfflinePeriod : boolean
}

export default function ProductionSettingsSummary({productionSettings, levels, extraCSS, wantHeadings, isDuringOfflinePeriod} 
    : I_ProductionSettingsSummary)
    : JSX.Element {

    return (
        <div className={"flex w-40" + " " + extraCSS}>
            {
                Object.keys(productionSettings).map((myKey, idx) => {
                    const notUnlocked = levels[myKey as keyof typeof levels] === 0;

                    let conditionalCSS = 
                        notUnlocked ?
                            isDuringOfflinePeriod ?
                                "border-greyBlue-400 text-greyBlue-400"
                                : "border-greyBlue-200 text-greyBlue-200"
                            :
                            resourceCSS[productionSettings[myKey as keyof typeof productionSettings] as keyof typeof resourceCSS].badge;

                    conditionalCSS = idx === 0 ? conditionalCSS + " " + "border-l" : conditionalCSS;

                    let outerBorderConditionalCSS = 
                        isDuringOfflinePeriod && idx === 0 ? 
                            "border-t border-b border-l"
                            : isDuringOfflinePeriod && idx === Object.keys(productionSettings).length - 1 ?
                                "border-r border-t border-b"
                                : isDuringOfflinePeriod ?
                                    "border-t border-b"
                                    : "";

                    return  <div key={idx} className={"w-5 flex flex-col justify-center text-xs" }>
                                { wantHeadings ?
                                    <div className={"flex items-center justify-center"}>
                                        {myKey.charAt(0).toUpperCase() + myKey.charAt(1)}
                                    </div>
                                    : null
                                }

                                <div className={"border-greyBlue-500" + " " + outerBorderConditionalCSS}>
                                    <div className={"flex items-center justify-center border-t border-b border-r" + " " + conditionalCSS}>
                                        {notUnlocked ? "-" : productionSettings[myKey as keyof typeof productionSettings].charAt(0).toLowerCase()}
                                    </div>
                                </div>
                            </div>
                })
            }
        </div>
    )
}
