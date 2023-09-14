/*
    Hook to support the "use game state" modal
*/
import { Dispatch, SetStateAction, useState } from "react";
import { T_GameState, T_ModalData } from "./types";


interface I_UseGameStateModal {
    gameState : T_GameState,
    setGameState : Dispatch<SetStateAction<T_GameState>>,
}

type T_UseGameStateModalOutput = 
    Pick<T_ModalData, "action" | "closeModal" | "isVisible" | "data"> & { 
    openModal: () => void ,
}

export default function useGameStateModal({gameState, setGameState}
    : I_UseGameStateModal)
    : T_UseGameStateModalOutput {

    const [showGameStateModal, setShowGameStateModal] = useState<boolean>(true);

    return {
        isVisible: showGameStateModal,
        openModal: () => setShowGameStateModal(true),
        closeModal: () => setShowGameStateModal(false),
        action: setGameState,
        data: {
          gameState
        }
    }
}