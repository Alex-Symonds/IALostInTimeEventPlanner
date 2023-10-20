
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


export function IconEyeClosed({size, colour} : {size : string, colour? : string}) : JSX.Element {
    return  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path 
                    d="M1.33341 2.84667L2.18675 2L13.3334 13.1467L12.4867 14L10.4334 11.9467C9.66675 12.2 8.85341 12.3333 8.00008 12.3333C4.66675 12.3333 1.82008 10.26 0.666748 7.33333C1.12675 6.16 1.86008 5.12667 2.79341 4.30667L1.33341 2.84667ZM8.00008 5.33333C8.53051 5.33333 9.03922 5.54405 9.4143 5.91912C9.78937 6.29419 10.0001 6.8029 10.0001 7.33333C10.0001 7.56667 9.96008 7.79333 9.88675 8L7.33342 5.44667C7.54008 5.37333 7.76675 5.33333 8.00008 5.33333ZM8.00008 2.33333C11.3334 2.33333 14.1801 4.40667 15.3334 7.33333C14.7867 8.72 13.8601 9.92 12.6667 10.7933L11.7201 9.84C12.6267 9.21333 13.3734 8.36 13.8801 7.33333C12.7801 5.09333 10.5067 3.66667 8.00008 3.66667C7.27342 3.66667 6.56008 3.78667 5.89341 4L4.86675 2.98C5.82675 2.56667 6.88675 2.33333 8.00008 2.33333ZM2.12008 7.33333C3.22008 9.57333 5.49341 11 8.00008 11C8.46008 11 8.91341 10.9533 9.33342 10.86L7.81342 9.33333C6.86008 9.23333 6.10008 8.47333 6.00008 7.52L3.73341 5.24667C3.07341 5.81333 2.52008 6.52 2.12008 7.33333Z" 
                    fill={colour ?? "white"}
                />
            </svg>
}


export function IconEyeOpen({size, colour} : {size : string, colour? : string}) : JSX.Element {
    return  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path 
                    d="M8.00008 6C8.53051 6 9.03922 6.21071 9.4143 6.58579C9.78937 6.96086 10.0001 7.46957 10.0001 8C10.0001 8.53043 9.78937 9.03914 9.4143 9.41421C9.03922 9.78929 8.53051 10 8.00008 10C7.46965 10 6.96094 9.78929 6.58587 9.41421C6.21079 9.03914 6.00008 8.53043 6.00008 8C6.00008 7.46957 6.21079 6.96086 6.58587 6.58579C6.96094 6.21071 7.46965 6 8.00008 6ZM8.00008 3C11.3334 3 14.1801 5.07333 15.3334 8C14.1801 10.9267 11.3334 13 8.00008 13C4.66675 13 1.82008 10.9267 0.666748 8C1.82008 5.07333 4.66675 3 8.00008 3ZM2.12008 8C3.22008 10.24 5.49341 11.6667 8.00008 11.6667C10.5067 11.6667 12.7801 10.24 13.8801 8C12.7801 5.76 10.5067 4.33333 8.00008 4.33333C5.49341 4.33333 3.22008 5.76 2.12008 8Z" 
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
