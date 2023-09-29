import { calcDateDisplayStr, printOfflineTime } from "../utils/dateAndTimeHelpers";
import { convertOfflineTimeToDate } from "../utils/offlinePeriodHelpers";
import { T_GameState, T_OfflinePeriod } from "../utils/types";

import { DisplayInputSection, EditButtonBox } from './sectionDisplayUserInput';
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

    return  <DisplayInputSection title={"Offline Periods"}>
                <div className={'overflow-y-auto overflow-x-hidden max-h-[calc(100vh-5rem)] px-2'}>
                    <OfflineDisplay offlinePeriods={offlinePeriods} gameState={gameState} openForm={openModal} idxEdit={idxEdit} />
                    <EditButtonBox openEditForm={() => openModal(null)} label={`add`} />
                </div>
            </DisplayInputSection>

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

    return <div>
            { (offlinePeriods === undefined || offlinePeriods.length === 0) ?
                <p>None entered</p>
                :
                offlinePeriods.map((ele, idx) => {
                    let conditionalWrapperCSS = "";
                    if(idxEdit === idx){
                        conditionalWrapperCSS = "text-gray-300";
                    }

                    let startDate : Date = convertOfflineTimeToDate(ele.start, gameState.startTime);
                    let endDate : Date = convertOfflineTimeToDate(ele.end, gameState.startTime);

                    return  <div key={`${printOfflineTime(ele.start)}_${printOfflineTime(ele.end)}`} className={"flex justify-between items-center mb-2" + " " + conditionalWrapperCSS}>
                                <div className={"text-violet-800 font-bold"}>
                                    {idx + 1}
                                </div>
                                <div>
                                    {calcDateDisplayStr(startDate)} - {calcDateDisplayStr(endDate)}
                                </div>

                                <Button
                                    size={'inline'}
                                    colours={'secondary'}
                                    onClick={() => openForm(idx)}
                                    disabled={idxEdit === idx}
                                >
                                    edit
                                </Button>
                            </div>
                })
            }
            </div>

}



