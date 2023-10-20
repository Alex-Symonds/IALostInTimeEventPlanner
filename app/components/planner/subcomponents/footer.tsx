import { theme } from "@/app/utils/formatting";
import HeaderFooterContentWrapper from "./sideBorderWrapper";

interface I_PlannerFooter {
    unboughtUpgrades : number
}
export default function PlannerFooter({unboughtUpgrades} : I_PlannerFooter){
    const message = unboughtUpgrades === 0 ?
                        "All upgrades purchased"
                        : `${unboughtUpgrades} upgrades unpurchased`;

    return  <div className={`${theme.plannerHeaderFooterBgAndText} py-4 flex flex-col items-start mt-2 w-full border-t-2 ${theme.mainAsBorder}`}>
                <HeaderFooterContentWrapper
                    padding={"pl-3 py-1"}
                    margins={"ml-2 md:ml-4 mr-4"}
                    >
                    <h3 className={"text-xl font-bold"}>Time&apos;s up</h3>
                    <p className={"text-sm"}>{message}</p>
                </HeaderFooterContentWrapper>
            </div>
}