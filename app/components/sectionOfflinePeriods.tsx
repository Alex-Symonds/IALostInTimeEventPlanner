import { calcDateDisplayStr, calcDateWithTimeDisplayStr, calcTimeDisplayStr } from "../utils/dateAndTimeHelpers";
import { convertOfflineTimeToDate, printOfflineTime } from "../utils/offlinePeriodHelpers";
import { T_GameState, T_OfflinePeriod } from "../utils/types";

import { EditButtonBox } from './sectionDisplayUserInput';
import { Button } from './forms/subcomponents/buttons';


interface I_SectionOfflinePeriods {
    offlinePeriods : T_OfflinePeriod[], 
    gameState : T_GameState,
    openModal : (idx : number | null) => void,
    idxEdit : number | null,
}
export default function SectionOfflinePeriods({offlinePeriods, openModal, gameState, idxEdit} 
    : I_SectionOfflinePeriods)
    : JSX.Element | null {

    if(gameState === null){
        return null;
    }

    return  <div className={'px-2'}>
                <OfflineDisplay 
                    offlinePeriods={offlinePeriods} 
                    gameState={gameState} 
                    openForm={openModal} 
                    idxEdit={idxEdit} 
                />
                <EditButtonBox 
                    openEditForm={() => openModal(null)} 
                    label={`add`} 
                />
            </div>
}


interface I_OfflineDisplay {
    offlinePeriods : T_OfflinePeriod[], 
    gameState : T_GameState, 
    openForm : any,
    idxEdit : number | null,
}
function OfflineDisplay({offlinePeriods, gameState, openForm, idxEdit} 
    : I_OfflineDisplay)
    : JSX.Element {

    const dayGroups = convertOfflinePeriodsToDayGroups(offlinePeriods);
    const isEmpty = dayGroups === undefined || dayGroups.length === 0;

    return  <div className={"overflow-y-auto overflow-x-hidden max-h-[calc(100vh-20rem)] plnMd:max-h-[17rem]"}>
                {
                    isEmpty ?
                        <p>None entered</p>
                        :
                        dayGroups.map((ele, idx) =>
                            <DayGroup key={`offlinePeriodsDayGroup${idx}`}
                                displayOfflinePeriods={ele} 
                                gameState={gameState}
                                openForm={openForm}
                                idxEdit={idxEdit}
                                dayGroupID={idx}
                            />
                        )
                }
            </div>
}


function DayGroup({displayOfflinePeriods, gameState, openForm, idxEdit, dayGroupID} 
    : Pick<I_OfflineDisplay, "gameState" | "idxEdit" | "openForm"> & { 
        displayOfflinePeriods : T_OfflinePeriodDisplayData[],
        dayGroupID : number
    })
    : JSX.Element{


    const startDate : Date = displayOfflinePeriods.length === 0 ?
        convertOfflineTimeToDate({dateOffset: dayGroupID, hours:0, minutes:0}, gameState.startTime)
        : convertOfflineTimeToDate(displayOfflinePeriods[0].start, gameState.startTime);
    
    return  <section>
                <h3 className={"font-semibold text-violet-700"}>
                    {calcDateDisplayStr(startDate)}
                </h3>
                <div className={"pl-12 pr-2"}>
                { displayOfflinePeriods.length === 0 ?
                    <p className={"mb-2"}>None entered</p>
                    :
                    <ol>
                    {
                        displayOfflinePeriods.map(ele => 
                            <OfflinePeriod key={`offlinePeriod${printOfflineTime(ele.start)}`}
                                offlinePeriod={ele} 
                                gameState={gameState} 
                                isBeingEdited={idxEdit === ele.index}
                                openForm={() => openForm(ele.index)}
                            />)
                    }
                    </ol>
                }
                </div>
            </section>


}


function OfflinePeriod({offlinePeriod, gameState, isBeingEdited, openForm}
    : Pick<I_OfflineDisplay, "gameState"> & {
        offlinePeriod : T_OfflinePeriodDisplayData,
        isBeingEdited : boolean,
        openForm : () => void,
    })
    : JSX.Element {

    let conditionalWrapperCSS = "";
    if(isBeingEdited){
        conditionalWrapperCSS = "text-gray-300";
    }

    let startDate : Date = convertOfflineTimeToDate(offlinePeriod.start, gameState.startTime);
    let endDate : Date = convertOfflineTimeToDate(offlinePeriod.end, gameState.startTime);

    return  <li key={`${printOfflineTime(offlinePeriod.start)}_${printOfflineTime(offlinePeriod.end)}`} 
                className={`grid [grid-template-columns:1fr_auto] grid-rows-1 items-center mb-2 ${conditionalWrapperCSS}`}
                >
                <div>
                    { calcTimeDisplayStr(startDate) }
                    {" - "}
                    { startDate.getDate() === endDate.getDate() ? 
                        calcTimeDisplayStr(endDate) 
                        : calcDateWithTimeDisplayStr(endDate)
                    }
                </div>

                <Button
                    size={'inline'}
                    colours={'secondary'}
                    onClick={openForm}
                    disabled={isBeingEdited}
                >
                    edit
                </Button>
            </li>
}


type T_OfflinePeriodDisplayData = T_OfflinePeriod & {
    index : number
}

function convertOfflinePeriodsToDayGroups(offlinePeriods : T_OfflinePeriod[]){

    if(offlinePeriods === undefined || offlinePeriods.length === 0){
        return offlinePeriods;
    }

    const dayGroups : any[] = [[], [], [], []];

    for(let i = 0; i < offlinePeriods.length; i++){
        const op = offlinePeriods[i];
        dayGroups[op.start.dateOffset].push({
            ...op,
            index: i
        })
    }
    return dayGroups;
}