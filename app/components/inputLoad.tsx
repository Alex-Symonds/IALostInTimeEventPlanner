import { useId, useState } from 'react';

import Modal, { ModalHeading, ModalSubmitButton, I_Modal } from './modal';
import Select, { T_OptionData } from './select';
import { SAVE_FILE_PREFIX } from '../utils/consts';

interface I_PropsModalLoad extends Pick<I_Modal, "closeModal"> {
    loadInputs : (str : string) => void,
}
export default function ModalLoad({closeModal, loadInputs} 
    : I_PropsModalLoad)
    : JSX.Element {

    let options = getOptions();

    const [toLoad, setToLoad] = useState<null | string>(options === null ? null : options[0].valueStr);

    const id = useId();

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

    function getOptions(){
        let options = getOptionsFromKeys(Object.keys(localStorage));
        if(options.length === 0){
            return null;
        }
        return options;
    }

    return (
        <Modal closeModal={closeModal}>
            <ModalHeading>
                Loading
            </ModalHeading>
            { options === null ?
                <p>There is no saved data to load</p>
                :
                <form onSubmit={() => handleSubmit()} className={"flex flex-col gap-1"}>
                    <Select id={id} selectExtraCSS={"px-2 py-1"} labelDisplay={"Load"} options={options} handleChange={handleChange} initValue={options[0].valueStr} labelExtraCSS={undefined} />
                    <ModalSubmitButton label={"load"} extraCSS={"mt-5"} disabled={false} />
                </form>
            }
        </Modal>
    )
}


function getOptionsFromKeys(keyArr : string[]) 
    : T_OptionData[] {
        
    return keyArr
            .filter(ele => ele.startsWith(SAVE_FILE_PREFIX))
            .map(ele => {
                let noPrefix = ele.replace(SAVE_FILE_PREFIX, "");
                return { displayStr: noPrefix, valueStr: noPrefix}
            });
}



