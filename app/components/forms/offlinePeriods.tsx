import { useId, useRef, ChangeEvent } from 'react';


import { T_OfflinePeriod, T_GameState, T_TimeOfflinePeriod } from '../../utils/types';

import Modal, { ModalLegend, ModalFieldsWrapper } from '../subcomponents/modal';

import { SelectWithSRLabel, SelectHours, SelectMinutes } from './subcomponents/select';
import { Button } from './subcomponents/buttons';
import FieldsetWrapper from './subcomponents/fieldsetWrapper';

import { validDatesKit } from './utils/timeOptions';
import { useOfflineForm, I_UseOfflineForm } from './utils/useOfflineForm';
import { calcDateWithTimeDisplayStr } from '@/app/utils/dateAndTimeHelpers';
import { convertOfflineTimeToDate } from '@/app/utils/offlinePeriodHelpers';

/*
    Note: the dates on offline period times must be stored as an offset to the 
    startTime date.

    This is to support the use case "user wishes to plan their game in advance",
    where the user spreads their planning over several days. In this case, the
    offline periods should "move with" the altering startTime and the user
    should only need to adjust them if their schedule would alter.
*/

interface I_OfflineForm extends Pick<I_UseOfflineForm, "setOfflinePeriods" | "idxToEdit"> {
    closeForm : () => void,
    offlinePeriod: T_OfflinePeriod | null, 
    offlinePeriods: T_OfflinePeriod[] | null, 
    gameState : T_GameState,
}

type T_AriaError = {
    isInvalid : boolean,
    errorMessageId : string
}

export default function OfflineForm({closeForm, offlinePeriod, gameState, setOfflinePeriods, idxToEdit, offlinePeriods} 
    : I_OfflineForm)
    : JSX.Element {

    const refOfflinePeriods = useRef<T_OfflinePeriod[] | null>(null);
    refOfflinePeriods.current = offlinePeriods;
    
    let isNewOfflinePeriod = offlinePeriod === null;
    const {
            formOfflinePeriod,
            handleSubmit,
            handleSingleKeyChange,
            removeOfflinePeriod,
            errorMessage,
            showError,
        } = useOfflineForm({offlinePeriod, idxToEdit, setOfflinePeriods, closeForm, refOfflinePeriods});
    
    const id = useId();
    const ariaError : T_AriaError = {
        isInvalid: showError,
        errorMessageId: "offlinePeriodsError"
    }

    return  <Modal 
                heading={offlinePeriod === null ? 
                    "New Offline Period" 
                    : "Edit Offline Period"}
                closeModal={closeForm}
                >
                <form onSubmit={ (e) => handleSubmit(e) } >
                    <ModalFieldsWrapper>
                        <fieldset
                            aria-invalid={ariaError.isInvalid}
                            aria-errormessage={ariaError.errorMessageId}
                            >
                            <ModalLegend>
                                {offlinePeriod === null ? "Set" : "Update"} time range
                                { offlinePeriod === null ?
                                null
                                : <span className={"block font-normal text-neutral-600 text-xs"}>
                                    {"Period "}
                                    {calcDateWithTimeDisplayStr(convertOfflineTimeToDate(offlinePeriod.start, gameState.startTime))}
                                    &nbsp;to&nbsp;
                                    {calcDateWithTimeDisplayStr(convertOfflineTimeToDate(offlinePeriod.end, gameState.startTime))}
                                </span>
                            }
                            </ModalLegend>

                            <div className={"flex flex-col gap-5 items-center"}>
                                <OfflineTimeInput 
                                    legend={"from"} 
                                    idStr={id} 
                                    roleKey={"start"} 
                                    dhm={formOfflinePeriod.start} 
                                    handleSingleKeyChange={handleSingleKeyChange} 
                                    gameState={gameState} 
                                    showError={showError && (!formOfflinePeriod.isValid.start || !formOfflinePeriod.isValid.end)} 
                                />
                                <OfflineTimeInput 
                                    legend={"to"} 
                                    idStr={id} 
                                    roleKey={"end"} 
                                    dhm={formOfflinePeriod.end} 
                                    handleSingleKeyChange={handleSingleKeyChange} 
                                    gameState={gameState} 
                                    showError={showError && (!formOfflinePeriod.isValid.start || !formOfflinePeriod.isValid.end)} 
                                />
                            
                                {showError && (!formOfflinePeriod.isValid.start || !formOfflinePeriod.isValid.end) ?
                                    <ErrorMessage idStr={ariaError.errorMessageId} message={errorMessage}/>
                                    : null
                                }
                            </div>
                        </fieldset>
                    </ModalFieldsWrapper>
                    <div className={"flex justify-between"}>
                            <Button 
                                size={'twin'} 
                                colours={'primary'}
                                disabled={showError && !formOfflinePeriod.isValid}
                                extraCSS={isNewOfflinePeriod ? "border-2" : undefined}
                                >
                                {  isNewOfflinePeriod ? "add" : "update" }
                            </Button>
                            { isNewOfflinePeriod ?
                                null :
                                <Button 
                                    size={'twin'}
                                    colours={'warning'}
                                    htmlType={'button'}
                                    onClick={() => removeOfflinePeriod()}
                                    >
                                    delete
                                </Button>
                            }
                        </div>
                </form>
            </Modal>
}


