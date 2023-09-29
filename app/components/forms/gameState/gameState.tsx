import { Dispatch, SetStateAction, useState, ChangeEvent } from 'react';

import { T_GameState } from '../../../utils/types';

import { SelectWithLabel, T_OptionData } from '../subcomponents/select';
import Modal, { ModalFieldsWrapper, ModalHeading, ModalSubHeading } from '../../subcomponents/modal';
import { BadgeCost, BadgeMaxed } from '../../subcomponents/badges';

import { T_DATA_KEYS, getUnitDataFromJSON } from '../../../utils/getDataFromJSON';
import { T_PlanModeKit } from '@/app/utils/usePlanMode';
import FormActiveMode from './subcomponents/formActiveMode';
import FormSetMode from './subcomponents/formSetMode';
import FormPlanMode from './subcomponents/formPlanMode';

import ChangeModeButton from './subcomponents/changeModeButton';


export interface I_StatusFormSharedProps {
    setGameState : Dispatch<SetStateAction<T_GameState>>,
    gameState : T_GameState,
    closeModal : () => void
}
export default function StatusForm({setGameState, gameState, mode, closeModal}
    : I_StatusFormSharedProps & { mode : T_PlanModeKit })
    : JSX.Element {

    const [userWantsToChangeMode, setUserWantsToChangeMode] = useState(false);
    const [isInitialisingMode, _] = useState<boolean>(!mode.isActive && !mode.isPlan);

    return (
        <Modal closeModal={closeModal}>
            <ModalHeading>{mode.isActive ? "Active" : "Plan"} Game Status</ModalHeading>
            { !isInitialisingMode && !userWantsToChangeMode ?
                <ChangeModeButton changeMode={() => setUserWantsToChangeMode(true)} />
                : null
            }
            { mode.isActive && !userWantsToChangeMode ?
                <FormActiveMode 
                    gameState={gameState}
                    setGameState={setGameState}   
                    closeModal={closeModal}     
                    changeMode={() => setUserWantsToChangeMode(true)}
                    wantBackToMode={isInitialisingMode}
                />
                : mode.isPlan && !userWantsToChangeMode ?
                    <FormPlanMode 
                        gameState={gameState}          
                        setGameState={setGameState}        
                        closeModal={closeModal}
                        isInitialisingMode={isInitialisingMode}
                    />
                    : 
                    <FormSetMode 
                        isActive={ mode.isActive }
                        isPlan={ mode.isPlan }
                        setMode={ mode.setMode }
                        close={() => setUserWantsToChangeMode(false)}
                    />
            }

        </Modal>
    )

}


export function InputPageWrapper({ isVisible, heading, children }
    : { isVisible : boolean, heading? : string, children : React.ReactNode })
    : JSX.Element {

    const visibilityCSS = isVisible ? "" : "sr-only";
    return  <section className={"" + " " + visibilityCSS}>
                <ModalFieldsWrapper>
                {
                    heading === undefined ?
                    null
                    :
                    <h3 className={`pl-0.5 font-semibold text-black mb-3`}>
                        {heading}
                    </h3>
                }
                    { children }
                </ModalFieldsWrapper>
            </section>
}



// export function OLDInputPageWrapper({ isVisible, heading, children }
//     : { isVisible : boolean, heading? : string, children : React.ReactNode })
//     : JSX.Element {

//     const visibilityCSS = isVisible ? "" : "sr-only";
//     return  <section className={"flex flex-col" + " " + visibilityCSS}>
//                 {
//                     heading === undefined ?
//                     null
//                     :
//                     <ModalSubHeading>{heading}</ModalSubHeading>
//                 }

//                 <ModalFieldsWrapper>
//                     { children }
//                 </ModalFieldsWrapper>
//             </section>
// }


export function LevelsWrapper({children} 
    : { children : React.ReactNode })
    : JSX.Element {

    return  <div className={"pl-4 flex flex-col gap-5"}>
                {children}
            </div>

}

export function Label({htmlFor, tagName, extraCSS, children} 
    : { htmlFor : string, tagName? : keyof JSX.IntrinsicElements, extraCSS? : string, children : React.ReactNode })
    : JSX.Element {
 
    const Tag = tagName ?? 'label' as keyof JSX.IntrinsicElements;
    extraCSS = extraCSS ?? "font-semibold";

    return <Tag className={"block w-20 ml-2" + " " + extraCSS} htmlFor={htmlFor}>{children}</Tag>
}


interface I_PropsUnitLevelInput {
    keyName : string, 
    idStr : string, 
    labelStr : string, 
    initValue : string | undefined, 
    options : T_OptionData[], 
    handleLevelChange : (e : ChangeEvent<HTMLSelectElement>) => void, 
    currentValue : number
}
export function UnitLevelInput({keyName, idStr, labelStr, initValue, options, handleLevelChange, currentValue} 
    : I_PropsUnitLevelInput)
    : JSX.Element {

    const data = getUnitDataFromJSON(keyName as T_DATA_KEYS);
    return <div className={"flex"}>
                <SelectWithLabel
                    selectExtraCSS={"w-16"}
                    labelExtraCSS={"block w-16"}
                    id={idStr}
                    labelDisplay={labelStr}
                    initValue={initValue}
                    options={options}
                    handleChange={handleLevelChange}
                />
                <div className={"ml-2 flex gap-1"}>
                    {
                        currentValue === data.upgrades.length ?
                            <BadgeMaxed extraCSS={"opacity-40"}/>
                            :
                            data.upgrades[currentValue].costs.map((cost, idx) => {
                                return <BadgeCost key={idx} data={cost} extraCSS={undefined}/>
                            })
                    }
                </div>
            </div>
}


interface I_PropsInputNumberAsText {
    idStr : string, 
    value : number | string, 
    handleChange : (e : React.ChangeEvent<HTMLInputElement>) => void, 
    cssStr : string | undefined
};
export function InputNumberAsText({idStr, value, handleChange, cssStr} 
    : I_PropsInputNumberAsText)
    : JSX.Element {

    let valueStr = value.toString();
    if(typeof value !== 'number' || isNaN(value)){
        valueStr = "0";
    }

    if(cssStr === undefined || !cssStr.includes('border')){
        cssStr += ' border-neutral-300 ';
    }

    return <input 
                className={"border rounded-sm" + " " + cssStr} 
                type="text" 
                inputMode="numeric" 
                pattern="^[0-9]+$|^$" 
                id={idStr} 
                value={valueStr} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} 
            />
}


export function getInitValueForLevelSelect(name : string, gameState : T_GameState)
    : string | undefined {

    let initValue : string | undefined = undefined;
    let keyName = name.toLowerCase();
    if(gameState !== null){
        let level = gameState.levels[keyName as keyof typeof gameState.levels];
        initValue = formatValueStr(name, level);
    }
    return initValue;
}


export function formatValueStr(name : string, numStr : number)
    : string {

    return `${ name.toLowerCase() }_${ numStr.toString() }`
}


export function getUpgradeOptions({name, max} 
    : { name : string, max : number})
    : T_OptionData[] {

    let options = [];

    for(let i=0; i<=max; i++){
        let newOption = { valueStr: formatValueStr(name, i), displayStr: `${ i }` };
        options.push(newOption);
    }

    return options;
}




