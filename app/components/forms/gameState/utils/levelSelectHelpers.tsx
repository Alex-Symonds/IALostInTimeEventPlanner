import { getMainKeysFromJSON, getMaxLevelFromJSON, T_DATA_KEYS } from "@/app/utils/getDataFromJSON";



export function formatSelectValueStr(key : string, levelNum : number)
    : string {

    return `${ key.toLowerCase() }_${ levelNum.toString() }`
}


export function calcLevelKeyValue(e : React.ChangeEvent<HTMLSelectElement>){
    const valueStr = e.target.value;
    const splitStr = valueStr.split("_");
    let key = splitStr[0];
    key = key.toLowerCase();
    const prodInt = parseInt(splitStr[1]);  

    return {
        key: key,
        value : prodInt
    }
}


export function calcValidLevel(key : string, value : number){
    if(key === "all"){
        return value < 0 ?
                0
                : value > 5 ?
                    5
                    : value;
    }

    const validKeys = getMainKeysFromJSON();
    if(value > 0 && validKeys.includes(key)){
        const maxLevel = getMaxLevelFromJSON(key as T_DATA_KEYS);
        return value > maxLevel ? maxLevel : value;
    }
    return 0;
}