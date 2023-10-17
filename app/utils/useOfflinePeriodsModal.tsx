import { useState } from "react";

import { T_OfflinePeriod, T_ModalData, T_GameState } from "./types";

interface I_UseOfflinePeriodsModal {
    offlinePeriods: T_OfflinePeriod[],
    setOfflinePeriods: (data : T_OfflinePeriod[]) => void,
    gameState : T_GameState
}

type T_UseOfflinePeriodsOutput = 
    Pick<T_ModalData, "isVisible" | "closeModal" | "data" | "action" > & {
    openModal: (idx : number | null) => void,
}
export default function useOfflinePeriodsModal({offlinePeriods, setOfflinePeriods, gameState}
    : I_UseOfflinePeriodsModal)
    : T_UseOfflinePeriodsOutput {

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [idxToEdit, setIdxToEdit] = useState<number | null>(null);
  
    function openModal(idx : number | null) : void {
        let validIDX = idx === null || (idx >= 0 && idx < offlinePeriods.length) ?
            idx
            : null;
  
        setIdxToEdit(validIDX);
        setIsVisible(true);
    }
  
    function closeModal(){
        setIsVisible(false); 
        setIdxToEdit(null)
    }
 
    return {
        isVisible,
        openModal,
        closeModal,
        action: setOfflinePeriods,
        data: {
            idxToEdit,
            offlinePeriods,
            gameState,
            displayStr: "offline",
            offlinePeriod: idxToEdit === null ? null : offlinePeriods[idxToEdit],
        }
    }
}
