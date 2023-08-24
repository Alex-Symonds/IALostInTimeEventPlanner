import { useId, useState } from 'react';

import { SAVE_FILE_PREFIX } from '../utils/consts';
import { buttonPrimaryCSSColours, buttonSecondaryCSSColours } from '../utils/formatting';

import Modal, { ModalHeading, ModalSubmitButton, I_Modal } from './modal';


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

    function handleCloseModal(){
        closeModal();
    }

    return(
        <Modal closeModal={handleCloseModal}>
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
            <ModalSubmitButton label={"submit"} extraCSS={undefined} disabled={false} />
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

    let sharedButtonCSS = "py-1 rounded w-2/5";
    return(
        <>
        <ModalHeading>
            Warning
        </ModalHeading>
        <div className={"flex flex-col gap-1"}>
            <p>There is already a save called &quot;{name}&quot;.</p>
            <div className={"flex justify-between mt-3"}>
                <button 
                    className={"border-2" + " " + sharedButtonCSS + " " + buttonSecondaryCSSColours} 
                    onClick={() => goBack()}
                    >
                     &laquo;&nbsp;back
                </button>
                <button 
                    className={sharedButtonCSS + " " + buttonPrimaryCSSColours} 
                    onClick={() => acceptOverwrite()}
                    >
                    &raquo;&nbsp;overwrite
                </button>
            </div>
        </div>
        </>
    )
}


function convertToValidKey(str : string) : string {
    return str.replace(/[^a-zA-Z0-9_]/g, '');
}



