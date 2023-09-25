import { convertTimeIDToDate } from '@/app/utils/dateAndTimeHelpers';
import { resourceCSS, toThousands } from "@/app/utils/formatting";
import { T_GameState } from "@/app/utils/types";

import { I_MoreSections, T_MoreData, T_ResourceColours } from '../utils/types';
import TimeGroupMoreSubheading from './subheading';


export default function ProductionTableSection({moreData, gameState, leftHeadingWidth, isDuringOfflinePeriod} 
    : I_MoreSections)
    : JSX.Element {

    function formatDoneAt(num : number, gameState : T_GameState){
        if(num === -1){
            return "-";
        }
        if(num === 0){
            return "done";
        }
        let date = convertTimeIDToDate(num, gameState);
        return [
                `${date.getDate()}`, 
                `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
            ];
    }

    const outerBorderColour = isDuringOfflinePeriod ?
                                "border-greyBlue-500"
                                : "border-neutral-200";

    return (
        <section>
            <TimeGroupMoreSubheading text={"Eggs"} />
            <table className={"text-xs border-collapse"}>
                <ProductionTableHead 
                    moreData={moreData}
                />
                <tbody className={""}>
                    <ProductionTableRow 
                        headingStr={"stockpile"} 
                        data={moreData.stockpiles} 
                        formatData={(num : number) => num > 10000 ? toThousands(num) : num.toLocaleString()}
                        leftHeadingWidth={leftHeadingWidth}
                        outerBorderColour={outerBorderColour}
                    />
                    <ProductionTableRow 
                        headingStr={"rate p/m"} 
                        data={moreData.rates} 
                        formatData={(num : number) => Math.round(num).toLocaleString()}
                        leftHeadingWidth={leftHeadingWidth}
                        outerBorderColour={outerBorderColour}
                    />
                    <ProductionTableRow 
                        headingStr={"by end"} 
                        data={moreData.totalAtRates} 
                        formatData={toThousands}
                        leftHeadingWidth={leftHeadingWidth}
                        outerBorderColour={outerBorderColour}
                    />
                    <ProductionTableRow 
                        headingStr={"needed"} 
                        data={moreData.spendRemaining} 
                        formatData={toThousands} 
                        leftHeadingWidth={leftHeadingWidth}
                        outerBorderColour={outerBorderColour}
                    />
                    <ProductionTableRow 
                        headingStr={"finish @"} 
                        data={moreData.doneAt}
                        formatData={(num : number) => formatDoneAt(num, gameState)}
                        leftHeadingWidth={leftHeadingWidth} 
                        outerBorderColour={outerBorderColour}
                    />
                </tbody>
            </table>
        </section>
    )
}



function ProductionTableHead({moreData} 
    : { moreData : T_MoreData })
    : JSX.Element {

    return(
        <thead>
            <tr>
                <th></th>
                {
                    Object.keys(moreData.stockpiles).map(keyName => {
                        return  <th key={keyName} 
                                    className={"font-normal border w-12" + " " + resourceCSS[keyName as keyof typeof resourceCSS].badge}
                                    >
                                    { keyName.charAt(0) }
                                </th>
                    })
                }
            </tr>
        </thead>
    )
}


interface I_ProductionTableRow extends 
    Pick<I_MoreSections, "leftHeadingWidth">{
    headingStr : string, 
    data : T_ResourceColours, 
    formatData? : (num : number) => string | string[], 
    outerBorderColour : string
}
function ProductionTableRow({headingStr, data, formatData, leftHeadingWidth, outerBorderColour} 
    : I_ProductionTableRow)
    : JSX.Element {

    function handleFormattedData(key : string) : string | JSX.Element{
        if(formatData === undefined){
           return ""; 
        }
        let formatted = formatData(data[key as keyof typeof data]);
        if(typeof formatted === 'string'){
            return formatted;
        }
        return  <div>
                    <div>{formatted[0].padStart(2, "0")}</div>
                    <div>{formatted[1]}</div>
                </div>
    }

    return  <ProductionTableRowWrapper 
                headingStr={headingStr} 
                leftHeadingWidth={leftHeadingWidth} 
                outerBorderColour={outerBorderColour}
                >
                {
                    Object.keys(data).map(key => {
                        if(key === 'dust'){
                            return null;
                        }

                        let contents = formatData ? 
                                        handleFormattedData(key)
                                        : data[key as keyof typeof data].toLocaleString()

                        let alignCSS = contents === "done" ? "text-center" : "text-right";

                        return <ProductionTableCell key={key}
                                extraCSS={resourceCSS[key as keyof typeof resourceCSS].cell + " " + alignCSS}
                            > 
                            { formatData ? 
                                handleFormattedData(key)
                                : data[key as keyof typeof data].toLocaleString()
                            } 
                        </ProductionTableCell>
                    })
                }
            </ProductionTableRowWrapper>
}


function ProductionTableRowWrapper({headingStr, leftHeadingWidth, outerBorderColour, children} 
    : Pick<I_ProductionTableRow, "headingStr" | "leftHeadingWidth" | "outerBorderColour"> & { children : React.ReactNode })
    : JSX.Element {

    return (
        <tr className={""}>
            <th className={"text-xs pr-1 font-normal text-right border" + " " + leftHeadingWidth + " " + outerBorderColour}>
                {headingStr}
            </th>
            {children}
        </tr>
    )
}


function ProductionTableCell({extraCSS, children} 
    : { extraCSS : string, children : React.ReactNode })
    : JSX.Element {

    return  <td className={"px-1 border text-xs text-black" + " " + extraCSS}>
                {children}
            </td>
}



