import { useId, useState } from 'react';

import Modal, { ModalHeading, ModalSubmitButton, ModalFieldsWrapper, I_Modal } from './modal';
import { SelectWithLabel, T_OptionData } from './select';


interface I_PropsModalLoad extends Pick<I_Modal, "closeModal"> {
    loadInputs : (str : string) => void,
    loadOptions : () => T_OptionData[] | null,
}
export default function ModalLoad({closeModal, loadInputs, loadOptions} 
    : I_PropsModalLoad)
    : JSX.Element {

    let options = loadOptions();

    const [toLoad, setToLoad] = useState<null | string>(options === null ? null : options[0].valueStr);

    function handleChange(e : React.ChangeEvent<HTMLSelectElement>){
        setToLoad(e.target.value);
    }

    function handleSubmit(){
        if(toLoad === null){
            return;
        }
        loadInputs(toLoad);
        closeModal();
    }

    const id = useId();
    return (
        <Modal closeModal={closeModal}>
            <ModalHeading>
                Load Plan
            </ModalHeading>
            { options === null ?
                <ModalFieldsWrapper>
                    <p>There are no saved plans</p>
                </ModalFieldsWrapper>
                :
                <form onSubmit={() => handleSubmit()}>
                    <ModalFieldsWrapper>
                        <div className={"flex flex-col gap-1"}>
                            <SelectWithLabel 
                                id={id} 
                                selectExtraCSS={"px-2 py-1"} 
                                labelDisplay={"Plan to load"} 
                                options={options} 
                                handleChange={handleChange} 
                                initValue={options[0].valueStr} 
                                labelExtraCSS={undefined} 
                            />
                        </div>
                    </ModalFieldsWrapper>
                    <ModalSubmitButton label={"load"} extraCSS={''} disabled={false} />
                </form>
            }
        </Modal>
    )
}

