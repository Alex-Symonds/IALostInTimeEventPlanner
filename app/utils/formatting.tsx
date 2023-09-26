export const maxedLevelCSS = "border-blue-950 bg-blue-950 text-rose-400";

export const resourceCSS = {
    blue: {
        badge: "bg-sky-700 text-white border-sky-800",
        hover: "hover:bg-sky-600 hover:opacity-100",
        cell : "bg-sky-50 border-sky-300",
    },
    green: {
        badge: "bg-green-700 text-white border-green-800",
        hover: "hover:bg-green-600 hover:opacity-100",
        cell : "bg-green-50 border-green-300",
    },
    red: {
        badge: "bg-red-700 text-white border-red-800",
        hover: "hover:bg-red-600 hover:opacity-100",
        cell : "bg-red-50 border-red-300",
    },
    yellow: {
        badge: "bg-amber-400 text-black font-bold border-amber-500",
        hover: "hover:bg-amber-300 hover:opacity-100",
        cell : "bg-amber-50 border-amber-300",
    },
    dust: {
        badge: "bg-lime-300 text-black font-bold border-lime-500",
        hover: "hover:bg-lime-200 text-black hover:opacity-100",
        cell : "bg-lime-50 border-lime-400 text-black",
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


// function getStockpileMsg(stockpiles 
//     : T_Stockpiles) 
//     : string {

//     return `b${stockpiles.blue}, g${stockpiles.green}, r${stockpiles.red}, y${stockpiles.yellow}`;
// }
