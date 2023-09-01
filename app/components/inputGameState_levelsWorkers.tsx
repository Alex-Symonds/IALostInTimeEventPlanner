import { T_GameState, T_Levels } from "../utils/types";
import {InputPageWrapper, LevelsWrapper, UnitLevelInput, getInitValueForLevelSelect, getUpgradeOptions } from "./inputGameState";


interface I_InputLevelsWorkers {
    isVisible : boolean,
    gameState : T_GameState,
    levels : T_Levels,
    handleLevelChange : (e : React.ChangeEvent<HTMLSelectElement>) => void, 
}
export default function InputLevelsWorkers({isVisible, gameState, levels, handleLevelChange} 
    : I_InputLevelsWorkers)
    : JSX.Element {

    const workerUpgrades = [
        { id: "id_Trinity", labelDisplay: "Trinity", optionsProps: { name: "Trinity", max: 10 }},
        { id: "id_Bronte", labelDisplay: "Bronte", optionsProps: { name: "Bronte", max: 10 }},
        { id: "id_Anne", labelDisplay: "Anne", optionsProps: { name: "Anne", max: 8 }},
        { id: "id_Petra", labelDisplay: "Petra", optionsProps: { name: "Petra", max: 10 }},
        { id: "id_Manny", labelDisplay: "Manny", optionsProps: { name: "Manny", max: 10 }},
        { id: "id_Tony", labelDisplay: "Tony", optionsProps: { name: "Tony", max: 10 }},
        { id: "id_Ruth", labelDisplay: "Ruth", optionsProps: { name: "Ruth", max: 8 }},
        { id: "id_Rex", labelDisplay: "Rex", optionsProps: { name: "Rex", max: 10 }},
    ]
    
    return <InputPageWrapper isVisible={isVisible} heading={"Worker Levels"} >
            <LevelsWrapper>
                
                { workerUpgrades.map(ele => {
                    let initValue : string | undefined = getInitValueForLevelSelect(ele.optionsProps.name, gameState);
                    let keyName = ele.optionsProps.name.toLowerCase();
                    return <UnitLevelInput key={ele.id} 
                                keyName={keyName} 
                                idStr={ele.id} 
                                labelStr={ele.labelDisplay} 
                                initValue={initValue}
                                options={getUpgradeOptions(ele.optionsProps)} 
                                handleLevelChange={handleLevelChange} 
                                currentValue={levels[keyName as keyof typeof levels]}
                            />
                    })
                }
            </LevelsWrapper>
        </InputPageWrapper>
}