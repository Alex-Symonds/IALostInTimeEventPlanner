import { toThousands, resourceCSS } from "../../utils/formatting"
import { T_Stockpiles } from "../../utils/types";


interface I_StockpilesDisplay {
    stockpiles : T_Stockpiles,
    extraCSS? : string,
    wantDust? : boolean
}
export default function StockpilesDisplay({stockpiles, extraCSS} 
    : I_StockpilesDisplay)
    : JSX.Element {

    return (
        <div className={`flex ${extraCSS}`}>
            <p className={'sr-only'}>Egg Stockpiles</p>
            <Stockpile myKey={'blue'} data={stockpiles} />
            <Stockpile myKey={'green'} data={stockpiles} />
            <Stockpile myKey={'red'} data={stockpiles} />
            <Stockpile myKey={'yellow'} data={stockpiles} />
        </div>
    )
}


function Stockpile({myKey, data} 
    : { myKey : string, data: T_Stockpiles })
    : JSX.Element {

    return (
        <div className={`flex justify-between text-sm w-1/4 px-1 gap-1 rounded ${resourceCSS[myKey as keyof typeof resourceCSS].badge}`}>
            <div>{myKey.charAt(0).toLowerCase()}</div>
            <div>{toThousands(data[myKey as keyof typeof data])}</div>
        </div>
    )
}