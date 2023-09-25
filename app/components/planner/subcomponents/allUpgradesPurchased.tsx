import NoPlannerWrapper, { NoPlannerHeading } from "../../subcomponents/noPlanner"

export default function AllUpgradesPurchased(){
    return  <NoPlannerWrapper mode={'done'}>
                <NoPlannerHeading>All Upgrades Purchased</NoPlannerHeading>
                <p>You&apos;ve done all you can, I hope the planner helped. Enjoy your prize! &#128516;</p>
                <div className={"mt-8 border-l-4 border-amber-500 bg-amber-50 rounded px-3 py-3 grid [grid-template-columns:2.5rem_auto] items-center"}>
                    <div>
                        <div aria-hidden={true} className={"flex items-center justify-center leading-none h-6 w-6 rounded-full bg-amber-300 text-amber-800 text-lg font-bold mr-3"}>
                            !
                        </div>
                        <span className={"sr-only"}>Warning:</span>
                    </div>
                    <span className={"justify-self-start"}>Don&apos;t forget to switch everyone to dust production!</span>
                </div>
            </NoPlannerWrapper>
}