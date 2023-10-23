/*
    Hook to support the "use game state" modal
*/
import { useState } from "react";
import { T_GameState, T_ModalData } from "./types";

import { usePlanMode } from "./usePlanMode";


interface I_UseGameStateModal {
    gameState : T_GameState,
    setGameState : (data: T_GameState) => void,
}

type T_UseGameStateModalOutput = 
    Pick<T_ModalData, "action" | "closeModal" | "isVisible" | "data"> & { 
    openModal: () => void ,
}

export default function useGameStateModal({gameState, setGameState}
    : I_UseGameStateModal)
    : T_UseGameStateModalOutput {

    const [showGameStateModal, setShowGameStateModal] = useState<boolean>(false);

    return {
        isVisible: showGameStateModal,
        openModal: () => setShowGameStateModal(true),
        closeModal: () => setShowGameStateModal(false),
        action: setGameState,
        data: {
          gameState,
          mode: usePlanMode()
        }
    }
}