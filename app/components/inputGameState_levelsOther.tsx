import { T_GameState, T_Levels } from "../utils/types";
import {InputPageWrapper, FormSubHeading, LevelsWrapper, UnitLevelInput, getInitValueForLevelSelect, getUpgradeOptions } from "./inputGameState";

interface I_InputLevelsOther {
    isVisible : boolean,
    gameState : T_GameState,
    levels : T_Levels,
    handleLevelChange : (e : React.ChangeEvent<HTMLSelectElement>) => void, 
}

export default function InputLevelsOther({isVisible, gameState, levels, handleLevelChange} 
    : I_InputLevelsOther)
    : JSX.Element {

    const speedOptions = [
        {valueStr: "Speed_0", displayStr: "0%"},
        {valueStr: "Speed_1", displayStr: "-5%"},
        {valueStr: "Speed_2", displayStr: "-10%"},
        {valueStr: "Speed_3", displayStr: "-15%"},
        {valueStr: "Speed_4", displayStr: "-20%"},
        {valueStr: "Speed_5", displayStr: "-25%"},
    ]
    
    const dustOptions = [
        {valueStr: "Dust_0", displayStr: "0%"},
        {valueStr: "Dust_1", displayStr: "25%"},
        {valueStr: "Dust_2", displayStr: "50%"},
        {valueStr: "Dust_3", displayStr: "75%"},
        {valueStr: "Dust_4", displayStr: "100%"},
        {valueStr: "Dust_5", displayStr: "125%"},
        {valueStr: "Dust_6", displayStr: "150%"},
    ]
    
    const productionUpgrades = [
        { id: "id_Blue", labelDisplay: "Blue", optionsProps: { name: "Blue", max: 4 }},
        { id: "id_Green", labelDisplay: "Green", optionsProps: { name: "Green", max: 3 }},
        { id: "id_Red", labelDisplay: "Red", optionsProps: { name: "Red", max: 2 }},
        { id: "id_Yellow", labelDisplay: "Yellow", optionsProps: { name: "Yellow", max: 1 }},
    ]


    return  <InputPageWrapper isVisible={isVisible} heading={undefined}>
                <FormSubHeading text={"Egg Levels"} />
                <LevelsWrapper>
                    { productionUpgrades.map((ele, idx) => {
                            let initValue : string | undefined  = getInitValueForLevelSelect(ele.optionsProps.name, gameState);
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

                <FormSubHeading text={"Buff Levels"} />
                <LevelsWrapper>
                    <UnitLevelInput
                        keyName={"speed"} 
                        idStr={"id_speed"} 
                        labelStr={"Speed"} 
                        initValue={gameState === null ? undefined : speedOptions[gameState.levels.speed].valueStr}
                        options={speedOptions} 
                        handleLevelChange={handleLevelChange} 
                        currentValue={levels.speed}
                    />
                    <UnitLevelInput
                        keyName={"dust"} 
                        idStr={"id_dust"} 
                        labelStr={"Dust"} 
                        initValue={gameState === null ? undefined : dustOptions[gameState.levels.dust].valueStr}
                        options={dustOptions} 
                        handleLevelChange={handleLevelChange} 
                        currentValue={levels.dust}
                    />
                </LevelsWrapper>
            </InputPageWrapper>

}

