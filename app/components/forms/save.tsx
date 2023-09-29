import { useId } from 'react';

import Modal, { ModalHeading, ModalSubmitButton, ModalFieldsWrapper, I_Modal } from '../subcomponents/modal';
import { Button } from './subcomponents/buttons';
import { I_UseSave, useSave } from './utils/useSave';


interface I_ModalSave extends Pick<I_Modal, "closeModal">, Pick<I_UseSave, "convertToKeyName" | "saveInputs"> {}
export default function ModalSave({closeModal, saveInputs, convertToKeyName} 
    : I_ModalSave)
    : JSX.Element {

    const {
        showOverwrite, 
        setShowOverwrite, 
        name, 
        handleChange,
        saveAndClose,
        handleSubmit,
        showWarning
    } = useSave({closeModal, saveInputs, convertToKeyName});

    return(
        <Modal closeModal={closeModal}>
            { showOverwrite ?
                <OverwriteQuestion name={name} goBack={() => setShowOverwrite(false)} acceptOverwrite={saveAndClose}/>
                : <SaveForm name={name} handleChange={handleChange} showWarning={showWarning} handleSubmit={handleSubmit} />
            }
        </Modal>
    )
}


interface I_SaveForm {
    name : string, 
    handleChange : (e : React.ChangeEvent<HTMLInputElement>) => void, 
    showWarning : boolean, 
    handleSubmit : () => void
}
function SaveForm({name, handleChange, showWarning, handleSubmit} 
    : I_SaveForm)
    : JSX.Element {

    const id = useId();
    return(
        <>
        <ModalHeading>
            Save Plan
        </ModalHeading>
        
        <form onSubmit={() => handleSubmit()}>
            <ModalFieldsWrapper>
                <div className={"flex flex-col gap-1"}>
                    <label htmlFor={id}>Save as</label>
                    <input className={"px-2 py-1 border border-neutral-200"} type={"text"} id={id} value={name} onChange={(e) => handleChange(e)}/>
                    {
                        showWarning ?
                        <p>!: There is already a save called &quot;{name}&quot;</p>
                        : null
                    }
                </div>
            </ModalFieldsWrapper>
            <ModalSubmitButton label={"save"} extraCSS={''} disabled={false} />
        </form>
        
        </>
    )
}

interface I_OverwriteQuestion {
    name : string, 
    goBack : () => void, 
    acceptOverwrite : () => void
}
function OverwriteQuestion({name, goBack, acceptOverwrite}
    : I_OverwriteQuestion)
    : JSX.Element {

    return(
        <>
        <ModalHeading>
            Warning
        </ModalHeading>
        
        <div className={"flex flex-col"}>
            <ModalFieldsWrapper>
                <p>There is already a save called &quot;{name}&quot;.</p>
            </ModalFieldsWrapper>
            <div className={"flex justify-between"}>
                <Button 
                    size={'twin'}
                    colours={'secondary'}
                    onClick={() => goBack()}
                    >
                    &laquo;&nbsp;back
                </Button>
                <Button 
                    size={'twin'}
                    colours={'primary'}
                    onClick={() => acceptOverwrite()}
                    >
                    overwrite&nbsp;&raquo;
                </Button>
            </div>
        </div>
        
        </>
    )
}






