import { resourceCSS, toThousands, maxedLevelCSS } from "../utils/formatting";
import { T_CostData } from '../utils/types';


interface I_PropsBadgeCost {
    data : T_CostData,
    extraCSS? : string,
}
export function BadgeCost({data, extraCSS} 
    : I_PropsBadgeCost)
    : JSX.Element {

    const displayQty = toThousands(parseInt(data.quantity));
    extraCSS = extraCSS ?? "justify-between px-2 py-0.5 rounded text-xs";
    
    return (
        <div className={"flex" + " " + extraCSS + " " + resourceCSS[data.egg as keyof typeof resourceCSS].badge}>
            <span className={"block mr-1"}>{data.egg.charAt(0)}</span>
            <span className={"block"}>{ displayQty }</span>
        </div>
    )
}


interface I_PropsBadgeMaxed {
    extraCSS? : string,
}
export function BadgeMaxed({extraCSS} 
    : I_PropsBadgeMaxed)
    : JSX.Element {

    return <div className={"flex items-center text-xs px-2 rounded border font-bold" + " " + maxedLevelCSS + " " + extraCSS}>Maxed</div>
}