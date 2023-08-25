import { useId, useState } from 'react';

import { SAVE_FILE_PREFIX } from '../utils/consts';

import Modal, { ModalHeading, ModalSubmitButton, I_Modal } from './modal';
import { Button } from './buttons';


interface I_ModalSave extends Pick<I_Modal, "closeModal"> {
    saveInputs : (keyName : string) => void
}
export default function ModalSave({closeModal, saveInputs} 
    : I_ModalSave)
    : JSX.Element {

    const [name, setName] = useState("");
    const [showWarning, setShowWarning] = useState(false);
    const [showOverwrite, setShowOverwrite] = useState(false);
    
    function handleChange(e : React.ChangeEvent<HTMLInputElement>){
        let proposedKey = convertToValidKey(e.target.value);
        let nameExists = SAVE_FILE_PREFIX + proposedKey in Object.keys(localStorage);

        if(nameExists){
            setShowWarning(true);
        }
        else {
            setShowWarning(false);
        }
        setName(proposedKey);
    }

    function handleSubmit(){
        let nameExists = Object.keys(localStorage).includes(SAVE_FILE_PREFIX + name);
        if(nameExists){
            setShowOverwrite(true)
        }
        else{
            saveAndClose();
        }
    }

    function saveAndClose(){
        saveInputs(SAVE_FILE_PREFIX + name);
        closeModal();
    }

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
            Save
        </ModalHeading>
        <form onSubmit={() => handleSubmit()} className={"flex flex-col gap-1"}>
            <label htmlFor={id}>Name</label>
            <input className={"px-2 py-1 border border-neutral-200"} type={"text"} id={id} value={name} onChange={(e) => handleChange(e)}/>
            {
                showWarning ?
                <p>!: There is already a save called &quot;{name}&quot;</p>
                : null
            }
            <ModalSubmitButton label={"save"} extraCSS={undefined} disabled={false} />
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
        <div className={"flex flex-col gap-1"}>
            <p>There is already a save called &quot;{name}&quot;.</p>
            <div className={"flex justify-between mt-3"}>
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


function convertToValidKey(str : string) : string {
    return str.replace(/[^a-zA-Z0-9_]/g, '');
}



