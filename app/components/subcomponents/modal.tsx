import { IconClose } from "./icons";
import { Button } from '../forms/subcomponents/buttons';

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
                <div className={"flex flex-col w-[280px] max-w-full px-3 pb-3 text-sm"}>
                    {children}
                </div>
            </div>
        </div>
    )
}


interface I_CloseButton {
    close : () => void, 
    extraCSS? : string
};
function CloseButton({close, extraCSS} 
    : I_CloseButton)
    : JSX.Element {

    extraCSS = extraCSS ?? "top-2 right-2";
    return <button className={"absolute font-bold [&_svg]:fill-gray-500 [&_svg]:hover:fill-gray-400" + " " + extraCSS} onClick={close}>
                <IconClose size={'20'} />
                <span className={'sr-only'}>close</span>
            </button>
}


export function ModalHeading({tagName, children} 
    : { tagName? : keyof JSX.IntrinsicElements, children : React.ReactNode })
    : JSX.Element {

    const Tag = tagName !== undefined ?
                    tagName
                    :'h2' as keyof JSX.IntrinsicElements;

    return  <Tag className={"font-bold text-lg mt-2 pl-0.5 self-start w-full border-b border-violet-500"}>
                {children}
            </Tag>
}


export function ModalSubHeading({tagName, children} 
    : { tagName? : keyof JSX.IntrinsicElements, children : React.ReactNode })
    : JSX.Element {

    const Tag = tagName !== undefined ?
                tagName
                :'h3' as keyof JSX.IntrinsicElements;

    return  <Tag className={"pl-0.5 text-md font-medium text-black"}>
                {children}
            </Tag>
}


export function ModalLegend({children} 
    : { children : React.ReactNode })
    : JSX.Element {

    return  <legend className={"pl-0.5 font-semibold mb-4 text-base"}>
                {children}
            </legend>
}       


export function ModalFieldsWrapper({children}
    : { children : React.ReactNode })
    : JSX.Element {

    return  <div className={"pt-6 pb-10"}>
                {children}
            </div>
}


export function ModalSubmitButton({label, extraCSS, disabled} 
    : { label? : string, extraCSS? : string, disabled? : boolean })
    : JSX.Element {

    return <Button 
                extraCSS={extraCSS} 
                colours={"primary"}
                size={"default"}
                disabled={disabled}
                >
                { label ?? "submit" }
            </Button>
}









