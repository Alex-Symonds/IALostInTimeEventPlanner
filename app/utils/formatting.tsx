
export const maxedLevelCSS = "border-blue-950 bg-blue-950 text-rose-400";

export const theme = {
    mainAsBg: "bg-neutral-100",
    mainAsBorder: "border-neutral-100",
    borderOnMain: "border-neutral-500",
    emptyBg: "bg-neutral-400",
    plannerHeaderFooterBgAndText: "bg-neutral-600 text-white",
    headingBgAndText: "bg-neutral-500 text-white",

    mainHeadingText: "text-violet-700",
    subtleTextOnBg: "text-neutral-800",
    panelBg: "bg-white",
    primaryOnToolbar: 'primary',
    secondaryOnToolbar: 'secondary',
}

export const resourceCSS = {
    blue: {
        badge: "bg-sky-700 text-white border-sky-800",
        hover: "hover:bg-sky-600 hover:opacity-100",
        cell : "bg-sky-50 border-sky-300",
        field: "border-sky-700 bg-sky-100",
    },
    green: {
        badge: "bg-green-700 text-white border-green-800",
        hover: "hover:bg-green-600 hover:opacity-100",
        cell : "bg-green-50 border-green-300",
        field: "border-green-700 bg-green-100",
    },
    red: {
        badge: "bg-red-700 text-white border-red-800",
        hover: "hover:bg-red-600 hover:opacity-100",
        cell : "bg-red-50 border-red-300",
        field: "border-red-700 bg-red-100",
    },
    yellow: {
        badge: "bg-amber-400 text-black font-bold border-amber-500",
        hover: "hover:bg-amber-300 hover:opacity-100",
        cell : "bg-amber-50 border-amber-300",
        field: "border-amber-500 bg-amber-100",
    },
    dust: {
        badge: "bg-lime-300 text-black font-bold border-lime-500",
        hover: "hover:bg-lime-200 text-black hover:opacity-100",
        cell : "bg-lime-50 border-lime-400 text-black",
        field: "border-lime-500 bg-lime-200",
    },

}

export function nbsp(){
    return String.fromCharCode(160);
}

export function toThousands(num : number) : string {
    return num < 1000 ? num.toLocaleString() : `${ Math.floor(num / 1000).toLocaleString() }k`;
}

export function toMillions(num : number) : string {
    return num < 1000000 ? num.toLocaleString() : `${ Math.floor(num / 1000000).toLocaleString() }M`;
}

export function toBillions(num : number) : string {
    return num < 1000000000 ? `<1B` : `${ Math.floor(num / 1000000000).toLocaleString() }B`;
}

export function capitalise(str : string) : string {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}


// function getStockpileMsg(stockpiles 
//     : T_Stockpiles) 
//     : string {

//     return `b${stockpiles.blue}, g${stockpiles.green}, r${stockpiles.red}, y${stockpiles.yellow}`;
// }
