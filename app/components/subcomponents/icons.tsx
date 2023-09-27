
export function IconClose({size} : {size : string}) 
    : JSX.Element {

    return  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.27933 11.3718C2.90689 11.7442 2.90689 12.3481 3.27933 12.7205C3.65177 13.093 4.25561 13.093 4.62805 12.7205L7.99994 9.34861L11.3719 12.7207C11.7444 13.0931 12.3482 13.0931 12.7207 12.7207C13.0931 12.3482 13.0931 11.7444 12.7207 11.3719L9.34866 7.99986L12.7204 4.62808C13.0928 4.25563 13.0928 3.65178 12.7204 3.27933C12.348 2.90689 11.7441 2.90689 11.3717 3.27933L7.99994 6.65112L4.62833 3.27946C4.25589 2.90702 3.65205 2.90702 3.27961 3.27946C2.90717 3.65191 2.90717 4.25576 3.27961 4.62821L6.65121 7.99986L3.27933 11.3718Z"/>
            </svg>
}


export function IconCheck({size, colour} : {size : string, colour? : string}){
    return  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path 
                    d="M4.71996 8.00006C4.5323 7.8313 4.28778 7.73973 4.03543 7.74373C3.78308 7.74773 3.54158 7.84699 3.35936 8.02162C3.17715 8.19624 3.0677 8.4333 3.05297 8.68525C3.03825 8.9372 3.11933 9.1854 3.27996 9.38006L5.49996 11.7101C5.5929 11.8076 5.70459 11.8853 5.82832 11.9386C5.95204 11.9918 6.08525 12.0195 6.21996 12.0201C6.35395 12.0208 6.48673 11.9947 6.61041 11.9432C6.7341 11.8916 6.84616 11.8158 6.93996 11.7201L13.72 4.72006C13.8119 4.62551 13.8843 4.51378 13.933 4.39124C13.9818 4.26871 14.0059 4.13778 14.004 4.00592C14.0022 3.87406 13.9744 3.74386 13.9222 3.62275C13.87 3.50163 13.7945 3.39199 13.7 3.30006C13.6054 3.20814 13.4937 3.13573 13.3711 3.08699C13.2486 3.03824 13.1177 3.01411 12.9858 3.01597C12.854 3.01783 12.7238 3.04564 12.6026 3.09781C12.4815 3.14999 12.3719 3.22551 12.28 3.32006L6.22996 9.58006L4.71996 8.00006Z" 
                    fill={colour ?? "white"}
                />
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
