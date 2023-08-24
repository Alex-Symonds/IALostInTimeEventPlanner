import { useState } from "react";

import { deepCopy } from "../utils/consts";
import { getDateDisplayStr, getStartTime, convertOfflineTimeToDate, printOfflineTime } from "../utils/dateAndTimeHelpers";
import { buttonPrimaryCSSColours, buttonPrimaryCSS_disabledColours, buttonSecondaryCSS } from "../utils/formatting";
import { T_GameState, T_OfflinePeriod } from "../utils/types";

import OfflineForm from './inputOfflinePeriods';
import { SectionToggled } from './sectionToggled';


interface I_SectionOfflinePeriods {
    offlinePeriods : T_OfflinePeriod[], 
    setOfflinePeriods : React.Dispatch<React.SetStateAction<T_OfflinePeriod[]>>, 
    gameState : T_GameState
}

export default function SectionOfflinePeriods({offlinePeriods, setOfflinePeriods, gameState} 
    : I_SectionOfflinePeriods)
    : JSX.Element | null {

    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [idxEdit, setIdxEdit] = useState<number | null>(null);

    if(gameState === null){
        return null;
    }

    function updateOfflinePeriod(newOfflinePeriod : T_OfflinePeriod) : void {
        if(idxEdit === null){
            // add a new offline period at the end
            setOfflinePeriods((prev : T_OfflinePeriod[]) => [
                ...prev,
                newOfflinePeriod
            ]);
            closeAndResetForm();
        }
        else{
            // update xisting offline period
            let deepCopyData : T_OfflinePeriod[] = deepCopy(offlinePeriods);
            deepCopyData[idxEdit] = newOfflinePeriod;
            setOfflinePeriods(deepCopyData);
            closeAndResetForm();
        }
    }

    function removeOfflinePeriod() : void{
        if(idxEdit === null){
            closeAndResetForm();
            return;
        }
        let deepCopyData : T_OfflinePeriod[] = JSON.parse(JSON.stringify(offlinePeriods));
        setOfflinePeriods(deepCopyData.slice(0, idxEdit).concat(deepCopyData.slice(idxEdit + 1)));
        closeAndResetForm();
    }

    function closeAndResetForm() : void{
        setIdxEdit(null);
        setIsEditMode(false);
    }

    function openForm(idx : number) : void{
        if(idx < offlinePeriods.length){
            setIdxEdit(idx);
            setIsEditMode(true);
        }
        // TODO: what if the idx is invalid?
    }


    return  <SectionToggled title={"Offline Periods"}>
                <div className={'overflow-y-auto overflow-x-hidden max-h-[calc(100vh-5rem)] px-2'}>
                <OfflineDisplay offlinePeriods={offlinePeriods} gameState={gameState} openForm={openForm} idxEdit={idxEdit} isEditMode={isEditMode}/>
                { isEditMode ?
                    <OfflineForm 
                        closeForm={ closeAndResetForm } 
                        offlinePeriod={idxEdit === null ? null : offlinePeriods[idxEdit]} 
                        updateOfflinePeriod={updateOfflinePeriod} 
                        removeOfflinePeriod={removeOfflinePeriod}
                        gameState={gameState} 
                        pos={idxEdit === null ? offlinePeriods.length + 1 : idxEdit + 1}
                    />
                    : <button className={buttonSecondaryCSS + " " + "w-24 mt-4"} onClick={() => setIsEditMode(true)}>+ more</button>   
                }
                </div>
            </SectionToggled>

}

interface I_OfflineDisplay {
    offlinePeriods : T_OfflinePeriod[], 
    gameState : T_GameState, 
    openForm : any,
    idxEdit : number | null,
    isEditMode : boolean
}
function OfflineDisplay({offlinePeriods, gameState, openForm, idxEdit, isEditMode} 
    : I_OfflineDisplay)
    : JSX.Element {

    let startedAt = getStartTime(gameState);

    return <div>
            { (offlinePeriods === undefined || offlinePeriods.length === 0) && !isEditMode ?
                <p>None entered</p>
                :
                offlinePeriods.map((ele, idx) => {
                    let conditionalWrapperCSS = "";
                    let conditionalButtonCSS = buttonPrimaryCSSColours;
                    
                    if(idxEdit === idx){
                        conditionalWrapperCSS = "text-gray-300";
                        conditionalButtonCSS = buttonPrimaryCSS_disabledColours;
                    }

                    let startDate : Date = convertOfflineTimeToDate(ele.start, startedAt);
                    let endDate : Date = convertOfflineTimeToDate(ele.end, startedAt);

                    return  <div key={`${printOfflineTime(ele.start)}_${printOfflineTime(ele.end)}`} className={"flex justify-between items-center mb-2" + " " + conditionalWrapperCSS}>
                                <div>
                                    #{idx + 1}
                                </div>
                                <div>
                                    {getDateDisplayStr(startDate)} - {getDateDisplayStr(endDate)}
                                </div>
                                <button className={"py-1 px-2 rounded text-xs" + " " + conditionalButtonCSS} onClick={() => openForm(idx)} disabled={idxEdit === idx}>edit</button>
                            </div>
                })
            }
            </div>

}



