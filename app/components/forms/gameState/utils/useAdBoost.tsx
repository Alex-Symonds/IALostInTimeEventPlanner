import { T_GameState } from "@/app/utils/types";
import { useState } from "react"

import { I_AdBoostInputEle } from "../subcomponents/fieldAdBoost";

export function useAdBoost({gameState}
    : { gameState : T_GameState })
    : I_AdBoostInputEle {

    const [hasAdBoost, setHasAdBoost] = useState<boolean>(gameState.premiumInfo.adBoost);

    function toggleAdBoost(){
        setHasAdBoost(prevState => !prevState);
    }

    return {
        hasAdBoost,
        toggleAdBoost,
    }
}