function ErrorMessage({idStr, message} 
    : { idStr : string, message : string })
    : JSX.Element {

    return  <p 
                id={idStr}
                className={"text-sm border-l-4 border-red-500 bg-red-200 bg-opacity-30 text-black px-3 py-2"}
                aria-live={"polite"}
                >
                {message}
            </p>
}


interface I_OfflineFormProps extends Pick<I_OfflineForm, "gameState">{
    showError : boolean,
    legend : string, 
    idStr : string, 
    roleKey : string, 
    dhm : T_TimeOfflinePeriod, 
    handleSingleKeyChange : (roleKey : string, unitKey : string, value : number) => void
}
function OfflineTimeInput({ legend, idStr, roleKey, dhm, handleSingleKeyChange, gameState, showError } 
    : I_OfflineFormProps)
    : JSX.Element {

    const ID_D = idStr + "-" + roleKey + "-d";
    const ID_H = idStr + "-" + roleKey + "-h";
    const ID_M = idStr + "-" + roleKey + "-m";

    const {
        selectedDateAsIndex,
        validDates,
        convertValidDatesToOptions,
    } = validDatesKit({ gameState });


    function handleDateChange(e : ChangeEvent<HTMLSelectElement>){
        const idx = selectedDateAsIndex(e);
        if(idx === -1){
            // TODO: ERROR HANDLING
            return;
        }
        handleSingleKeyChange(roleKey, 'dateOffset', idx);
    }

    return (
        <FieldsetWrapper>
            <legend className={"font-semibold ml-2 mb-1 px-1"}>{legend}</legend>
            <div className={"flex flex-nowrap text-sm items-center"}>
                <SelectWithSRLabel
                    id={ID_D}
                    selectExtraCSS={undefined}
                    handleChange={handleDateChange}
                    initValue={validDates[dhm.dateOffset].date.toString()}
                    options={convertValidDatesToOptions(validDates)} 
                    visualLabel={""}
                    srLabel={"date"}
                    extraCSS={"pl-2 pr-1"}
                />
                <SelectHours 
                    id={ID_H}
                    handleChange={(e : ChangeEvent<HTMLSelectElement>) => handleSingleKeyChange(roleKey, 'hours', parseInt(e.target.value))}
                    initValue={dhm.hours.toString()}
                />
                <SelectMinutes
                    id={ID_M}
                    handleChange={(e : ChangeEvent<HTMLSelectElement>) => handleSingleKeyChange(roleKey, 'minutes', parseInt(e.target.value))}
                    initValue={dhm.minutes.toString()}
                />
                {
                    showError ?
                        <span className={"ml-3 text-red-500 font-bold text-xl"}>X</span>
                        : null
                }
            </div>
        </FieldsetWrapper>
    )
}

