import {useState, Dispatch, SetStateAction} from 'react';

import { T_OfflinePeriod, T_GameState, T_Action, T_PremiumInfo, T_ModalWithToggle } from './types';


interface I_SaveAndLoad {
    actions : T_Action[],
    setActions : Dispatch<SetStateAction<T_Action[]>>,
    offlinePeriods : T_OfflinePeriod[],
    setOfflinePeriods : Dispatch<SetStateAction<T_OfflinePeriod[]>>,
    gameState : T_GameState,
    setGameState : Dispatch<SetStateAction<T_GameState>>,
}

type T_LocalStorage = {
    actions : T_Action[],
    offlinePeriods : T_OfflinePeriod[],
    premiumInfo : T_PremiumInfo | null
}

type T_SaveAndLoadOutput = {
    save : T_ModalWithToggle,
    load : T_ModalWithToggle
}
export default function useSaveAndLoad({actions, setActions, offlinePeriods, setOfflinePeriods, gameState, setGameState }
    : I_SaveAndLoad)
    : T_SaveAndLoadOutput {

    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showLoadModal, setShowLoadModal] = useState(false);

    // Saving/loading data is not the only reason to set a key, so use this prefix to filter out non-saves
    const SAVE_FILE_PREFIX = "saveFile_";


    function convertToKeyName(keySuffix : string) : string {
        return `${SAVE_FILE_PREFIX}${keySuffix}`;
    }


    function saveInputs(keySuffix : string){
        let inputs : T_LocalStorage = {
            actions: actions,
            offlinePeriods: offlinePeriods,
            premiumInfo: gameState.premiumInfo,
        }
        localStorage.setItem(convertToKeyName(keySuffix), JSON.stringify(inputs));
    }


    function loadInputs(keySuffix : string){
        let loadedJSONStr = localStorage.getItem(convertToKeyName(keySuffix));

        if(loadedJSONStr === null){
            // TODO: error handling: can't find value
            console.log(`${keySuffix} not found :(`)
            return;
        }

        let inputs = JSON.parse(loadedJSONStr);

        if('actions' in inputs && inputs.actions.length !== 0){
            setActions(inputs.actions);
        }

        if('offlinePeriods' in inputs && inputs.offlinePeriods.length !== 0){
            let validOfflinePeriods : T_OfflinePeriod[];
            if('date' in inputs.offlinePeriods[0].start){
                validOfflinePeriods = convertOldStyleOfflinePeriodsToCurrent(inputs);
            }
            else{
                validOfflinePeriods = inputs.offlinePeriods;
            }
            setOfflinePeriods(validOfflinePeriods);
        }

        if('premiumInfo' in inputs){
            setGameState(prev => {
                return {
                ...prev,
                premiumInfo: inputs.premiumInfo
                }
            });
        }
    }


    function convertOldStyleOfflinePeriodsToCurrent(inputs : T_LocalStorage){
        return inputs.offlinePeriods.map((oldStyleEle : any) => {
            let newStyleStart = Object.assign(oldStyleEle.start, {['dateOffset']: oldStyleEle.start['date'] });
            delete newStyleStart['date']

            let newStyleEnd = Object.assign(oldStyleEle.end, {['dateOffset']: oldStyleEle.end['date'] });
            delete newStyleEnd['date']

            return {
                start: newStyleStart,
                end: newStyleEnd,
            }
        });
    }


    function loadOptions(){
        let options =   Object.keys(localStorage)
                            .filter(ele => ele.startsWith(SAVE_FILE_PREFIX))
                            .map(ele => {
                                let noPrefix = ele.replace(SAVE_FILE_PREFIX, "");
                                return { displayStr: noPrefix, valueStr: noPrefix }
                            });

        if(options.length === 0){
            return null;
        }
        return options;
    }


    return {
        save: {
            isVisible: showSaveModal,
            closeModal: () => setShowSaveModal(false),
            toggle: () => setShowSaveModal(prev => !prev),
            action: saveInputs,
            data: {
                displayStr: "save", 
                convertToKeyName, 
            }
        },
        load: {
            isVisible: showLoadModal,
            closeModal: () => setShowLoadModal(false),
            toggle: () => setShowLoadModal(prev => !prev),
            action: loadInputs,
            data: {
                displayStr: "load",
                loadOptions
            }
        }
    }
}
  