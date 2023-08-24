export const maxedLevelCSS = "border-blue-950 bg-blue-950 text-rose-400";

export const resourceCSS = {
    blue: {
        badge: "bg-sky-700 text-white border-sky-800",
        hover: "hover:bg-sky-600 hover:opacity-100",
        cell : "bg-sky-50 border-sky-200",
    },
    green: {
        badge: "bg-green-700 text-white border-green-800",
        hover: "hover:bg-green-600 hover:opacity-100",
        cell : "bg-green-50 border-green-200",
    },
    red: {
        badge: "bg-red-700 text-white border-red-800",
        hover: "hover:bg-red-600 hover:opacity-100",
        cell : "bg-red-50 border-red-200",
    },
    yellow: {
        badge: "bg-amber-400 text-black font-bold border-amber-500",
        hover: "hover:bg-amber-300 hover:opacity-100",
        cell : "bg-amber-50 border-amber-200",
    },
    dust: {
        badge: "bg-lime-300 text-black font-bold border-lime-500",
        hover: "hover:bg-lime-200 text-black hover:opacity-100",
        cell : "bg-lime-50 border-lime-200",
    },

}

export function nbsp(){
    return String.fromCharCode(160);
}

export function toThousands(num : number) : string {
    return num < 1000 ? num.toString() : `${ Math.floor(num / 1000).toLocaleString() }k`;
}

export function toMillions(num : number) : string {
    return num < 1000000 ? num.toString() : `${ Math.floor(num / 1000000).toLocaleString() }M`;
}

export function toBillions(num : number) : string {
    return num < 1000000000 ? `<1B` : `${ Math.floor(num / 1000000000).toLocaleString() }B`;
}


export function capitalise(str : string) : string {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

const buttonPrimaryShared = "font-bold py-2 px-1 rounded";
export const buttonPrimaryCSSColours = "bg-violet-800 hover:bg-violet-700 text-white";
export const buttonPrimaryCSS = buttonPrimaryCSSColours + " " + buttonPrimaryShared;
export const buttonPrimaryCSS_disabledColours = "bg-gray-300 text-gray-500"
export const buttonPrimaryCSS_disabled = buttonPrimaryCSS_disabledColours + " " + buttonPrimaryShared;
export const buttonPrimaryCSS_on = "bg-violet-950 hover:bg-violet-800 text-white";


const buttonSecondaryShared = "px-2 py-1 rounded";
export const buttonSecondaryCSSColours = "bg-transparent border-violet-600 text-violet-600 hover:bg-violet-50";
export const buttonSecondaryCSS = "border-2" + " " + buttonSecondaryCSSColours + " " + buttonSecondaryShared;
export const buttonDeleteCSS = "bg-gray-800 text-white border-2 border-red-600 hover:bg-gray-700" + " " + buttonSecondaryShared;
export const buttonSecondaryCSSColours_onDark = "bg-white border-violet-600 text-violet-600 hover:bg-violet-50";

export const buttonMoreCSSColours = "bg-violet-200 border-violet-200 text-white hover:bg-violet-100 hover:text-violet-400";
export const buttonMoreCSSColours_on = "bg-violet-300 border-violet-400 text-violet-600 hover:bg-violet-200 hover:text-violet-400";
export const buttonMoreCSSColours_offline = "bg-greyBlue-500 border-greyBlue-500 text-white hover:bg-greyBlue-400 hover:text-greyBlue-100";
export const buttonMoreCSSColours_offlineOn = "bg-greyBlue-700 border-greyBlue-900 text-white hover:bg-greyBlue-400 hover:text-greyBlue-100";


// function getStockpileMsg(stockpiles 
//     : T_Stockpiles) 
//     : string {

//     return `b${stockpiles.blue}, g${stockpiles.green}, r${stockpiles.red}, y${stockpiles.yellow}`;
// }
