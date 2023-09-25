import { T_GameState, T_Levels } from "../../../../utils/types";
import { LevelsWrapper, UnitLevelInput, getInitValueForLevelSelect, getUpgradeOptions } from "../gameState";

export interface I_InputLevelsOther {
    gameState : T_GameState,
    levels : T_Levels,
    handleLevelChange : (e : React.ChangeEvent<HTMLSelectElement>) => void, 
}

export default function InputLevelsOther({gameState, levels, handleLevelChange} 
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


    return  <>
                <SubSection heading={"Egg Levels"} extraCSS={"mt-0"}>
                    { productionUpgrades.map(ele => {
                            let initValue : string | undefined  = getInitValueForLevelSelect(ele.optionsProps.name, gameState);
                            let keyName = ele.optionsProps.name.toLowerCase();
                            return <UnitLevelInput key={`${ele.id}EggLevelField`} 
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
                </SubSection>

                <SubSection heading={"Buff Levels"}>
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
                </SubSection>
                
            </>

}


function SubSection({ heading, extraCSS, children }
    : { heading : string, extraCSS? : string, children : React.ReactNode } )
    : JSX.Element {

    return  <section className={extraCSS ?? "mt-7"}>
                <h3 className={"font-semibold pb-3"}>{heading}</h3>
                <LevelsWrapper>
                    { children }
                </LevelsWrapper>
            </section>
}
