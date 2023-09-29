import { useState } from "react";
import { I_Modal } from "../../subcomponents/modal";


export interface I_UseSave extends Pick<I_Modal, "closeModal">{
    saveInputs : (keyName : string) => void,
    convertToKeyName : (keyName : string) => string,
}
export function useSave({closeModal, saveInputs, convertToKeyName}
    : I_UseSave)
    {

    const [name, setName] = useState("");
    const [showWarning, setShowWarning] = useState(false);
    const [showOverwrite, setShowOverwrite] = useState(false);
    

    function convertToValidKey(str : string) : string {
        return str.replace(/[^a-zA-Z0-9_]/g, '');
    }


    function handleChange(e : React.ChangeEvent<HTMLInputElement>){
        let proposedKey = convertToValidKey(e.target.value);
        let nameExists = convertToKeyName(proposedKey) in Object.keys(localStorage);

        if(nameExists){
            setShowWarning(true);
        }
        else {
            setShowWarning(false);
        }
        setName(proposedKey);
    }


    function handleSubmit(){
        let nameExists = Object.keys(localStorage).includes(convertToKeyName(name));
        if(nameExists){
            setShowOverwrite(true)
        }
        else{
            saveAndClose();
        }
    }


    function saveAndClose(){
        saveInputs(name);
        closeModal();
    }

    
    return {
        showOverwrite,
        setShowOverwrite,
        name,
        handleChange,
        saveAndClose,
        handleSubmit,
        showWarning
    }
}