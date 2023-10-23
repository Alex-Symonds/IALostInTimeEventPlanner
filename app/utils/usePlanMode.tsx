import { useState } from "react";

export enum PlanMode {
    "active",
    "plan"
}

export type T_PlanModeKit = {
    mode : PlanMode | null,
    setMode: (data : PlanMode | null) => void,
    reset: () => void,
}

export function usePlanMode(){
    const REMEMBER_MODE_KEY = "lastUsedMode";

    const [mode, setMode] = useState<PlanMode | null>(loadMode());

    function updateMode(data : PlanMode | null){
        setMode(data);
        localStorage.setItem(REMEMBER_MODE_KEY, JSON.stringify(data)); 
    }

    function loadMode(){
        const JSONStr = localStorage.getItem(REMEMBER_MODE_KEY);
        if(JSONStr === null){
            return null;
        }
        const parsed = JSON.parse(JSONStr);
        return parsed;
    }

    function reset(){
        updateMode(null);
    }

    return {
        mode,
        setMode : updateMode,
        reset
    }
}