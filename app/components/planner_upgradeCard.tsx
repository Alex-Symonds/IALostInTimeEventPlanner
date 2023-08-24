import UPGRADE_DATA from '../upgrades.json';

import { MAX_TIME } from '../utils/consts';
import { buttonPrimaryCSSColours } from '../utils/formatting';

import { BadgeCost } from './badges';

interface I_UpgradeCard {
    data : any, 
    pos : number, 
    openUpgradePicker : any, 
    isDuringOfflinePeriod : boolean
}

export default function UpgradeCard({data, pos, openUpgradePicker, isDuringOfflinePeriod} 
    : I_UpgradeCard)
    : JSX.Element {

    const targetData = UPGRADE_DATA[data.key as keyof typeof UPGRADE_DATA];
    const name = targetData.name;
    const costData = targetData.upgrades[data.level - 1].costs;
    const indexPlanData = pos - 1;

    const outOfTimeClass = "bg-gray-100 border-gray-200 text-gray-300";
    const offlineClass = "bg-gray-50 border-greyBlue-300";
    const defaultClass = "bg-gray-100 border-gray-200";

    const conditionalClass = MAX_TIME < data.timeId ?
                                outOfTimeClass
                                : isDuringOfflinePeriod ?
                                    offlineClass
                                    : defaultClass;

    return (
        <button className={"flex gap-1 items-stretch"} onClick={() => openUpgradePicker(indexPlanData)}>
            <div className={"flex items-center justify-center px-0.25 py-0.75 w-8 rounded"+ " " + buttonPrimaryCSSColours}>
                {pos}
            </div>
            <div className={"w-52 flex items-center text-black px-1.5 py-0.5 gap-3.5 border"  + " " + conditionalClass}>
                <span className={"w-10 block text-sm flex items-center"}>{name}</span>
                <span className={"w-5 block text-sm font-bold flex items-center justify-center"}>{data.level}</span>
                <div className={"flex gap-1"} >
                {
                    costData === null || costData.length === 0 ?
                        <div>{ data.level === 1 ? "free" : "n/a" }</div>
                        : costData.map((costData : any, idx : number) => {
                            return <BadgeCost key={idx} data={costData} extraCSS={undefined} />
                        })
                }
                </div>
            </div>
        </button>
    )
}