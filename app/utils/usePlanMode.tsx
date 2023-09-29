import { useState, SetStateAction, Dispatch } from "react";

export enum PlanMode {
    "active",
    "plan"
}

export type T_PlanModeKit = {
    isPlan: boolean,
    isActive: boolean,
    setMode: Dispatch<SetStateAction<PlanMode | null>>,
}

export function usePlanMode(){
    const [mode, setMode] = useState<PlanMode | null>(null);

    return {
        isPlan: mode === PlanMode.plan,
        isActive: mode === PlanMode.active,
        setMode : setMode
    }
}