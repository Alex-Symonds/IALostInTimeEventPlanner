import { IconClose } from "./icons";
import { Button } from './buttons';

export interface I_Modal {
    closeModal : () => void, 
    children : React.ReactNode
}
export default function Modal({closeModal, children} 
    : I_Modal)
    :JSX.Element {

    return(
        <div className={"fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"}>
            <div className={"relative max-h-[calc(100vh-10rem)] overflow-y-auto overflow-x-hidden min-w-[17rem] flex flex-col items-center px-2 py-2 bg-neutral-50 rounded max-w-full m-1"}>
            <CloseButton close={closeModal} />
                <div className={"flex flex-col w-full px-3 pb-3"}>
                    {children}
                </div>
            </div>
        </div>
    )
}


export function ModalHeading({children} 
    : { children : React.ReactNode })
    : JSX.Element {

    return  <h2 className={"font-bold text-lg pb-2 mt-3 self-start"}>
                {children}
            </h2>
}


export function ModalSubmitButton({label, extraCSS, disabled} 
    : { label? : string, extraCSS? : string, disabled? : boolean })
    : JSX.Element {

    let strCSS = extraCSS === undefined ? "mt-5" : extraCSS;
    return <Button 
                extraCSS={"justify-self-end w-full" + " " + strCSS} 
                colours={"primary"}
                size={"full"}
                disabled={disabled}
                >
                { label ?? "submit" }
            </Button>
}


interface I_CloseButton {
    close : () => void, 
    extraCSS? : string
};
export function CloseButton({close, extraCSS} 
    : I_CloseButton)
    : JSX.Element {

    extraCSS = extraCSS ?? "top-2 right-2"
    return <button className={"absolute font-bold [&_svg]:fill-gray-500 [&_svg]:hover:fill-gray-400" + " " + extraCSS} onClick={close}>
                <IconClose size={'20'} />
                <span className={'sr-only'}>close</span>
            </button>
}

