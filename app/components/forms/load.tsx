import { useId, useState } from 'react';

import Modal, { ModalSubmitButton, ModalFieldsWrapper, I_Modal } from '../subcomponents/modal';
import { SelectWithLabel, T_OptionData } from './subcomponents/select';
import { Button } from './subcomponents/buttons';


interface I_PropsModalLoad extends Pick<I_Modal, "closeModal"> {
    loadInputs : (str : string) => void,
    loadOptions : () => T_OptionData[] | null,
    reset : () => void,
}
export default function ModalLoad({closeModal, loadInputs, loadOptions, reset} 
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

    const ResetBtn = <ResetButton handleClick={() => { reset(); closeModal(); }} />
    const id = useId();
    return (
        <Modal 
            heading={"Load Plan"}
            closeModal={closeModal}
            >
            { options === null ?
                <>
                <ModalFieldsWrapper>
                    <p>There are no saved plans</p>
                </ModalFieldsWrapper>
                { ResetBtn }
                </>
                :
                <form onSubmit={() => handleSubmit()}>
                    <ModalFieldsWrapper>
                        <div className={"flex flex-col gap-1 mx-1"}>
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
                    <div className={"flex justify-between"}>
                        <ModalSubmitButton label={"load"} extraCSS={''} disabled={false} />
                        { ResetBtn }
                    </div>
                </form>
            }

        </Modal>
    )
}

function ResetButton({handleClick} : { handleClick : () => void }){
    return  <Button 
                size={"twin"}
                colours={'warning'}
                htmlType={'button'}
                onClick={handleClick}
                >
                reset all
            </Button>
}

