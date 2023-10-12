/*
    "All Eggs" label and input, for use in both Active and Plan mode forms
*/

import { T_GameState } from "@/app/utils/types";

import Select from '../../subcomponents/select';

import { formatSelectValueStr } from "../utils/levelSelectHelpers";

import { Label, getUpgradeOptions } from "../gameState";

export interface I_AllEggs {
    gameState : T_GameState, 
    handleLevelChange : (e : React.ChangeEvent<HTMLSelectElement>) => void,
}
export default function AllEggs({gameState, handleLevelChange} 
    : I_AllEggs) 
    : JSX.Element {

    return  <div className={"flex gap-2"}>
                <Label htmlFor={"id_AllEggs"}>All Eggs</Label>
                <Select 
                    selectExtraCSS={undefined} 
                    id={"id_AllEggs"} 
                    initValue={gameState === null ? undefined : formatSelectValueStr("All", gameState.premiumInfo.allEggs)} 
                    options={getUpgradeOptions({ name: "All", max: 5 })} 
                    handleChange={handleLevelChange} 
                />
            </div>
}
