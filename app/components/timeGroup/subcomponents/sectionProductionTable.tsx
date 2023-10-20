import { useRef, MutableRefObject } from 'react';

import { convertTimeIDToDate } from '@/app/utils/dateAndTimeHelpers';
import { resourceCSS, toThousands } from "@/app/utils/formatting";
import { T_GameState } from "@/app/utils/types";

import { I_MoreSections, T_MoreData, T_ResourceColours } from '../utils/types';
import TimeGroupMoreSubheading from './subheading';

import SideHeading from './sideTableHeading';
import InfoButtonInHeader, { I_TooltipProps } from './infoButtonInTh';
import { useAtEndInfoTooltip } from '../utils/useAtEndInfoTooltip';

export default function ProductionTableSection({moreData, gameState, leftHeadingWidth} 
    : Pick<I_MoreSections, "gameState" | "moreData" | "leftHeadingWidth">)
    : JSX.Element {

    const adBoost : MutableRefObject<boolean | undefined> = useRef();
    adBoost.current = gameState.premiumInfo.adBoost;
    const atEndTooltipProps = useAtEndInfoTooltip(adBoost);

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
                        data={moreData.eggStockpiles} 
                        formatData={(num : number) => num > 10000 ? toThousands(num) : num.toLocaleString()}
                        leftHeadingWidth={leftHeadingWidth}
                    />
                    <ProductionTableRow 
                        headingStr={"rate p/m"} 
                        data={moreData.eggRates} 
                        formatData={(num : number) => Math.round(num).toLocaleString()}
                        leftHeadingWidth={leftHeadingWidth}
                    />
                    <ProductionTableRow 
                        headingStr={"at end"} 
                        data={moreData.eggsTotalAtEnd} 
                        formatData={toThousands}
                        leftHeadingWidth={leftHeadingWidth}
                        tooltipProps={atEndTooltipProps}
                    />
                    <ProductionTableRow 
                        headingStr={"needed"} 
                        data={moreData.eggsSpendRemaining} 
                        formatData={toThousands} 
                        leftHeadingWidth={leftHeadingWidth}
                    />
                    <ProductionTableRow 
                        headingStr={"finish @"} 
                        data={moreData.eggsDoneAt}
                        formatData={(num : number) => formatDoneAt(num, gameState)}
                        leftHeadingWidth={leftHeadingWidth} 
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
                    Object.keys(moreData.eggStockpiles).map(keyName => {
                        const conditionalBold = keyName === 'yellow' ? "font-bold" : "font-medium";
                        return  <th key={keyName} 
                                    className={"border w-12" + " " + resourceCSS[keyName as keyof typeof resourceCSS].badge + " " + conditionalBold}
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
    tooltipProps? : I_TooltipProps
}
function ProductionTableRow({headingStr, data, formatData, leftHeadingWidth, tooltipProps} 
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
                tooltipProps={tooltipProps}
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


function ProductionTableRowWrapper({headingStr, leftHeadingWidth, tooltipProps, children} 
    : Pick<I_ProductionTableRow, "headingStr" | "leftHeadingWidth"> & { tooltipProps? : I_TooltipProps, children : React.ReactNode })
    : JSX.Element {

    return (
        <tr className={"relative z-0"}>
            <SideHeading extraCSS={"text-xs pr-1 text-right" + " " + leftHeadingWidth}>
                <div className={"flex flex-row-reverse justify-between"}>
                    {headingStr}
                    { tooltipProps !== undefined ?
                        <InfoButtonInHeader tooltipProps={tooltipProps} />
                        : null
                    }
                </div>
            </SideHeading>
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



