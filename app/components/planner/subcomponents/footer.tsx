interface I_PlannerFooter {
    unboughtUpgrades : number
}
export default function PlannerFooter({unboughtUpgrades} : I_PlannerFooter){
    const message = unboughtUpgrades === 0 ?
                        "with all upgrades purchased"
                        : `with ${unboughtUpgrades} upgrades unpurchased`;

    return  <div className={"bg-violet-950 py-4 text-white flex flex-col items-center mt-2 w-full"}>
                <h3 className={"text-xl font-bold"}>TIME&apos;S UP</h3>
                <p className={"text-sm"}>{message}</p>
            </div>
}