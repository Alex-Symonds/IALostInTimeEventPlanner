import { useState, SetStateAction, Dispatch } from "react";

export enum PlanMode {
    "active",
    "plan"
}

export type T_PlanModeKit = {
    mode : PlanMode | null,
    setMode: (data : PlanMode | null) => void,
}

export function usePlanMode(){
    const [mode, setMode] = useState<PlanMode | null>(null);

    function updateMode(data : PlanMode | null){
        setMode(data);
    }

    return {
        mode,
        setMode : updateMode
    }
}