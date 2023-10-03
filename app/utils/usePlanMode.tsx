import { useState, SetStateAction, Dispatch } from "react";

export enum PlanMode {
    "active",
    "plan"
}

export type T_PlanModeKit = {
    mode : PlanMode | null,
    setMode: Dispatch<SetStateAction<PlanMode | null>>,
}

export function usePlanMode(){
    const [mode, setMode] = useState<PlanMode | null>(null);

    return {
        mode,
        setMode : setMode
    }
}