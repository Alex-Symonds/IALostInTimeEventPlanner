
export function IconClose({size} : {size : string}) 
    : JSX.Element {

    return  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.27933 11.3718C2.90689 11.7442 2.90689 12.3481 3.27933 12.7205C3.65177 13.093 4.25561 13.093 4.62805 12.7205L7.99994 9.34861L11.3719 12.7207C11.7444 13.0931 12.3482 13.0931 12.7207 12.7207C13.0931 12.3482 13.0931 11.7444 12.7207 11.3719L9.34866 7.99986L12.7204 4.62808C13.0928 4.25563 13.0928 3.65178 12.7204 3.27933C12.348 2.90689 11.7441 2.90689 11.3717 3.27933L7.99994 6.65112L4.62833 3.27946C4.25589 2.90702 3.65205 2.90702 3.27961 3.27946C2.90717 3.65191 2.90717 4.25576 3.27961 4.62821L6.65121 7.99986L3.27933 11.3718Z"/>
            </svg>
}


export function IconMoon(size : string, colour? : string){
    colour = colour ?? "#FFF";
    return(
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 6.35 6.3499999"
            >
            <g
                transform="translate(-39.999999,-39.999999)">
                <path
                    style={ReactifyInkscapeStyle(`opacity:0.998235;fill:${colour};stroke-width:0.004;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none`)}
                    d="m 43.174999,39.999999 c -1.753504,0 -3.175,1.421496 -3.175,3.175 0,1.753504 1.421496,3.175 3.175,3.175 0.436999,-2.17e-4 0.869249,-0.09064 1.26969,-0.265617 -1.348694,-0.399006 -2.274148,-1.637781 -2.27428,-3.044259 2.73e-4,-1.262323 0.748318,-2.404577 1.90531,-2.909383 -0.292403,-0.08661 -0.595759,-0.130644 -0.90072,-0.130741 z"
                />
            </g>
        </svg>
    )
}


export function IconPointingRight(colourStr : string){
    return(
        <svg width="10.000001" height="16.000015" viewBox="0 0 2.6458335 4.2333376" aria-hidden="true">
            <g transform="translate(-1.8166475,-2.9104147)">
                <text
                    style={ReactifyInkscapeStyle(`fill:${colourStr};font-size:8.77772px;line-height:1.25;font-family:Roboto;-inkscape-font-specification:Roboto;display:inline;stroke-width:0.548606`)}
                    x="-5.9744253"
                    y="-1.6983222"
                    id="text1435"
                    transform="scale(-0.80590153,-1.2408464)"> 
                    <tspan
                    x="-5.9744253"
                    y="-1.6983222"
                    style={ReactifyInkscapeStyle("stroke-width:0.548606")}>
                    «
                    </tspan>
                </text>
            </g>
        </svg>
    )
}


type T_DynamicObjectStringValues = {
    [key : string]: string,
}
function ReactifyInkscapeStyle(str : string){
    let result : T_DynamicObjectStringValues = {};
    let strArr = str.split(";");
    for(let i = 0; i < strArr.length; i++){
        let kv = strArr[i].split(":");
        let key = kv[0];

        if(key === "-inkscape-font-specification"){
            break;
        }

        let value = kv[1];
        let hyphenIdx = key.indexOf("-");
        if(hyphenIdx === -1){
            result[key] = value;
        }
        else{
            let newKey = key.slice(0,hyphenIdx) + key.slice(hyphenIdx + 1, hyphenIdx + 2).charAt(0).toUpperCase() + key.slice(hyphenIdx + 2).slice(0);
            result[newKey] = value;
        }

    }
    return result;
}
