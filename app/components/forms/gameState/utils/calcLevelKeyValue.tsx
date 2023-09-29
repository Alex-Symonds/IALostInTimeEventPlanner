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