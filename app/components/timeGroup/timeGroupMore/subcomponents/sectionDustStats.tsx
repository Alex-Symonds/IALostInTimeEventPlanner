import { useRef, MutableRefObject } from "react";

import { MAX_TIME } from "@/app/utils/consts";
import { nbsp, toBillions, resourceCSS } from "@/app/utils/formatting";
import { convertTimeIDToDate, convertTimeIDToTimeRemaining, calcDHMString, getMonthName } from "@/app/utils/dateAndTimeHelpers";

import { I_MoreSections } from "../utils/types";
import TimeGroupMoreSubheading from './subheading';

import SideHeading from "./sideTableHeading";
import InfoButtonInHeader, { I_TooltipProps } from "./infoButtonInTh";
import { useAtEndInfoTooltip } from "../utils/useAtEndInfoTooltip";

export default function DustStatsSection({moreData, gameState, leftHeadingWidth} 
    : Pick<I_MoreSections, "moreData" | "gameState" | "leftHeadingWidth">)
    : JSX.Element {

    const adBoost : MutableRefObject<boolean | undefined> = useRef();
    adBoost.current = gameState.premiumInfo.adBoost;
    const atEndTooltipProps = useAtEndInfoTooltip(adBoost);

    function finishTimeAsStr(timeID : number){
        function convertTimeIDToStr(){
            let date = convertTimeIDToDate(timeID, gameState);
            let dateStr = date.getDate().toString().padStart(2, "0");
            let timeStr = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
           
            let DHM = convertTimeIDToTimeRemaining(MAX_TIME - timeID);
            return `${calcDHMString(DHM)} ${dateStr}${nbsp()}${getMonthName(date.getMonth())}${nbsp()}${timeStr}`;
        }

        return timeID === -1 ?
                "-"
                : convertTimeIDToStr();
    }

    const ratesAsStr = moreData.dustRates.map(ele => ele.toLocaleString());
    const totalsAsStr = moreData.dustTotals.map(ele => ele.toLocaleString());
    const finishAsStr = moreData.dustFinishTimes.map(ele => finishTimeAsStr(ele));



    return(
        <section>
            <TimeGroupMoreSubheading text={"Dust"} />
            <div className={"flex flex-col gap-2 mt-1"}>
                <DustRowWrapper>
                    <DustSubheading leftHeadingWidth={leftHeadingWidth}>
                        Stockpiled
                    </DustSubheading>
                    <div className={"font-medium flex flex-col items-end justify-center w-48 px-1 py-0.5 border" + " " + resourceCSS.dust.cell}>
                        {`${moreData.dustNow.toLocaleString()}`}&nbsp;{`(${toBillions(moreData.dustNow)})`}
                    </div>
                </DustRowWrapper>
                <DustRowWrapper>
                    <table className={"w-full border-collapse"}>
                        <thead>
                            <tr>
                                <th className={"" + " " + leftHeadingWidth}></th>
                                <th className={"w-24 text-center border bg-violet-300 border-violet-400 text-black"}>current</th>
                                <th className={"w-24 text-center border" + " " + resourceCSS.dust.badge}>max&nbsp;dust</th>
                            </tr>
                        </thead>
                        <tbody>
                            <DustTableRow heading={`rate${nbsp()}p/m`} data={ratesAsStr} />
                            <DustTableRow heading={`at${nbsp()}end`} data={totalsAsStr} tooltipProps={atEndTooltipProps} />
                            <DustTableRow heading={`1st${nbsp()}prize${nbsp()}@`} data={finishAsStr} />
                        </tbody>
                    </table>
                </DustRowWrapper>
            </div>
        </section>
    )
}


function DustTableRow({data, heading, tooltipProps}
    : { data : string[], heading : string, tooltipProps? : I_TooltipProps }){
    return  <tr className={"relative z-0"}>
                <SideHeading>
                    <div className={"flex flex-row-reverse justify-between"}>
                        <span>{heading}</span>
                        { tooltipProps !== undefined ?
                            <InfoButtonInHeader tooltipProps={tooltipProps} />
                            : null
                        }
                    </div>
                </SideHeading>
                {
                    data.map((ele, idx) => {
                        const columnCSS = idx === 1 ? resourceCSS.dust.cell : "bg-violet-50 border-violet-300 text-black";
                        return  <td key={idx}
                                    className={ "px-1 border" + " " + columnCSS }
                                    >
                                    {ele}
                                </td>
                    })
                }
            </tr>
}


function DustRowWrapper({children} 
    : {children : React.ReactNode})
    : JSX.Element {

    return  <div className={"flex text-xs text-right"}>
                {children}
            </div>
}


function DustSubheading({leftHeadingWidth, children} 
    : Pick<I_MoreSections, "leftHeadingWidth"> & {children : React.ReactNode})
    : JSX.Element {

    return  <h5 className={"text-xs pr-2 font-medium flex items-center justify-end" + " " + leftHeadingWidth}>
                {children}
            </h5>
}