interface I_PlannerFooter {
    unboughtUpgrades : number
}
export default function PlannerFooter({unboughtUpgrades} : I_PlannerFooter){
    return  <div className={"bg-neutral-900 py-3 text-white flex flex-col items-center mt-2 w-full"}>
                <h3 className={"text-xl font-bold"}>TIME&apos;S UP</h3>
                <p className={"text-sm"}>with {unboughtUpgrades} upgrades remaining</p>
            </div>
}