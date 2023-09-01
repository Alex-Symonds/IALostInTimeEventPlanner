
import { resourceCSS } from '../utils/formatting';


import { InputPageWrapper, InputNumberAsText } from "./inputGameState";

interface I_InputStockpiles extends Pick<I_StockpileInput, "controlledStockpileValue" | "updateStockpiles"> {
    isVisible : boolean,
}

export default function InputStockpiles({isVisible, controlledStockpileValue, updateStockpiles} 
    : I_InputStockpiles)
    : JSX.Element {

    return  <InputPageWrapper isVisible={isVisible} heading={"Current Stockpiles"}>
                <DustInput controlledStockpileValue={controlledStockpileValue} updateStockpiles={updateStockpiles} />
                <StockpileInput keyId={'blue'} controlledStockpileValue={controlledStockpileValue} updateStockpiles={updateStockpiles} />
                <StockpileInput keyId={'green'} controlledStockpileValue={controlledStockpileValue} updateStockpiles={updateStockpiles} />
                <StockpileInput keyId={'red'} controlledStockpileValue={controlledStockpileValue} updateStockpiles={updateStockpiles} />
                <StockpileInput keyId={'yellow'} controlledStockpileValue={controlledStockpileValue} updateStockpiles={updateStockpiles} />
            </InputPageWrapper>
}

interface I_PropsStockpileWrapper { 
    coloursCSS : string, 
    idStr : string, 
    label: string, 
    children : React.ReactNode 
}
function StockpileWrapper({coloursCSS, idStr, label, children} 
    : I_PropsStockpileWrapper)
    : JSX.Element {

    return  <div className={"ml-2 flex py-1 px-2 items-center border" + " " + coloursCSS}>
                <label className={"block w-20"} htmlFor={idStr}>{label}</label>
                {children}
            </div>
}

function extractBorderColourCSS(cssStr : string){
    const regEx = /border-\w*-\d{2,3}/g;
    const matchArr = cssStr.match(regEx);
    if(matchArr === null){
        return '';
    }
    return matchArr[0];
}


interface I_StockpileInput {
    keyId : string, 
    controlledStockpileValue : (keyId : string) => string | number, 
    updateStockpiles : (e : React.ChangeEvent<HTMLInputElement>, keyId : string) => void
}
function StockpileInput({keyId, controlledStockpileValue, updateStockpiles} 
    : I_StockpileInput )
    : JSX.Element {

    const idStr = `id_${keyId}Stock`;
    const label = `${keyId.charAt(0).toUpperCase()}${keyId.slice(1)}`;
    const borderCSS = extractBorderColourCSS(resourceCSS[keyId as keyof typeof resourceCSS].badge);
    return (
        <StockpileWrapper coloursCSS={resourceCSS[keyId as keyof typeof resourceCSS].badge} label={label} idStr={idStr}>
            <InputNumberAsText cssStr={"w-36 text-black py-1 px-2 font-normal" + " " + borderCSS} idStr={idStr} value={controlledStockpileValue(keyId)} handleChange={(e: React.ChangeEvent<HTMLInputElement> ) => updateStockpiles(e, keyId)} />
        </StockpileWrapper>
    )
}


function DustInput({controlledStockpileValue, updateStockpiles} 
    : Pick<I_StockpileInput, "controlledStockpileValue" | "updateStockpiles">)
    : JSX.Element {

    const borderCSS = extractBorderColourCSS(resourceCSS.dust.badge);
    return(
        <StockpileWrapper coloursCSS={resourceCSS.dust.badge} label={"Dust"} idStr={"id_dust"}>
            <InputNumberAsText 
                idStr={"id_dust"}
                cssStr={"w-36 py-1 px-2 font-normal" + " " + borderCSS}
                value={ controlledStockpileValue('dust') }
                handleChange={(e) => updateStockpiles(e, 'dust')}
            />
        </StockpileWrapper>
    )
}