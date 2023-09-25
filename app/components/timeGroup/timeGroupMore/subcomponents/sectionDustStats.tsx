import { MAX_TIME } from "@/app/utils/consts";
import { nbsp, toBillions } from "@/app/utils/formatting";
import { convertTimeIDToDate, convertTimeIDToTimeRemaining, calcDHMString, getMonthName } from "@/app/utils/dateAndTimeHelpers";

import { I_MoreSections } from "../utils/types";
import TimeGroupMoreSubheading from './subheading';


export default function DustStatsSection({moreData, gameState, leftHeadingWidth, isDuringOfflinePeriod} 
    : I_MoreSections)
    : JSX.Element {

    const subheadingCSS = isDuringOfflinePeriod ?
                            "text-neutral-300"
                            : "text-neutral-600";

    function finishTimeAsStr(){
        function convertTimeIDToStr(){
            let date = convertTimeIDToDate(moreData.finishAt, gameState);
            let dateStr = date.getDate().toString().padStart(2, "0");
            let timeStr = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
           
            let DHM = convertTimeIDToTimeRemaining(MAX_TIME - moreData.finishAt);
            return `${calcDHMString(DHM)} ${dateStr}${nbsp()}${getMonthName(date.getMonth())}${nbsp()}${timeStr}`;
        }

        return moreData.finishAt === -1 ?
                "-"
                : convertTimeIDToStr();
    }

    return(
        <section>
            <TimeGroupMoreSubheading text={"Dust"} />
            <div className={"flex flex-col gap-2 mt-1"}>
                <DustRowWrapper>
                    <DustSubheading leftHeadingWidth={leftHeadingWidth}>
                        Dust now
                    </DustSubheading>
                    <DustRowContentWrapper>
                        {`${moreData.dustNow.toLocaleString()}`}
                    </DustRowContentWrapper>
                </DustRowWrapper>
                <DustRowWrapper>
                    <DustSubheading leftHeadingWidth={leftHeadingWidth}>
                        Projected <span className={subheadingCSS}>(all&nbsp;to&nbsp;dust)</span>
                    </DustSubheading>
                    <DustRowContentWrapper>
                        <div>{toBillions(moreData.allToDust.value)}</div>
                        <div>({moreData.allToDust.value.toLocaleString()})</div>
                    </DustRowContentWrapper>
                </DustRowWrapper>
                <DustRowWrapper>
                    <DustSubheading leftHeadingWidth={leftHeadingWidth}>
                        Finish at
                    </DustSubheading>
                    <DustRowContentWrapper>
                        {finishTimeAsStr()}
                    </DustRowContentWrapper>
                </DustRowWrapper>
            </div>
        </section>
    )
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

    return  <h5 className={"text-xs pr-2 font-normal" + " " + leftHeadingWidth}>
                {children}
            </h5>
}

function DustRowContentWrapper({children} 
    : {children : React.ReactNode})
    : JSX.Element {

    return  <div className={"flex flex-col items-end justify-center bg-violet-50 w-32 px-1 py-0.5 text-black"}>
                {children}
            </div>
}
